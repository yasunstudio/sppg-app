import { Metadata } from 'next'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'
import { MenuEditManagement } from './components'

export const metadata: Metadata = {
  title: 'Edit Menu | SPPG Dashboard',
  description: 'Edit menu planning with nutritional information and recipes for SPPG system',
}

export default function MenuEditPage() {
  return (
    <EnhancedPermissionGuard
      permission={['MENU_PLANNING', 'MENU_EDIT']}
      requireAll={true}
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to edit menu planning.
            </p>
            <p className="text-sm text-muted-foreground">
              Required: MENU_PLANNING and MENU_EDIT permissions
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <MenuEditManagement />
      </div>
    </EnhancedPermissionGuard>
  )
}
