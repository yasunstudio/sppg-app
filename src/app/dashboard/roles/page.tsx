import { Metadata } from "next"
import { RolesManagement } from "./components/roles-management"

export const metadata: Metadata = {
  title: "Role Management | SPPG",
  description: "Comprehensive role management system for SPPG application.",
}

export default async function RolesPage() {
  return <RolesManagement />
}
