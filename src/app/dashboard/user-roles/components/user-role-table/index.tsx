"use client"

import { UserRoleTableView } from './user-role-table-view'
import { UserRoleGridView } from './user-role-grid-view'
import { useResponsive } from '../hooks/use-responsive'
import type { UserRole } from '../utils/user-role-types'

interface UserRoleTableProps {
  userRoles: UserRole[]
  isFiltering: boolean
}

export function UserRoleTable({ userRoles, isFiltering }: UserRoleTableProps) {
  const { isMobile } = useResponsive()

  return isMobile ? (
    <UserRoleGridView userRoles={userRoles} isFiltering={isFiltering} />
  ) : (
    <UserRoleTableView userRoles={userRoles} isFiltering={isFiltering} />
  )
}

export { UserRoleTableView, UserRoleGridView }
