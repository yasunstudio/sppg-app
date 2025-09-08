"use client"

import { VehicleManagement } from "./vehicle-management"
import { VehiclePageActions } from "./vehicle-page-actions"
import { PageContainer } from "@/components/layout"
import { useState } from "react"

export function VehiclePageClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <PageContainer
      title="Manajemen Kendaraan"
      description="Kelola armada kendaraan, lacak jadwal perawatan, dan monitor status pengiriman."
      showBreadcrumb={true}
      actions={<VehiclePageActions onRefresh={handleRefresh} />}
    >
      <VehicleManagement key={refreshKey} />
    </PageContainer>
  )
}
