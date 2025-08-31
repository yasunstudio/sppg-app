import { Metadata } from "next"
import { PurchaseOrderEdit } from "../../components/purchase-order-edit"

export const metadata: Metadata = {
  title: "Edit Purchase Order | SPPG",
  description: "Edit purchase order information and items.",
}

export default async function PurchaseOrderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PurchaseOrderEdit id={id} />
}
