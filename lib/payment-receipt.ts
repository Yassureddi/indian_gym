import { SITE_NAME, CONTACT } from "@/lib/constants";
import type { PaymentDetails } from "@/lib/admin/types";

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function buildReceiptText(details: PaymentDetails): string {
  const { payment, member, membership } = details;
  const lines = [
    `${SITE_NAME}`,
    "Payment Receipt",
    "─".repeat(40),
    `Receipt ID: ${payment.id}`,
    `Payment Date: ${formatDate(payment.date)}`,
    `Status: ${payment.status.toUpperCase()}`,
    "",
    "MEMBER DETAILS",
    `Name: ${member.name}`,
    `Member ID: ${member.id}`,
    `Phone: ${member.phone}`,
    member.email ? `Email: ${member.email}` : null,
    member.gender ? `Gender: ${member.gender}` : null,
    member.age != null ? `Age: ${member.age}` : null,
    member.joiningDate ? `Joining Date: ${formatDate(member.joiningDate)}` : null,
    "",
    "SERVICE DETAILS",
    `Plan: ${membership.planName}`,
    `Duration: ${membership.membershipDuration}`,
    `Plan Price: ${formatCurrency(membership.planPrice)}`,
    "",
    "PAYMENT INFORMATION",
    `Amount Paid: ${formatCurrency(payment.amount)}`,
    `Method: ${payment.method.toUpperCase()}`,
    payment.reference ? `Reference: ${payment.reference}` : null,
    "",
    "─".repeat(40),
    `Thank you for choosing ${SITE_NAME}.`,
    `Contact: ${CONTACT.phone}`,
  ];

  return lines.filter(Boolean).join("\n");
}

export function buildReceiptHtml(details: PaymentDetails): string {
  const { payment, member, membership } = details;
  const text = buildReceiptText(details);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Receipt ${payment.id}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, "Times New Roman", serif;
      background: #000;
      color: #fff;
      padding: 2rem;
      line-height: 1.6;
    }
    .receipt {
      max-width: 520px;
      margin: 0 auto;
      border: 1px solid #d4af37;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 40px rgba(212, 175, 55, 0.15);
    }
    .bar { width: 6px; background: linear-gradient(180deg, #f0d78c, #d4af37, #b8962e); }
    .wrap { display: flex; }
    .content { flex: 1; padding: 1.75rem 2rem; }
    .brand { color: #d4af37; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.25rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .amount { font-size: 2rem; color: #d4af37; font-weight: 700; margin: 1rem 0; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
    .completed { background: rgba(74,222,128,0.2); color: #4ade80; }
    .pending { background: rgba(212,175,55,0.2); color: #d4af37; }
    section { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); }
    h2 { font-size: 0.65rem; color: #d4af37; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.75rem; }
    .row { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.875rem; padding: 0.35rem 0; }
    .label { color: #a3a3a3; }
    .value { text-align: right; font-weight: 600; }
    .footer { margin-top: 1.5rem; font-size: 0.75rem; color: #737373; text-align: center; }
    pre { display: none; }
    @media print {
      body { padding: 0; background: #fff; color: #000; }
      .receipt { border-color: #000; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="wrap">
      <div class="bar"></div>
      <div class="content">
        <p class="brand">${SITE_NAME}</p>
        <h1>Payment Receipt</h1>
        <p class="label">Receipt ID: ${payment.id}</p>
        <p class="amount">${formatCurrency(payment.amount)}</p>
        <span class="badge ${payment.status}">${payment.status}</span>
        <section>
          <h2>Member Details</h2>
          <div class="row"><span class="label">Name</span><span class="value">${member.name}</span></div>
          <div class="row"><span class="label">Member ID</span><span class="value">${member.id}</span></div>
          <div class="row"><span class="label">Phone</span><span class="value">${member.phone}</span></div>
          ${member.gender ? `<div class="row"><span class="label">Gender</span><span class="value">${member.gender}</span></div>` : ""}
          ${member.age != null ? `<div class="row"><span class="label">Age</span><span class="value">${member.age}</span></div>` : ""}
          ${member.joiningDate ? `<div class="row"><span class="label">Joining Date</span><span class="value">${formatDate(member.joiningDate)}</span></div>` : ""}
        </section>
        <section>
          <h2>Service Details</h2>
          <div class="row"><span class="label">Plan</span><span class="value">${membership.planName}</span></div>
          <div class="row"><span class="label">Duration</span><span class="value">${membership.membershipDuration}</span></div>
          <div class="row"><span class="label">Plan Price</span><span class="value">${formatCurrency(membership.planPrice)}</span></div>
        </section>
        <section>
          <h2>Payment Information</h2>
          <div class="row"><span class="label">Method</span><span class="value">${payment.method.toUpperCase()}</span></div>
          <div class="row"><span class="label">Date</span><span class="value">${formatDate(payment.date)}</span></div>
          ${payment.reference ? `<div class="row"><span class="label">Reference</span><span class="value">${payment.reference}</span></div>` : ""}
        </section>
        <p class="footer">Thank you · ${CONTACT.phone}</p>
      </div>
    </div>
  </div>
  <pre>${text}</pre>
</body>
</html>`;
}

export function downloadPaymentReceipt(details: PaymentDetails) {
  const html = buildReceiptHtml(details);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `receipt-${details.payment.id}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function sharePaymentReceipt(
  details: PaymentDetails
): Promise<{ ok: true; method: "share" | "clipboard" | "whatsapp" } | { ok: false }> {
  const text = buildReceiptText(details);
  const title = `Payment Receipt — ${details.member.name}`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text });
      return { ok: true, method: "share" };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return { ok: false };
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return { ok: true, method: "clipboard" };
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  return { ok: true, method: "whatsapp" };
}
