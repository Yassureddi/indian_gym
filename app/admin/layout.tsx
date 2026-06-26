import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { noIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = noIndexMetadata();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
