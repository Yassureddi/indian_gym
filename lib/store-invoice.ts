import { SITE_NAME, CONTACT } from "@/lib/constants";
import { BRAND } from "@/lib/branding";
import type { StoreSale } from "@/lib/store-pos";
import { getCustomerTypeLabel } from "@/lib/store-pos";

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildStoreInvoiceHtml(sale: StoreSale): string {
  const rows = sale.items
    .map(
      (item) => `
      <tr>
        <td>${item.productName}<br><small>${item.brand}</small></td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(item.unitPrice)}</td>
        <td>${formatCurrency(item.lineTotal)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${sale.invoiceNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; background: #fff; color: #111; padding: 2rem; }
    .invoice { max-width: 720px; margin: 0 auto; border: 2px solid #d4af37; border-radius: 12px; overflow: hidden; }
    .header { display: flex; justify-content: space-between; gap: 1rem; padding: 1.5rem 2rem; background: #000; color: #fff; }
    .brand { color: #d4af37; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; }
    h1 { font-size: 1.25rem; margin-top: 0.25rem; }
    .meta { font-size: 0.8125rem; color: #ccc; margin-top: 0.5rem; line-height: 1.6; }
    .invoiceNo { text-align: right; font-size: 0.875rem; }
    .invoiceNo strong { display: block; font-size: 1.125rem; color: #d4af37; margin-top: 0.25rem; }
    .body { padding: 1.5rem 2rem; }
    .section { margin-bottom: 1.25rem; }
    h2 { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 0.5rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    th, td { padding: 0.625rem 0.5rem; text-align: left; border-bottom: 1px solid #eee; }
    th { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.06em; color: #666; }
    td:last-child, th:last-child { text-align: right; }
    .total { display: flex; justify-content: space-between; padding: 1rem 0; font-size: 1.125rem; font-weight: 700; border-top: 2px solid #d4af37; margin-top: 0.5rem; }
    .total span:last-child { color: #b8962e; }
    .footer { padding: 1rem 2rem 1.5rem; text-align: center; background: #fafafa; font-size: 0.8125rem; color: #666; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div>
        <div class="brand">${SITE_NAME}</div>
        <h1>Tax Invoice</h1>
        <div class="meta">${CONTACT.address}<br>Phone: ${CONTACT.phone}</div>
      </div>
      <div class="invoiceNo">
        Invoice<br><strong>${sale.invoiceNumber}</strong>
        Order: ${sale.id}<br>
        ${formatDateTime(sale.createdAt)}
      </div>
    </div>
    <div class="body">
      <div class="section">
        <h2>Customer</h2>
        <p><strong>${sale.customerName}</strong> (${getCustomerTypeLabel(sale.customerType)})</p>
        <p>Mobile: ${sale.mobile}${sale.memberId ? `<br>Member ID: ${sale.memberId}` : ""}</p>
      </div>
      <div class="section">
        <h2>Products</h2>
        <table>
          <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="total"><span>Grand Total</span><span>${formatCurrency(sale.grandTotal)}</span></div>
        <p style="margin-top:0.75rem;font-size:0.8125rem;">Payment: ${sale.paymentMethod.toUpperCase()}${
          sale.amountReceived != null
            ? ` · Received: ${formatCurrency(sale.amountReceived)} · Change: ${formatCurrency(sale.changeGiven ?? 0)}`
            : ""
        }</p>
        <p style="font-size:0.8125rem;margin-top:0.25rem;">Sold by: ${sale.soldByName}</p>
      </div>
    </div>
    <div class="footer">
      Thank you for shopping at ${BRAND.shortName}!<br>
      Stay strong. Train hard.
    </div>
  </div>
  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;
}

export function downloadStoreInvoice(sale: StoreSale) {
  const html = buildStoreInvoiceHtml(sale).replace(
    "<script>window.onload = function(){ window.print(); }</script>",
    ""
  );
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sale.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function printStoreInvoice(sale: StoreSale) {
  const html = buildStoreInvoiceHtml(sale);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
