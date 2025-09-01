import { Metadata } from "next"
import { PurchaseOrderAnalytics } from "../components/purchase-order-analytics"

export const metadata: Metadata = {
  title: "Purchase Orders Analytics | SPPG",
  description: "Comprehensive analytics and insights for purchase orders management.",
}

export default async function PurchaseOrderAnalyticsPage() {
  return <PurchaseOrderAnalytics />
}
