"use client"

import { useState } from 'react'
import { UserRoleStatsCards } from './user-role-stats/user-role-stats-cards'
import { UserRoleTable } from './user-role-table'
import { useUserRoles } from './hooks/use-user-roles'
import type { UserRoleFilters } from './utils/user-role-types'

export function UserRolePageClient() {
  const [showStats, setShowStats] = useState(true)
  
  // Default filters
  const filters: UserRoleFilters = {
    search: '',
    role: '',
    status: '',
    dateRange: '',
  }

  const {
    userRoles,
    stats,
    loading,
    error,
    refetch
  } = useUserRoles({
    filters,
    page: 1,
    limit: 10,
  })

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading user roles: {error}</p>
          <button onClick={() => refetch()}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <UserRoleStatsCards 
        stats={stats}
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
      />

      {/* Table */}
      <UserRoleTable
        userRoles={userRoles}
        isFiltering={loading}
      />
    </div>
  )
}
