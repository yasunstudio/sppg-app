import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }
  
  // Jika sudah login, arahkan ke dashboard
  redirect("/dashboard")
}