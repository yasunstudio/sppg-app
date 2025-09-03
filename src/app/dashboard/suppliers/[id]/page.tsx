import { Metadata } from "next"
import { SupplierDetails } from "../components/supplier-details-v2"
import { PermissionGuard } from '@/components/guards/permission-guard'

export const metadata: Metadata = {
  title: "Detail Supplier | SPPG",
  description: "Lihat detail informasi supplier, riwayat transaksi, dan statistik lengkap dalam sistem SPPG",
  keywords: ["detail supplier", "informasi supplier", "riwayat transaksi", "statistik supplier", "SPPG"],
  openGraph: {
    title: "Detail Supplier | SPPG",
    description: "Informasi lengkap dan riwayat transaksi supplier",
    type: "website",
  }
}

interface SupplierDetailsPageProps {
  params: { id: string }
}

export default async function SupplierDetailsPage({ params }: SupplierDetailsPageProps) {
  return (
    <PermissionGuard permission="suppliers.view">
      <SupplierDetails supplierId={params.id} />
    </PermissionGuard>
  )
}
