"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <AdminSidebar className="hidden lg:flex flex-shrink-0" />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)}
          />
          <AdminSidebar className="relative z-50 w-64 flex-shrink-0" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          onMobileSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          className="flex-shrink-0"
        />
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
