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
    <div className={cn("space-y-2", !isMainSection && "mt-6")}>
      {!isMainSection && !isCollapsed && (
        <div className="px-3 mb-4">
          <h3 className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary/70 to-primary/40 shadow-sm" />
            <span className="bg-gradient-to-r from-foreground/80 to-foreground/60 bg-clip-text">
              {title}
            </span>
          </h3>
          <div className="h-px bg-gradient-to-r from-border/40 via-primary/15 to-transparent"></div>
        </div>
      )}
      
      <div className="space-y-1.5">
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
