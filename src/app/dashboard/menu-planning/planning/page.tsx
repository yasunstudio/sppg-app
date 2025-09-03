import { Metadata } from 'next'
import { PermissionGuard } from '@/components/guards/permission-guard'
import { MenuPlanningManagement } from './components'

export const metadata: Metadata = {
  title: 'Menu Planning | SPPG Dashboard',
  description: 'Plan and manage daily menus for SPPG program'
}

export default function MenuPlanningPage() {
  return (
    <PermissionGuard permission="menus.view">
      <div className="space-y-6">
        <MenuPlanningManagement />
      </div>
    </PermissionGuard>
  )
}
