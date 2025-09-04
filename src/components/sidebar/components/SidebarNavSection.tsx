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
    <div className={cn("space-y-1", !isMainSection && "mt-6")}>
      {!isMainSection && !isCollapsed && (
        <div className="px-3 mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 flex items-center">
            <span className="bg-gradient-to-r from-muted-foreground/60 to-muted-foreground/40 bg-clip-text">
              {title}
            </span>
          </h3>
          <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent"></div>
        </div>
      )}
      
      {visibleItems.map((item) => (
        <SidebarMenuItem
          key={item.href}
          item={item}
          isCollapsed={isCollapsed}
          onLinkClick={onLinkClick}
        />
      ))}
    </div>
  )
}
