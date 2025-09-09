"use client"

import { DriversManagement } from "./drivers-management"
import { DriverPageActions } from "./driver-page-actions"
import { PageContainer } from "@/components/layout"
import { useState } from "react"

export function DriverPageClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <PageContainer
      title="Manajemen Driver"
      description="Kelola data driver, pantau performa pengiriman, dan monitor masa berlaku SIM."
      showBreadcrumb={true}
      actions={<DriverPageActions onRefresh={handleRefresh} />}
    >
      <DriversManagement key={refreshKey} />
    </PageContainer>
  )
}
