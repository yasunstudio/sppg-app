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
                "flex w-full items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
                "active:scale-[0.98] group relative overflow-hidden",
                "px-2 justify-center mx-1",
                hasActiveSubmenu 
                  ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md border border-accent/20" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={title}
            >
              {/* Animated background for active section */}
              {hasActiveSubmenu && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl" />
              )}
              
              <div className="relative z-10 flex items-center justify-center">
                <IconComponent className="h-5 w-5 flex-shrink-0 transition-colors duration-200" />
              </div>
              
              {/* Active indicator */}
              {hasActiveSubmenu && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-64 ml-2">
            <DropdownMenuLabel className="font-semibold text-sm">
              {title}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {visibleItems.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <SidebarMenuItem
                  item={item}
                  onLinkClick={onLinkClick}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // When expanded, render normally
  return (
    <div className="mt-8">
      <div className="px-3 mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 flex items-center">
          <span className="bg-gradient-to-r from-muted-foreground/60 to-muted-foreground/40 bg-clip-text">
            {title}
          </span>
        </h3>
        <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent"></div>
      </div>
      
      <button
        onClick={onToggle}
        data-menu-type={menuType}
        className={cn(
          "flex w-full items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ease-in-out",
          "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
          "active:scale-[0.98] group relative overflow-hidden",
          "px-4 gap-3 mx-2",
          hasActiveSubmenu
            ? "bg-primary/15 text-primary border border-primary/25 shadow-md font-semibold" 
            : "text-muted-foreground hover:text-foreground"
        )}
        title={`${title} ${hasActiveSubmenu ? '(Active - Cannot collapse)' : ''}`}
      >
        {/* Animated background for active section */}
        {hasActiveSubmenu && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl" />
        )}
        
        <div className="relative z-10 flex items-center w-full gap-3">
          <div className={cn(
            "flex items-center justify-center rounded-lg transition-all duration-200",
            "w-8 h-8 flex-shrink-0",
            hasActiveSubmenu 
              ? "bg-primary/20 text-primary shadow-sm" 
              : "bg-muted/40 text-muted-foreground group-hover:bg-accent/40 group-hover:text-accent-foreground"
          )}>
            <IconComponent className="h-4 w-4" />
          </div>
          
          <div className="flex-1 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="truncate font-medium text-left">{title}</span>
              {/* Professional: Active status indicator */}
              {hasActiveSubmenu && (
                <span className="text-xs text-primary/70 font-normal">
                  Active section • Cannot collapse
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Professional: Active content indicator */}
              {hasActiveSubmenu && !isExpanded && (
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
              
              {/* Professional: Submenu count when expanded */}
              {isExpanded && visibleItems.length > 0 && (
                <span className="text-xs text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded-full">
                  {visibleItems.length}
                </span>
              )}
              
              <div className={cn(
                "transition-transform duration-200",
                isExpanded ? "rotate-90" : "rotate-0"
              )}>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Professional: Enhanced active indicator */}
        {hasActiveSubmenu && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary via-primary/80 to-primary rounded-r-full shadow-sm" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-1 pl-8 border-l-2 border-border/30 ml-6 relative">
          {/* Professional: Animated connector line */}
          <div className="absolute -left-[2px] top-0 w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent rounded-full" />
          
          {/* Professional: Section indicator */}
          {hasActiveSubmenu && (
            <div className="absolute -left-[9px] top-0 w-4 h-0.5 bg-primary rounded-full" />
          )}
          
          {visibleItems.map((item) => (
            <SidebarMenuItem
              key={item.name}
              item={item}
              onLinkClick={onLinkClick}
              isSubmenuItem={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
