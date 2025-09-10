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
                "flex w-full items-center rounded-lg py-3 text-sm font-medium transition-all duration-200 ease-in-out",
                "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-md hover:scale-[1.01]",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
                "active:scale-[0.98] group relative overflow-hidden",
                "px-2 justify-center mx-1 border border-transparent hover:border-border/30",
                hasActiveSubmenu 
                  ? "bg-primary/15 text-primary shadow-sm border-primary/20" 
                  : "text-muted-foreground/90 hover:text-foreground"
              )}
              title={title}
            >
              {/* Enhanced animated background for active section */}
              {hasActiveSubmenu && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent rounded-lg" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary/70 via-primary to-primary/70 rounded-r-full shadow-sm" />
                </>
              )}
              
              <div className="relative z-10 flex items-center justify-center">
                <div className={cn(
                  "flex items-center justify-center rounded-md transition-all duration-200",
                  "w-5 h-5",
                  hasActiveSubmenu 
                    ? "bg-primary/20 text-primary shadow-sm" 
                    : "bg-muted/40 text-muted-foreground/80 group-hover:bg-accent/40 group-hover:text-accent-foreground"
                )}>
                  <IconComponent className="h-4 w-4 flex-shrink-0 transition-colors duration-200" />
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

  // When expanded, render normally
  return (
    <div className="mt-6">
      <div className="px-3 mb-4">
        <h3 className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary/70 to-primary/40 shadow-sm" />
          <span className="bg-gradient-to-r from-foreground/80 to-foreground/60 bg-clip-text">
            {title}
          </span>
        </h3>
        <div className="h-px bg-gradient-to-r from-border/60 via-primary/20 to-transparent shadow-sm"></div>
      </div>
      
      <button
        onClick={onToggle}
        data-menu-type={menuType}
        className={cn(
          "flex w-full items-center rounded-lg py-3 text-sm font-medium transition-all duration-200 ease-in-out",
          "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-md hover:scale-[1.01]",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
          "active:scale-[0.98] group relative overflow-hidden",
          "px-4 gap-3 mx-2 border border-transparent hover:border-border/30",
          hasActiveSubmenu
            ? "bg-primary/15 text-primary border-primary/20 shadow-sm font-semibold" 
            : "text-muted-foreground/90 hover:text-foreground"
        )}
        title={`${title} ${hasActiveSubmenu ? '(Active - Cannot collapse)' : ''}`}
      >
        {/* Enhanced animated background for active section */}
        {hasActiveSubmenu && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent rounded-lg" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary/70 via-primary to-primary/70 rounded-r-full shadow-sm" />
          </>
        )}
        
        <div className="relative z-10 flex items-center w-full gap-3">
          <div className={cn(
            "flex items-center justify-center rounded-md transition-all duration-200",
            "w-6 h-6 flex-shrink-0",
            hasActiveSubmenu 
              ? "bg-primary/20 text-primary shadow-sm" 
              : "bg-muted/40 text-muted-foreground/80 group-hover:bg-accent/40 group-hover:text-accent-foreground"
          )}>
            <IconComponent className="h-4 w-4" />
          </div>
          
          <div className="flex-1 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="truncate font-medium text-left">{title}</span>
              {/* Enhanced active status indicator */}
              {hasActiveSubmenu && (
                <span className="text-xs text-primary/80 font-medium bg-primary/10 px-2 py-0.5 rounded-md inline-block mt-0.5">
                  Active section • Cannot collapse
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Enhanced active content indicator */}
              {hasActiveSubmenu && !isExpanded && (
                <div className="relative">
                  <div className="w-2 h-2 bg-primary rounded-full shadow-sm" />
                  <div className="absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping opacity-40" />
                </div>
              )}
              
              {/* Enhanced submenu count */}
              {isExpanded && visibleItems.length > 0 && (
                <span className="text-xs text-primary/80 bg-primary/15 px-2 py-0.5 rounded-full font-medium shadow-sm">
                  {visibleItems.length}
                </span>
              )}
              
              <div className={cn(
                "transition-all duration-300 p-1 rounded-lg",
                isExpanded ? "rotate-90 bg-primary/15" : "rotate-0 hover:bg-accent/30",
                hasActiveSubmenu && "text-primary"
              )}>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-1 pl-8 border-l-2 border-border/40 ml-6 relative">
          {/* Enhanced animated connector line */}
          <div className="absolute -left-[2px] top-0 w-0.5 h-full bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full" />
          
          {/* Enhanced section indicator */}
          {hasActiveSubmenu && (
            <div className="absolute -left-[9px] top-0 w-4 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full shadow-sm" />
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
