import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDashboardRoute } from "@/lib/dashboard-routing"
import LoginClientPage from "./login-client"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    // Get user roles and redirect to appropriate clean URL dashboard
    const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
    const dashboardRoute = await getDashboardRoute(userRoles)
    redirect(dashboardRoute)
  }

  return <LoginClientPage />
}
