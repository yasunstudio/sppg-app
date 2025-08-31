import { Metadata } from "next"
import { RoleCreate } from "../components/role-create"

export const metadata: Metadata = {
  title: "Create Role | SPPG",
  description: "Create a new role with specific permissions",
}

export default async function RoleCreatePage() {
  return <RoleCreate />
}
