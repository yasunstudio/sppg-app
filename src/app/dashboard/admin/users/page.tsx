import { redirect } from "next/navigation"

export default async function AdminUsersPage() {
  // Redirect to main user management page which has full functionality
  redirect("/dashboard/users")
}
