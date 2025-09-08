"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import Image from "next/image"
import type { User } from "@/lib/types/user"

interface SidebarHeaderProps {
  isCollapsed: boolean
  isMobile?: boolean
  onToggle: () => void
  onMobileToggle?: () => void
  user?: User | null
  appName?: string
  appLogo?: string
}

export function SidebarHeader({
  isCollapsed,
  isMobile = false,
  onToggle,
  onMobileToggle,
  user,
  appName = "SPPG System",
  appLogo
}: SidebarHeaderProps) {

  if (isMobile) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-lg shadow-sm">
        <div className="flex items-center gap-4">
          {appLogo ? (
            <Image
              src={appLogo}
              alt={appName}
              width={36}
              height={36}
              className="rounded-xl shadow-lg ring-2 ring-primary/10"
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-primary/20">
              <span className="text-primary-foreground font-bold text-base">
                {appName.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text leading-tight">
              {appName}
            </h1>
            {user && (
              <p className="text-xs text-muted-foreground/80 leading-tight">
                Welcome, {user.name}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={onMobileToggle}
          className={cn(
            "flex items-center justify-center rounded-xl p-2.5 transition-all duration-200",
            "hover:bg-accent/60 hover:text-accent-foreground hover:scale-105 hover:shadow-md",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
            "active:scale-95 border border-border/40 bg-card/50 backdrop-blur-sm"
          )}
          aria-label="Close mobile menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <div className={cn(
      "border-b border-border/30 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-lg transition-all duration-300 shadow-sm flex-shrink-0",
      isCollapsed ? "p-4 h-16" : "p-4 h-16"
    )}>
      {/* Logo and App Name */}
      <div className={cn(
        "flex items-center transition-all duration-300",
        isCollapsed ? "justify-center" : "gap-3"
      )}>
        {appLogo ? (
          <Image
            src={appLogo}
            alt={appName}
            width={isCollapsed ? 32 : 40}
            height={isCollapsed ? 32 : 40}
            className="rounded-xl shadow-lg transition-all duration-300 flex-shrink-0 ring-2 ring-primary/10"
          />
        ) : (
          <div className={cn(
            "bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 flex-shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background/50",
            isCollapsed ? "w-8 h-8" : "w-10 h-10"
          )}>
            <span className={cn(
              "text-primary-foreground font-bold transition-all duration-300",
              isCollapsed ? "text-sm" : "text-base"
            )}>
              {appName.charAt(0)}
            </span>
          </div>
        )}
        
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-lg font-bold text-foreground leading-tight mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {appName}
            </h1>
            <p className="text-xs text-muted-foreground/80 leading-tight font-medium">
              School Feeding Program System
            </p>
          </div>
        )}
      </div>

      {/* Note: User profile removed to avoid duplication with header */}
      {/* User profile is now centralized in HeaderRight component */}
      
      {/* Note: Toggle button moved to header to avoid duplication */}
      {/* Toggle functionality is now centralized in HeaderLeft component */}
    </div>
  )
}
