import { Metadata } from "next"
import { UserProfileManagement } from "./components/user-profile-management"

export const metadata: Metadata = {
  title: "Profile Settings | SPPG",
  description: "Manage your profile settings and preferences.",
}

export default function ProfilePage() {
  return <UserProfileManagement />
}
