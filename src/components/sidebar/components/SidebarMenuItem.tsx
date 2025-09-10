"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  
  // Dynamic current state based on actual pathname
  const isCurrentItem = pathname === item.href || pathname.startsWith(item.href + '/')
  const hasSubmenu = item.submenu && item.submenu.length > 0
  const isParentOfActive = hasSubmenu && item.submenu?.some(subItem => 
    pathname === subItem.href || pathname.startsWith(subItem.href + '/')
  )

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubmenu && !isCollapsed) {
      e.preventDefault()
      setIsSubmenuOpen(!isSubmenuOpen)
    } else if (onLinkClick) {
      onLinkClick()
    }
  }

  // Auto-open submenu if one of its items is active
  useState(() => {
    if (isParentOfActive) {
      setIsSubmenuOpen(true)
    }
  })

  if (isSubmenuItem) {
    return (
      <Link
        href={item.href}
        onClick={onLinkClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out ml-6",
          "hover:bg-accent/70 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.01]",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
          "active:scale-[0.98] group relative overflow-hidden",
          "border-l-2 border-transparent hover:border-primary/40",
          "backdrop-blur-sm",
          isCurrentItem 
            ? "bg-primary/12 text-primary border-l-primary/70 shadow-sm font-semibold ring-1 ring-primary/10" 
            : "text-muted-foreground/90 hover:text-foreground hover:bg-accent/50"
        )}
      >
        {/* Enhanced submenu active indicator */}
        {isCurrentItem && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-primary/70 to-primary rounded-r-full shadow-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent rounded-lg" />
          </>
        )}
        
        <div className={cn(
          "flex items-center justify-center rounded-md transition-all duration-200 flex-shrink-0",
          "w-5 h-5",
          isCurrentItem 
            ? "bg-primary/15 text-primary shadow-sm" 
            : "bg-muted/30 text-muted-foreground/80 group-hover:bg-accent/30 group-hover:text-accent-foreground"
        )}>
          <item.icon className="h-3.5 w-3.5" />
        </div>
        
        <span className="truncate flex-1">{item.name}</span>
        
        {/* Badge for submenu items */}
        {item.badge && (
          <Badge variant="secondary" className="text-xs h-5 px-1.5">
            {item.badge}
          </Badge>
        )}
        
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
    <div className="relative">
      {hasSubmenu && !isCollapsed ? (
        <button
          onClick={handleClick}
          className={cn(
            "w-full flex items-center rounded-lg py-3 text-sm font-medium transition-all duration-200 ease-in-out",
            "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-md hover:scale-[1.01]",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
            "active:scale-[0.98] group relative overflow-hidden",
            "backdrop-blur-sm px-3 gap-3 mx-1",
            "border border-transparent hover:border-border/30",
            isCurrentItem || isParentOfActive
              ? "bg-primary/15 text-primary border-primary/20 shadow-sm font-semibold" 
              : "text-muted-foreground/90 hover:text-foreground"
          )}
        >
          {/* Enhanced Active indicator with glow */}
          {(isCurrentItem || isParentOfActive) && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary/70 via-primary to-primary/70 rounded-r-full shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-transparent rounded-lg" />
            </>
          )}
          
          <div className="relative z-10 flex items-center gap-3 w-full">
            <div className={cn(
              "flex items-center justify-center rounded-md transition-all duration-200 w-6 h-6",
              isCurrentItem || isParentOfActive
                ? "bg-primary/20 text-primary shadow-sm" 
                : "bg-muted/40 text-muted-foreground/80 group-hover:bg-accent/40 group-hover:text-accent-foreground"
            )}>
              <item.icon className="h-4 w-4 flex-shrink-0 transition-all duration-200" />
            </div>
            
            <span className="truncate font-medium flex-1">{item.name}</span>
            
            <div className="ml-auto flex items-center gap-2">
              {item.badge && (
                <Badge variant="secondary" className="text-xs h-5 px-1.5">
                  {item.badge}
                </Badge>
              )}
              {item.description && (
                <span className="text-xs text-muted-foreground hidden lg:block max-w-32 truncate">
                  {item.description}
                </span>
              )}
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                isSubmenuOpen ? "rotate-180" : "rotate-0"
              )} />
            </div>
          </div>
        </button>
      ) : (
        <Link
          href={item.href}
          onClick={handleClick}
          className={cn(
            "flex items-center rounded-lg py-3 text-sm font-medium transition-all duration-200 ease-in-out",
            "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-md hover:scale-[1.01]",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
            "active:scale-[0.98] group relative overflow-hidden",
            "backdrop-blur-sm border border-transparent hover:border-border/30",
            isCollapsed ? "px-2 justify-center mx-1" : "px-3 gap-3 mx-1",
            isCurrentItem 
              ? "bg-primary/15 text-primary border-primary/20 shadow-sm font-semibold" 
              : "text-muted-foreground/90 hover:text-foreground"
          )}
          title={isCollapsed ? item.name : undefined}
        >
          {/* Enhanced Active indicator with glow */}
          {isCurrentItem && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary/70 via-primary to-primary/70 rounded-r-full shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-transparent rounded-lg" />
            </>
          )}
          
          <div className={cn(
            "relative z-10 flex items-center",
            isCollapsed ? "justify-center" : "gap-3 w-full"
          )}>
            <div className={cn(
              "flex items-center justify-center rounded-md transition-all duration-200",
              isCollapsed ? "w-5 h-5" : "w-6 h-6",
              isCurrentItem 
                ? "bg-primary/20 text-primary shadow-sm" 
                : "bg-muted/40 text-muted-foreground/80 group-hover:bg-accent/40 group-hover:text-accent-foreground"
            )}>
              <item.icon className={cn(
                "flex-shrink-0 transition-all duration-200",
                isCollapsed ? "h-4 w-4" : "h-4 w-4",
                isCurrentItem ? "text-primary drop-shadow-sm" : "text-muted-foreground group-hover:text-foreground"
              )} />
            </div>
            
            <div className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden flex items-center justify-between flex-1",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              <span className="truncate font-medium">{item.name}</span>
              
              <div className="ml-auto flex items-center gap-1">
                {item.badge && (
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                    {item.badge}
                  </Badge>
                )}
                
                {/* Professional: Active indicator dot with pulse */}
                {isCurrentItem && (
                  <div className="relative">
                    <div className="w-2 h-2 bg-primary rounded-full shadow-sm" />
                    <div className="absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping opacity-30" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Submenu */}
      {hasSubmenu && !isCollapsed && (
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          "border-l border-border/30 ml-4 mt-1",
          isSubmenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="py-1 space-y-0.5 bg-gradient-to-r from-muted/5 to-transparent rounded-r-lg">
            {item.submenu?.map((subItem) => (
              <SidebarMenuItem
                key={subItem.href}
                item={subItem}
                isCollapsed={false}
                onLinkClick={onLinkClick}
                isSubmenuItem={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
