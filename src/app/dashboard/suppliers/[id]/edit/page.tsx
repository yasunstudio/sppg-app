import { Metadata } from "next"
import { SupplierEdit } from "../../components"

export const metadata: Metadata = {
  title: "Edit Supplier | SPPG",
  description: "Edit supplier information and contact details",
}

export default async function SupplierEditPage() {
  return <SupplierEdit />
}
