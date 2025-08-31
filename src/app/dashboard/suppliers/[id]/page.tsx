import { Metadata } from "next"
import { SupplierDetails } from "../components"

export const metadata: Metadata = {
  title: "Supplier Details | SPPG",
  description: "View supplier details and transaction history",
}

export default async function SupplierDetailsPage() {
  return <SupplierDetails />
}
