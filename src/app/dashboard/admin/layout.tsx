import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { AdminSidebar } from "@/components/layout/admin-sidebar"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing the application",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  )
}
