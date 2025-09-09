"use client"

import { SupplierManagement } from "./supplier-management"
import { SupplierPageActions } from "./supplier-page-actions"
import { PageContainer } from "@/components/layout"
import { useState } from "react"

export function SupplierPageClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <PageContainer
      title="Manajemen Supplier"
      description="Kelola daftar supplier, informasi kontak, dan status kemitraan untuk rantai pasok yang efektif."
      showBreadcrumb={true}
      actions={<SupplierPageActions onRefresh={handleRefresh} />}
    >
      <SupplierManagement key={refreshKey} />
    </PageContainer>
  )
}
