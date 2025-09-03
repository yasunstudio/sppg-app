import { PermissionGuard } from '@/components/guards/permission-guard'
import { FoodSamplesManagement } from './components'

export default function FoodSamplesPage() {
  return (
    <PermissionGuard permission="quality.check">
      <FoodSamplesManagement />
    </PermissionGuard>
  )
}
