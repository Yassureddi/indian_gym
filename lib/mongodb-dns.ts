import dns from "dns";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const DEFAULT_DNS_SERVERS = ["8.8.8.8", "8.8.4.4", "1.1.1.1"];

export interface ResolvedSrvRecord {
  name: string;
  port: number;
  priority: number;
  weight: number;
}

interface DoHAnswer {
  type: number;
  data: string;
}

interface DoHResponse {
  Answer?: DoHAnswer[];
}

/** Apply public DNS resolvers (local Windows resolvers often refuse Node SRV queries). */
export function applyMongoDnsServers(): string[] {
  const custom = process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const servers = custom?.length ? custom : DEFAULT_DNS_SERVERS;
  dns.setServers(servers);
  return servers;
}

function parseNslookupSrvOutput(output: string): ResolvedSrvRecord[] {
  const records: ResolvedSrvRecord[] = [];
  const blocks = output.split(/SRV service location:/i).slice(1);

  for (const block of blocks) {
    const portMatch = block.match(/port\s*=\s*(\d+)/i);
    const hostMatch = block.match(/svr hostname\s*=\s*(\S+)/i);
    const priorityMatch = block.match(/priority\s*=\s*(\d+)/i);
    const weightMatch = block.match(/weight\s*=\s*(\d+)/i);

    if (!portMatch || !hostMatch) continue;

    records.push({
      name: hostMatch[1].replace(/\.$/, ""),
      port: Number(portMatch[1]),
      priority: priorityMatch ? Number(priorityMatch[1]) : 0,
      weight: weightMatch ? Number(weightMatch[1]) : 0,
    });
  }

  return records;
}

function parseNslookupTxtOutput(output: string): string[] {
  const matches = output.match(/"([^"]+)"/g);
  if (!matches) return [];
  return matches.map((m) => m.replace(/^"|"$/g, ""));
}

/**
 * Resolve SRV via Windows nslookup (uses OS DNS stack).
 * Required when Node.js dns module is blocked but nslookup works (common on Windows LAN/VPN).
 */
async function resolveSrvViaNslookup(name: string): Promise<ResolvedSrvRecord[]> {
  const { stdout, stderr } = await execFileAsync(
    "nslookup",
    ["-type=SRV", name],
    { windowsHide: true, timeout: 15000 }
  );

  const combined = `${stdout}\n${stderr}`;
  const records = parseNslookupSrvOutput(combined);

  if (!records.length) {
    throw new Error(`nslookup returned no SRV records for ${name}`);
  }

  return records;
}

async function resolveTxtViaNslookup(name: string): Promise<string[]> {
  try {
    const { stdout, stderr } = await execFileAsync(
      "nslookup",
      ["-type=TXT", name],
      { windowsHide: true, timeout: 15000 }
    );
    return parseNslookupTxtOutput(`${stdout}\n${stderr}`);
  } catch {
    return [];
  }
}

/**
 * Resolve SRV via Cloudflare DNS-over-HTTPS (only works if Node can resolve hostnames).
 */
async function resolveSrvViaDoH(name: string): Promise<ResolvedSrvRecord[]> {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=SRV`;

  const response = await fetch(url, {
    headers: { Accept: "application/dns-json" },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`DNS-over-HTTPS SRV lookup failed (HTTP ${response.status})`);
  }

  const payload = (await response.json()) as DoHResponse;
  const answers = payload.Answer?.filter((entry) => entry.type === 33) ?? [];

  if (!answers.length) {
    throw new Error(`DNS-over-HTTPS returned no SRV records for ${name}`);
  }

  return answers.map((entry) => {
    const [priority, weight, port, ...targetParts] = entry.data.trim().split(/\s+/);
    const target = targetParts.join(" ").replace(/\.$/, "");

    return {
      priority: Number(priority),
      weight: Number(weight),
      port: Number(port),
      name: target,
    };
  });
}

async function resolveTxtViaDoH(name: string): Promise<string[]> {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=TXT`;

  const response = await fetch(url, {
    headers: { Accept: "application/dns-json" },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) return [];

  const payload = (await response.json()) as DoHResponse;
  return (
    payload.Answer?.filter((entry) => entry.type === 16).map((entry) =>
      entry.data.replace(/^"|"$/g, "").replace(/\\"/g, '"')
    ) ?? []
  );
}

async function resolveSrvNative(name: string): Promise<ResolvedSrvRecord[]> {
  applyMongoDnsServers();
  const records = await dns.promises.resolveSrv(name);
  return records.map((r) => ({
    name: r.name,
    port: r.port,
    priority: r.priority,
    weight: r.weight,
  }));
}

async function resolveTxtNative(name: string): Promise<string[]> {
  applyMongoDnsServers();
  const records = await dns.promises.resolveTxt(name);
  return records.map((chunks) => chunks.join(""));
}

async function resolveSrvWithFallbacks(
  name: string,
  log?: (message: string) => void
): Promise<ResolvedSrvRecord[]> {
  try {
    const srv = await resolveSrvNative(name);
    log?.(`SRV resolved via native DNS (${srv.length} hosts)`);
    return srv;
  } catch (nativeError) {
    const code = (nativeError as NodeJS.ErrnoException).code ?? "UNKNOWN";
    log?.(`Native SRV failed (${code})`);
  }

  if (process.platform === "win32") {
    try {
      const srv = await resolveSrvViaNslookup(name);
      log?.(`SRV resolved via nslookup (${srv.length} hosts)`);
      return srv;
    } catch (nslookupError) {
      const msg =
        nslookupError instanceof Error ? nslookupError.message : String(nslookupError);
      log?.(`nslookup SRV failed: ${msg}`);
    }
  }

  try {
    const srv = await resolveSrvViaDoH(name);
    log?.(`SRV resolved via DNS-over-HTTPS (${srv.length} hosts)`);
    return srv;
  } catch (dohError) {
    const msg = dohError instanceof Error ? dohError.message : String(dohError);
    throw new Error(
      `All SRV lookup methods failed. Native DNS refused/blocked and fallbacks failed (${msg}). ` +
        `Set MONGODB_URI_STANDARD in .env.local with a standard mongodb:// URI from Atlas Connect.`
    );
  }
}

async function resolveTxtWithFallbacks(
  name: string,
  log?: (message: string) => void
): Promise<string[]> {
  try {
    return await resolveTxtNative(name);
  } catch {
    /* try fallbacks */
  }

  if (process.platform === "win32") {
    try {
      const txt = await resolveTxtViaNslookup(name);
      if (txt.length) {
        log?.("TXT resolved via nslookup");
        return txt;
      }
    } catch {
      /* try DoH */
    }
  }

  try {
    return await resolveTxtViaDoH(name);
  } catch {
    return ["authSource=admin"];
  }
}

/**
 * Resolve Atlas SRV + TXT: native DNS → Windows nslookup → DNS-over-HTTPS.
 */
export async function resolveAtlasSrvRecords(
  clusterHostname: string,
  log?: (message: string) => void
): Promise<{ srv: ResolvedSrvRecord[]; txt: string[] }> {
  const srvName = `_mongodb._tcp.${clusterHostname}`;

  const srv = await resolveSrvWithFallbacks(srvName, log);
  const txt = await resolveTxtWithFallbacks(srvName, log);

  return { srv, txt };
}
