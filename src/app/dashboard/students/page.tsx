import { PermissionGuard } from '@/components/guards/permission-guard'
import { StudentsManagement } from './components'

export default function StudentsPage() {
  return (
    <PermissionGuard permission="students.view">
      <StudentsManagement />
    </PermissionGuard>
  )
}
