"use client"

import { WasteRecordManagement } from "./waste-record-management"
import { WastePageActions } from "./waste-page-actions"
import { PageContainer } from "@/components/layout"
import { useState } from "react"

export function WastePageClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <PageContainer
      title="Manajemen Limbah"
      description="Kelola catatan limbah dan monitoring pengurangan waste untuk operasional yang berkelanjutan"
      showBreadcrumb={true}
      actions={<WastePageActions onRefresh={handleRefresh} />}
    >
      <WasteRecordManagement key={refreshKey} />
    </PageContainer>
  )
}
