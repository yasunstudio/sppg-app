"use client"

import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { SidebarMenuItem } from "./SidebarMenuItem"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { MenuItem, MenuType } from "../types/sidebar.types"

interface SidebarExpandableProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  items: MenuItem[]
  isExpanded: boolean
  isCollapsed?: boolean
  hasActiveSubmenu: boolean
  onToggle: () => void
  onLinkClick?: () => void
  menuType: MenuType
  hasPermissionCheck?: (item: MenuItem) => boolean
}

export function SidebarExpandable({
  title,
  icon: IconComponent,
  items,
  isExpanded,
  isCollapsed = false,
  hasActiveSubmenu,
  onToggle,
  onLinkClick,
  menuType,
  hasPermissionCheck
}: SidebarExpandableProps) {
  // Filter items based on permissions
  const visibleItems = hasPermissionCheck 
    ? items.filter(hasPermissionCheck) 
    : items

  // Don't render if no visible items
  if (visibleItems.length === 0) {
    return null
  }

  // When collapsed, render as dropdown
  if (isCollapsed) {
    return (
      <div className="mt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
                "group relative overflow-hidden",
                "px-2 justify-center mx-0 border border-transparent hover:border-border/30",
                hasActiveSubmenu 
                  ? "bg-primary/10 text-primary shadow-sm border-primary/20" 
                  : "text-muted-foreground/85 hover:text-foreground"
              )}
              title={title}
            >
              {/* Enhanced animated background for active section */}
              {hasActiveSubmenu && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/6 via-transparent to-transparent rounded-lg" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-primary/60 via-primary to-primary/60 rounded-r-full" />
                </>
              )}
              
              <div className="relative z-10 flex items-center justify-center">
                <div className={cn(
                  "flex items-center justify-center rounded transition-all duration-200",
                  "w-5 h-5",
                  hasActiveSubmenu 
                    ? "bg-primary/15 text-primary" 
                    : "bg-muted/30 text-muted-foreground/70 group-hover:bg-accent/30 group-hover:text-accent-foreground"
                )}>
                  <IconComponent className="h-3.5 w-3.5 flex-shrink-0 transition-colors duration-200" />
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-72 ml-2 bg-popover/95 backdrop-blur-lg border-border/50 shadow-2xl">
            <DropdownMenuLabel className="font-semibold text-sm py-3 px-4 bg-gradient-to-r from-card/50 to-card/30 border-b border-border/30">
              {title}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2">
              {visibleItems.map((item) => (
                <DropdownMenuItem key={item.name} asChild className="p-0 focus:bg-transparent">
                  <SidebarMenuItem
                    item={item}
                    onLinkClick={onLinkClick}
                  />
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // When expanded, render as full section
  return (
    <div className="space-y-1">
      {/* Section Header Button */}
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full items-center rounded-lg px-3 py-3 text-sm font-semibold transition-all duration-200 ease-in-out",
          "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
          "group relative overflow-hidden",
          "border border-transparent hover:border-border/30",
          "bg-card/50 shadow-sm",
          hasActiveSubmenu 
            ? "bg-primary/8 text-primary shadow-md border-primary/20" 
            : "text-muted-foreground/85 hover:text-foreground"
        )}
      >
        {/* Enhanced animated background for active section */}
        {hasActiveSubmenu && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/4 via-transparent to-transparent rounded-lg" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-primary/60 via-primary to-primary/60 rounded-r-full" />
          </>
        )}
        
        <div className="relative z-10 flex w-full items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "flex items-center justify-center rounded transition-all duration-200",
              "w-5 h-5 flex-shrink-0",
              hasActiveSubmenu 
                ? "bg-primary/12 text-primary" 
                : "bg-muted/25 text-muted-foreground/70 group-hover:bg-accent/25 group-hover:text-accent-foreground"
            )}>
              <IconComponent className="h-3.5 w-3.5 transition-colors duration-200" />
            </div>
            <span className="font-semibold text-xs uppercase tracking-wider truncate text-left">
              {title}
            </span>
          </div>
          
          <ChevronRight 
            className={cn(
              "h-3.5 w-3.5 transition-all duration-200 ease-in-out flex-shrink-0",
              isExpanded ? "rotate-90" : "",
              hasActiveSubmenu ? "text-primary/80" : "text-muted-foreground/60"
            )} 
          />
        </div>
      </button>

      {/* Collapsible Menu Items */}
      {isExpanded && (
        <div className="space-y-0.5 pb-1 ml-6 border-l border-border/20 pl-3">
          {visibleItems.map((item) => (
            <div key={item.href} className="relative">
              <SidebarMenuItem
                item={item}
                isCollapsed={false}
                onLinkClick={onLinkClick}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
