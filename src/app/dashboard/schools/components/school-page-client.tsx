"use client"

import SchoolManagement from "./school-management"
import { SchoolPageActions } from "./school-page-actions"
import { PageContainer } from "@/components/layout"
import { useState } from "react"

export function SchoolPageClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <PageContainer
      title="Manajemen Sekolah"
      description="Kelola data sekolah, informasi kepala sekolah, dan jumlah siswa."
      showBreadcrumb={true}
      actions={<SchoolPageActions onRefresh={handleRefresh} />}
    >
      <SchoolManagement key={refreshKey} />
    </PageContainer>
  )
}
