import { Metadata } from 'next'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'
import { MenuCreateManagement } from './components'

export const metadata: Metadata = {
  title: 'Create Menu | SPPG Dashboard',
  description: 'Create new nutritious menu for SPPG program'
}

export default function MenuCreatePage() {
  return (
    <EnhancedPermissionGuard permission="menu.create">
      <div className="space-y-6">
        <MenuCreateManagement />
      </div>
    </EnhancedPermissionGuard>
  )
}
