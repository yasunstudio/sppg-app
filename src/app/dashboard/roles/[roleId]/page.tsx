import { Metadata } from "next"
import { RoleDetails } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"

interface RoleDetailsPageProps {
  params: Promise<{
    roleId: string
  }>
}

export const metadata: Metadata = {
  title: "Detail Role | SPPG",
  description: "Lihat detail role dan permissions yang dimiliki",
}

export default async function RoleDetailsPage({ params }: RoleDetailsPageProps) {
  const { roleId } = await params
  return (
    <PermissionGuard permission="system.config" redirectTo="/dashboard/roles">
      <RoleDetails roleId={roleId} />
    </PermissionGuard>
  )
}
