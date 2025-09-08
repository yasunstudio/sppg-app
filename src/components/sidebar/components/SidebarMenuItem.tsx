"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()
  
  // Dynamic current state based on actual pathname
  const isCurrentItem = pathname === item.href || pathname.startsWith(item.href + '/')
  
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
          "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out ml-2",
          "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-md hover:scale-[1.01]",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 focus:bg-accent/50",
          "active:scale-[0.98] group relative overflow-hidden",
          "border-l-2 border-transparent hover:border-primary/30",
          isCurrentItem 
            ? "bg-primary/15 text-primary border-l-primary/60 shadow-md font-semibold ring-1 ring-primary/15" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {/* Enhanced submenu active indicator */}
        {isCurrentItem && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary/60 to-primary rounded-r-full shadow-sm shadow-primary/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-transparent rounded-xl" />
          </>
        )}
        
        <div className={cn(
          "flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0",
          "w-6 h-6",
          isCurrentItem 
            ? "bg-primary/20 text-primary shadow-sm ring-1 ring-primary/15" 
            : "bg-muted/40 text-muted-foreground group-hover:bg-accent/40 group-hover:text-accent-foreground"
        )}>
          <item.icon className="h-3.5 w-3.5" />
        </div>
        
        <span className="truncate flex-1">{item.name}</span>
        
        {/* Enhanced active indicator with subtle animation */}
        {isCurrentItem && (
          <div className="ml-auto flex items-center">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-sm" />
              <div className="absolute inset-0 w-1.5 h-1.5 bg-primary rounded-full animate-pulse opacity-40" />
            </div>
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
        "flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
        "hover:bg-accent/70 hover:text-accent-foreground hover:shadow-lg hover:scale-[1.02]",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:bg-accent/60",
        "active:scale-[0.98] group relative overflow-hidden",
        "backdrop-blur-sm",
        isCollapsed ? "px-2 justify-center mx-1" : "px-3 gap-2 mx-1",
        isCurrentItem 
          ? "bg-primary/20 text-primary border border-primary/30 shadow-lg font-semibold ring-1 ring-primary/20" 
          : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/30"
      )}
      title={isCollapsed ? item.name : undefined}
    >
      {/* Enhanced Active indicator with glow */}
      {isCurrentItem && (
        <>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-primary/80 via-primary to-primary/80 rounded-r-full shadow-lg shadow-primary/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent rounded-xl" />
        </>
      )}
      
      <div className={cn(
        "relative z-10 flex items-center",
        isCollapsed ? "justify-center" : "gap-3 w-full"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-lg transition-all duration-200",
          isCollapsed ? "w-6 h-6" : "w-7 h-7",
          item.current 
            ? "bg-primary/25 text-primary shadow-md ring-1 ring-primary/20" 
            : "bg-muted/50 text-muted-foreground group-hover:bg-accent/50 group-hover:text-accent-foreground group-hover:shadow-sm"
        )}>
          <item.icon className={cn(
            "flex-shrink-0 transition-all duration-200",
            isCollapsed ? "h-4 w-4" : "h-4 w-4",
            item.current ? "text-primary drop-shadow-sm" : "text-muted-foreground group-hover:text-foreground"
          )} />
        </div>
        
        <div className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden flex items-center justify-between flex-1",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          <span className="truncate font-medium">{item.name}</span>
          
          {/* Professional: Active indicator dot with pulse */}
          {item.current && (
            <div className="ml-auto flex items-center">
              <div className="relative">
                <div className="w-2 h-2 bg-primary rounded-full shadow-sm" />
                <div className="absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping opacity-30" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
