import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginClientPage from "./login-client"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    // Redirect authenticated users to dashboard
    redirect("/dashboard")
  }

  return <LoginClientPage />
}
