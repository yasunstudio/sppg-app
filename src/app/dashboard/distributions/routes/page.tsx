'use client'

import { RoutePlanning } from '../components/route-planning'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export default function RoutesPage() {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.view">
      <RoutePlanning />
    </EnhancedPermissionGuard>
  )
}
