import { Metadata } from "next"
import { UserRoleDetails } from "../components/user-role-details"

export const metadata: Metadata = {
  title: "User Role Details | SPPG",
  description: "View detailed information about user role assignments.",
}

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserRoleDetailsPage({ params }: PageProps) {
  const { userId } = await params
  return <UserRoleDetails userId={userId} />
}
