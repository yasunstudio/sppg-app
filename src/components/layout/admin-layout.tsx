"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  showBreadcrumb?: boolean
  fullWidth?: boolean
  noPadding?: boolean
}

export function AdminLayout({ 
  children, 
  title,
  description,
  className,
  showBreadcrumb = true,
  fullWidth = false,
  noPadding = false
}: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState))
    }
    setIsLoaded(true)
  }, [])

  // Clean up body scroll when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Also clean up when sidebar closes
  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  // Check if current route is admin route
  const isAdminRoute = pathname.startsWith('/dashboard/admin')
  
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
  }

  const toggleMobileSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    
    // Prevent body scroll when mobile sidebar is open
    if (newState) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="lg:pl-72">
          <Header 
            onMobileSidebarToggle={toggleMobileSidebar}
            sidebarOpen={sidebarOpen}
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={toggleSidebar}
          />
          <main className={cn(
            "bg-background text-foreground",
            noPadding ? "" : "p-4 sm:p-6 lg:p-8",
            className
          )}>
            <div className={cn(
              "mx-auto",
              fullWidth ? "max-w-none" : "max-w-7xl"
            )}>
              {title && (
                <div className="mb-6 space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Admin route layout
  if (isAdminRoute) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Desktop Admin Sidebar */}
        <AdminSidebar className="hidden lg:flex flex-shrink-0" />
        
        {/* Mobile Admin Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
            />
            <AdminSidebar className="relative z-50 w-64 flex-shrink-0" />
          </div>
        )}

        {/* Admin Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMobileSidebarToggle={toggleMobileSidebar}
            sidebarOpen={sidebarOpen}
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={toggleSidebar}
          />
          <main className={cn(
            "flex-1 overflow-auto bg-background text-foreground",
            noPadding ? "" : "p-4 sm:p-6 lg:p-8",
            className
          )}>
            <div className={cn(
              "mx-auto h-full",
              fullWidth ? "max-w-none" : "max-w-7xl"
            )}>
              {title && (
                <div className="mb-6 space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Regular dashboard layout - Fix gap issue with proper layout
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Fixed positioning */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        isMobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content Area - No gap with sidebar */}
      <div className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        // Use padding instead of margin to eliminate gap - updated for wider sidebar
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-72'
      )}>
        {/* Header - Full width, no gap */}
        <Header 
          onMobileSidebarToggle={toggleMobileSidebar}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={toggleSidebar}
        />
        
        {/* Main content */}
        <main className={cn(
          "bg-background text-foreground overflow-x-hidden",
          noPadding ? "" : "p-4 sm:p-6 lg:p-8",
          className
        )}>
          <div className={cn(
            "mx-auto",
            fullWidth ? "max-w-none" : "max-w-7xl"
          )}>
            {title && (
              <div className="mb-6 space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
