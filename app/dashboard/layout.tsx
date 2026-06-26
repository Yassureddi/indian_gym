import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { noIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = noIndexMetadata();

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
