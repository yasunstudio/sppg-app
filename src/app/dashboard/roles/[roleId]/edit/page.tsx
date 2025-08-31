import { Metadata } from "next"
import { RoleEdit } from "../../components/role-edit"

export const metadata: Metadata = {
  title: "Edit Role | SPPG",
  description: "Edit role information and permissions",
}

export default async function RoleEditPage() {
  return <RoleEdit />
}
