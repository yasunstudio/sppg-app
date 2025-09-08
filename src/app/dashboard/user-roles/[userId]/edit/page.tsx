import { Metadata } from "next"
import { EditUserRole } from "../../components/edit-user-role"

export const metadata: Metadata = {
  title: "Edit User Roles | SPPG",
  description: "Edit role assignments for the user.",
}

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserRoleEditPage({ params }: PageProps) {
  const { userId } = await params
  return <EditUserRole />
}
