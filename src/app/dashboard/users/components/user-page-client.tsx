"use client"

import { UserManagement } from "./user-management"
import { UserPageActions } from "./user-page-actions"
import { PageContainer } from "@/components/layout"
import { useState } from "react"

export function UserPageClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <PageContainer
      title="User Management"
      description="Manage user accounts, roles, and permissions for the SPPG management system."
      showBreadcrumb={true}
      actions={<UserPageActions onRefresh={handleRefresh} />}
    >
      <UserManagement key={refreshKey} />
    </PageContainer>
  )
}
