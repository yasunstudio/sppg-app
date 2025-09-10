"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useEffect } from "react"
import { SidebarHeader } from "./SidebarHeader"
import SidebarNavSection from "./SidebarNavSection"
import type { User } from "@/lib/types/user"
import type { MenuSection, MenuItem } from "../types/sidebar.types"

interface SidebarMobileProps {
  isOpen: boolean
  onClose: () => void
  menuStructure: MenuSection[]
  hasPermissionCheck?: (item: MenuItem) => boolean
  user?: User | null
  activeMenuPath?: string
  onLinkClick?: () => void
  className?: string
  appName?: string
  appLogo?: string
}

export function SidebarMobile({
  isOpen,
  onClose,
  menuStructure,
  hasPermissionCheck,
  user,
  activeMenuPath,
  onLinkClick,
  className,
  appName = "SPPG Online",
  appLogo
}: SidebarMobileProps) {
  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleLinkClick = () => {
    onLinkClick?.()
    onClose() // Always close mobile sidebar after link click
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-80 transform transition-transform duration-300 ease-in-out lg:hidden",
          "bg-background/95 backdrop-blur-lg border-r border-border/50 shadow-2xl",
          "overflow-hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <SidebarHeader
          isCollapsed={false}
          isMobile={true}
          onToggle={() => {}} // Not used in mobile
          onMobileToggle={onClose}
          user={user}
          appName={appName}
          appLogo={appLogo}
        />

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 space-y-2">
            {/* Welcome Message */}
            {user && (
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-primary-foreground font-semibold">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Welcome back!</p>
                    <p className="text-xs text-muted-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-primary font-medium capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Sections */}
            <div className="space-y-1">
              {menuStructure.map((section) => (
                <SidebarNavSection
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  hasPermissionCheck={hasPermissionCheck}
                  onLinkClick={handleLinkClick}
                  isCollapsed={false}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 p-4 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs font-medium">SPPG Mobile</p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
            <button
              onClick={onClose}
              className={cn(
                "flex items-center justify-center rounded-lg p-2 transition-all duration-200",
                "hover:bg-accent/60 hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "text-muted-foreground"
              )}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
