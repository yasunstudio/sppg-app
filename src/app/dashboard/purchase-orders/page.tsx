import { Metadata } from "next"
import { PurchaseOrdersManagement } from "./components/purchase-orders-management"

export const metadata: Metadata = {
  title: "Purchase Orders Management | SPPG",
  description: "Comprehensive purchase orders management system for SPPG application.",
}

export default async function PurchaseOrdersPage() {
  return <PurchaseOrdersManagement />
}
