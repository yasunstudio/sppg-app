import { Metadata } from "next"
import { UserRoleEdit } from "../../components/user-role-edit"

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
  return <UserRoleEdit userId={userId} />
}
