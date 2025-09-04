"use client"

import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"
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
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (isMobile) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {appLogo ? (
            <Image
              src={appLogo}
              alt={appName}
              width={32}
              height={32}
              className="rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">
                {appName.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {appName}
            </h1>
            {user && (
              <p className="text-xs text-muted-foreground">
                Welcome, {user.name}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={onMobileToggle}
          className={cn(
            "flex items-center justify-center rounded-lg p-2 transition-all duration-200",
            "hover:bg-accent/60 hover:text-accent-foreground hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "active:scale-95"
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
      "flex items-center border-b border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300",
      isCollapsed ? "justify-center p-3" : "justify-between p-4 min-h-[80px]"
    )}>
      {/* Logo and App Name */}
      <div className={cn(
        "flex items-center transition-all duration-300 min-w-0",
        isCollapsed ? "gap-0" : "gap-3 flex-1"
      )}>
        {appLogo ? (
          <Image
            src={appLogo}
            alt={appName}
            width={isCollapsed ? 28 : 36}
            height={isCollapsed ? 28 : 36}
            className="rounded-lg shadow-sm transition-all duration-300 flex-shrink-0"
          />
        ) : (
          <div className={cn(
            "bg-gradient-to-br from-primary via-primary to-primary/90 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 flex-shrink-0 ring-2 ring-primary/20",
            isCollapsed ? "w-7 h-7" : "w-9 h-9"
          )}>
            <span className={cn(
              "text-primary-foreground font-bold transition-all duration-300",
              isCollapsed ? "text-xs" : "text-sm"
            )}>
              {appName.charAt(0)}
            </span>
          </div>
        )}
        
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-base font-bold text-foreground leading-tight mb-0.5">
              {appName}
            </h1>
            <p className="text-xs text-muted-foreground leading-tight">
              School Feeding Program
            </p>
          </div>
        )}
      </div>

      {/* User Profile and Toggle */}
      <div className={cn(
        "flex items-center transition-all duration-300",
        isCollapsed ? "gap-0" : "gap-2 flex-shrink-0"
      )}>
        {/* User Profile (when not collapsed) */}
        {!isCollapsed && user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
                "hover:bg-accent/60 hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "text-sm max-w-[120px] border border-border/30"
              )}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-medium text-xs">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="text-foreground font-medium text-xs truncate max-w-[60px]">
                  {user.name}
                </span>
                <span className="text-muted-foreground text-[10px] leading-none">
                  Online
                </span>
              </div>
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform duration-200 flex-shrink-0 text-muted-foreground",
                showUserMenu ? "rotate-180" : "rotate-0"
              )} />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-popover border border-border rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <p className="text-xs text-primary font-medium capitalize">
                        {user.role || 'User'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      // Add profile action
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-xs">👤</span>
                    </div>
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      // Add logout action
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-destructive/10 text-destructive rounded-md transition-colors flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-400 text-xs">🚪</span>
                    </div>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center rounded-lg p-2 transition-all duration-200 flex-shrink-0 border border-border/30",
            "hover:bg-accent/60 hover:text-accent-foreground hover:scale-105 hover:border-border/60",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "active:scale-95",
            isCollapsed ? "mx-auto" : ""
          )}
          title={`${isCollapsed ? 'Expand' : 'Collapse'} sidebar`}
          aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} sidebar`}
        >
          <Menu className={cn(
            "transition-all duration-300",
            isCollapsed ? "h-4 w-4" : "h-5 w-5"
          )} />
        </button>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  )
}
