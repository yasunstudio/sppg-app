import { Metadata } from "next"
import { PurchaseOrderDetails } from "../components/purchase-order-details"

export const metadata: Metadata = {
  title: "Purchase Order Details",
  description: "View purchase order details and information",
}

export default async function PurchaseOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PurchaseOrderDetails id={id} />
}
