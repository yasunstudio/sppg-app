import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDashboardRoute } from "@/lib/dashboard-routing"

export default async function RootPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }
  
  // Get user roles and redirect to appropriate dashboard
  const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
  const dashboardRoute = await getDashboardRoute(userRoles)
  redirect(dashboardRoute)
}