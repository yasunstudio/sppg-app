import { Metadata } from "next"
import { UserRolesManagement } from "./components/user-roles-management"

export const metadata: Metadata = {
  title: "User Role Management | SPPG",
  description: "Comprehensive user role management system for SPPG application.",
}

export default async function UserRolesPage() {
  return <UserRolesManagement />
}
