import { Metadata } from 'next'
import { PermissionGuard } from '@/components/guards/permission-guard'
import { MenuEditManagement } from './components'

export const metadata: Metadata = {
  title: 'Edit Menu | SPPG Dashboard',
  description: 'Edit menu planning with nutritional information and recipes for SPPG system',
}

export default function MenuEditPage() {
  return (
    <PermissionGuard permission="menus.edit">
      <div className="space-y-6">
        <MenuEditManagement />
      </div>
    </PermissionGuard>
  )
}
