import { Metadata } from "next"
import { PurchaseOrderCreate } from "../components/purchase-order-create"

export const metadata: Metadata = {
  title: "Create Purchase Order | SPPG",
  description: "Create a new purchase order for procurement management.",
}

export default async function CreatePurchaseOrderPage() {
  return <PurchaseOrderCreate />
}
