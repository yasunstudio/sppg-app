"use client"

import StudentManagement from "./student-management"
import { StudentPageActions } from "./student-page-actions"
import { PageContainer } from "@/components/layout"
import { useState } from "react"

export function StudentPageClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <PageContainer
      title="Manajemen Siswa"
      description="Kelola data siswa, informasi sekolah, dan konsultasi gizi."
      showBreadcrumb={true}
      actions={<StudentPageActions onRefresh={handleRefresh} />}
    >
      <StudentManagement key={refreshKey} />
    </PageContainer>
  )
}
