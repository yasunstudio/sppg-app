import { Metadata } from "next"
import { SupplierCreate } from "../components"

export const metadata: Metadata = {
  title: "Create Supplier | SPPG",
  description: "Create a new supplier with contact information",
}

export default async function SupplierCreatePage() {
  return <SupplierCreate />
}
