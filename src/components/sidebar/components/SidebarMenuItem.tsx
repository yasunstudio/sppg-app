"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import type { MenuItem } from "../types/sidebar.types"

interface SidebarMenuItemProps {
  item: MenuItem
  isCollapsed?: boolean
  onLinkClick?: () => void
  isSubmenuItem?: boolean
}

export function SidebarMenuItem({ 
  item, 
  isCollapsed = false, 
  onLinkClick,
  isSubmenuItem = false 
}: SidebarMenuItemProps) {
  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick()
    }
  }

  if (isSubmenuItem) {
    return (
      <Link
        href={item.href}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
          "hover:bg-accent/50 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.01]",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
          "active:scale-[0.98] group relative",
          "dark:hover:bg-accent/40 dark:hover:text-accent-foreground dark:focus:bg-accent/30",
          item.current 
            ? "bg-primary/15 text-primary border border-primary/20 font-semibold shadow-sm dark:bg-primary/20 dark:border-primary/30" 
            : "text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
        )}
      >
        {/* Professional: Active submenu indicator */}
        {item.current && (
          <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-0.5 bg-primary rounded-full" />
        )}
        
        <div className={cn(
          "flex items-center justify-center rounded-md transition-all duration-200",
          "w-6 h-6 flex-shrink-0",
          item.current 
            ? "bg-primary/20 text-primary dark:bg-primary/25" 
            : "bg-muted/40 text-muted-foreground group-hover:bg-accent/40 group-hover:text-accent-foreground dark:bg-muted/30 dark:group-hover:bg-accent/30"
        )}>
          <item.icon className="h-3.5 w-3.5" />
        </div>
        
        <span className="truncate">{item.name}</span>
        
        {/* Professional: Active indicator dot */}
        {item.current && (
          <div className="ml-auto">
            <div className="w-2 h-2 bg-primary rounded-full shadow-sm animate-pulse" />
          </div>
        )}
      </Link>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={cn(
        "flex items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ease-in-out",
        "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
        "active:scale-[0.98] group relative overflow-hidden",
        isCollapsed ? "px-2 justify-center mx-1" : "px-4 gap-3 mx-2",
        item.current 
          ? "bg-primary/15 text-primary border border-primary/25 shadow-md font-semibold" 
          : "text-muted-foreground hover:text-foreground"
      )}
      title={isCollapsed ? item.name : undefined}
    >
      {/* Active indicator */}
      {item.current && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
      )}
      
      <div className={cn(
        "relative z-10 flex items-center",
        isCollapsed ? "justify-center" : "gap-3 w-full"
      )}>
        <item.icon className={cn(
          "flex-shrink-0 transition-colors duration-200",
          isCollapsed ? "h-5 w-5" : "h-4 w-4",
          item.current ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )} />
        
        <div className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          <span className="truncate font-medium">{item.name}</span>
        </div>
      </div>
    </Link>
  )
}
