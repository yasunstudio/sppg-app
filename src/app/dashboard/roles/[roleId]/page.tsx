import { Metadata } from "next"
import { RoleDetails } from "../components/role-details"

export const metadata: Metadata = {
  title: "Role Details | SPPG",
  description: "View role details and permissions",
}

export default async function RoleDetailsPage() {
  return <RoleDetails />
}
