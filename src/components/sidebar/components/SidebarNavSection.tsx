"use client"

import { cn } from "@/lib/utils"
import { SidebarMenuItem } from "./SidebarMenuItem"
import type { MenuItem } from "../types/sidebar.types"
import { LucideIcon } from "lucide-react"

interface SidebarNavSectionProps {
  title: string
  items: MenuItem[]
  isCollapsed?: boolean
  onLinkClick?: () => void
  isMainSection?: boolean
  hasPermissionCheck?: (item: MenuItem) => boolean
  children?: React.ReactNode
  icon?: LucideIcon
  description?: string
}

export default function SidebarNavSection({ 
  title, 
  items,
  isCollapsed = false, 
  onLinkClick,
  isMainSection = false,
  hasPermissionCheck,
  children,
  icon: Icon,
  description 
}: SidebarNavSectionProps) {
  if (isCollapsed) {
    return (
      <div className="space-y-1">
        {children || items?.map((item) => {
          if (hasPermissionCheck && !hasPermissionCheck(item)) return null
          return (
            <SidebarMenuItem
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
              onLinkClick={onLinkClick}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/70" />}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider truncate">
            {title}
          </h3>
          {description && (
            <p className="text-[10px] text-muted-foreground/60 mt-0.5 line-clamp-1">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        {children || items?.map((item) => {
          if (hasPermissionCheck && !hasPermissionCheck(item)) return null
          return (
            <SidebarMenuItem
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
              onLinkClick={onLinkClick}
            />
          )
        })}
      </div>
    </div>
  )
}