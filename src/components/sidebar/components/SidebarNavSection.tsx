"use client"

import { cn } from "@/lib/utils"
import { SidebarMenuItem } from "./SidebarMenuItem"
import type { MenuItem } from "../types/sidebar.types"

interface SidebarNavSectionProps {
  title: string
  items: MenuItem[]
  isCollapsed?: boolean
  onLinkClick?: () => void
  isMainSection?: boolean
  hasPermissionCheck?: (item: MenuItem) => boolean
}

export function SidebarNavSection({ 
  title, 
  items, 
  isCollapsed = false, 
  onLinkClick,
  isMainSection = false,
  hasPermissionCheck
}: SidebarNavSectionProps) {
  // Filter items based on permissions if permission check is provided
  const visibleItems = hasPermissionCheck 
    ? items.filter(hasPermissionCheck) 
    : items

  // Don't render if no visible items
  if (visibleItems.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-1.5", !isMainSection && "mt-5")}>
      {!isMainSection && !isCollapsed && (
        <div className="px-3 mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground/75 uppercase tracking-wide mb-2 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gradient-to-r from-primary/60 to-primary/40" />
            <span className="bg-gradient-to-r from-foreground/75 to-foreground/60 bg-clip-text">
              {title}
            </span>
          </h3>
          <div className="h-px bg-gradient-to-r from-border/30 via-primary/10 to-transparent"></div>
        </div>
      )}
      
      <div className="space-y-1">
        {visibleItems.map((item) => (
          <SidebarMenuItem
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            onLinkClick={onLinkClick}
          />
        ))}
      </div>
    </div>
  )
}
