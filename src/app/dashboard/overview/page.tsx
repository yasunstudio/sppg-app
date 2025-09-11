import { redirect } from "next/navigation"

export default function OverviewPage() {
  // Redirect ke dashboard utama
  redirect("/dashboard")
}
