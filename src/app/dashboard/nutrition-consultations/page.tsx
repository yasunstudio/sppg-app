import { PermissionGuard } from '@/components/guards/permission-guard'
import { NutritionConsultationsManagement } from './components'

export default function NutritionConsultationsPage() {
  return (
    <PermissionGuard permission="nutrition.consult">
      <NutritionConsultationsManagement />
    </PermissionGuard>
  )
}
