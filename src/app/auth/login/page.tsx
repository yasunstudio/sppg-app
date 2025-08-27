import { Metadata } from "next"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import LoginClientPage from "./login-client"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return <LoginClientPage />
}
