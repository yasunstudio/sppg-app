"use client"

import { ClassManagement } from "./class-management"
import { ClassPageActions } from "./class-page-actions"
import { PageContainer } from "@/components/layout"
import { useState } from "react"

export function ClassPageClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <PageContainer
      title="Manajemen Kelas"
      description="Kelola data kelas, monitor jumlah siswa, dan kelola distribusi makanan per kelas."
      showBreadcrumb={true}
      actions={<ClassPageActions onRefresh={handleRefresh} />}
    >
      <ClassManagement key={refreshKey} />
    </PageContainer>
  )
}

export default ClassPageClient
