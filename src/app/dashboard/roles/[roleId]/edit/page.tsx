import { Metadata } from "next"
import { EditRole } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"

interface RoleEditPageProps {
  params: Promise<{
    roleId: string
  }>
}

export const metadata: Metadata = {
  title: "Edit Role | SPPG",
  description: "Edit informasi role dan permissions dalam sistem",
}

export default async function RoleEditPage({ params }: RoleEditPageProps) {
  const { roleId } = await params
  return (
    <PermissionGuard permission="system.config" redirectTo="/dashboard/roles">
      <EditRole roleId={roleId} />
    </PermissionGuard>
  )
}
