import { Metadata } from 'next'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'
import { MenuPlanningManagement } from './components'

export const metadata: Metadata = {
  title: 'Menu Planning | SPPG Dashboard',
  description: 'Plan and manage daily menus for SPPG program'
}

export default function MenuPlanningPage() {
  return (
    <EnhancedPermissionGuard permission="menu.view">
      <div className="space-y-6">
        <MenuPlanningManagement />
      </div>
    </EnhancedPermissionGuard>
  )
}
