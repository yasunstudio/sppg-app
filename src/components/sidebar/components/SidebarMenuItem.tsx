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
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
          "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
          "group relative overflow-hidden",
          "border-l-2 border-transparent hover:border-primary/40",
          "backdrop-blur-sm bg-muted/20 hover:bg-muted/40",
          isCurrentItem 
            ? "bg-primary/15 text-primary border-l-primary shadow-md font-semibold ring-2 ring-primary/20" 
            : "text-muted-foreground/85 hover:text-foreground"
        )}
      >
        {/* Enhanced submenu active indicator */}
        {isCurrentItem && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary via-primary to-primary/80 rounded-r-full shadow-lg" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent rounded-lg" />
          </>
        )}
        
        <div className={cn(
          "flex items-center justify-center rounded transition-all duration-200 flex-shrink-0",
          "w-4 h-4",
          isCurrentItem 
            ? "bg-primary/20 text-primary shadow-sm border border-primary/30" 
            : "bg-muted/30 text-muted-foreground/70 group-hover:bg-accent/30 group-hover:text-accent-foreground"
        )}>
          <item.icon className="h-3 w-3" />
        </div>
        
        <span className="truncate flex-1 text-left">{item.name}</span>
        
        {/* Badge for submenu items */}
        {item.badge && (
          <Badge variant="secondary" className="text-xs h-4 px-1.5 py-0">
            {item.badge}
          </Badge>
        )}
        
        {/* Refined active indicator */}
        {isCurrentItem && (
          <div className="ml-auto flex items-center">
            <div className="w-1 h-1 bg-primary rounded-full" />
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
            "w-full flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
            "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
            "group relative overflow-hidden",
            "backdrop-blur-sm px-3 gap-2.5 mx-0",
            "border border-transparent hover:border-border/30",
            isCurrentItem || isParentOfActive
              ? "bg-primary/15 text-primary border-primary/30 shadow-md font-semibold ring-2 ring-primary/15" 
              : "text-muted-foreground/85 hover:text-foreground"
          )}
        >
          {/* Enhanced Active indicator */}
          {(isCurrentItem || isParentOfActive) && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary via-primary to-primary/80 shadow-lg shadow-primary/30 rounded-r-sm" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-transparent rounded-md" />
            </>
          )}
          
          <div className="relative z-10 flex items-center gap-2.5 w-full">
            <div className={cn(
              "flex items-center justify-center rounded transition-all duration-200 w-5 h-5 border",
              isCurrentItem || isParentOfActive
                ? "bg-primary/20 text-primary border-primary/40 shadow-sm" 
                : "bg-muted/30 text-muted-foreground/70 group-hover:bg-accent/30 group-hover:text-accent-foreground border-transparent"
            )}>
              <item.icon className="h-3.5 w-3.5 flex-shrink-0 transition-all duration-200" />
            </div>
            
                          <span className="truncate font-medium flex-1 text-left">{item.name}</span>
            
            <div className="ml-auto flex items-center gap-2">
              {item.badge && (
                <Badge variant="secondary" className="text-xs h-4 px-1.5 py-0">
                  {item.badge}
                </Badge>
              )}
              {item.description && (
                <span className="text-xs text-muted-foreground hidden lg:block max-w-24 truncate">
                  {item.description}
                </span>
              )}
              <ChevronDown className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
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
            "flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
            "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
            "group relative overflow-hidden",
            "backdrop-blur-sm border border-transparent hover:border-border/30",
            isCollapsed ? "px-2 justify-center mx-0" : "px-3 gap-2.5 mx-0",
            isCurrentItem 
              ? "bg-primary/15 text-primary border-primary/30 shadow-md font-semibold ring-2 ring-primary/15" 
              : "text-muted-foreground/85 hover:text-foreground"
          )}
          title={isCollapsed ? item.name : undefined}
        >
          {/* Enhanced Active indicator */}
          {isCurrentItem && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary via-primary to-primary/80 shadow-lg shadow-primary/30 rounded-r-sm" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-transparent rounded-md" />
            </>
          )}
          
          <div className={cn(
            "relative z-10 flex items-center",
            isCollapsed ? "justify-center" : "gap-2.5 w-full"
          )}>
            <div className={cn(
              "flex items-center justify-center rounded transition-all duration-200 border",
              isCollapsed ? "w-4 h-4" : "w-5 h-5",
              isCurrentItem 
                ? "bg-primary/20 text-primary border-primary/40 shadow-sm" 
                : "bg-muted/30 text-muted-foreground/70 group-hover:bg-accent/30 group-hover:text-accent-foreground border-transparent"
            )}>
              <item.icon className={cn(
                "flex-shrink-0 transition-all duration-200",
                isCollapsed ? "h-3 w-3" : "h-3.5 w-3.5",
                isCurrentItem ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
            </div>
            
            <div className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden flex items-center flex-1",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              <span className="truncate font-medium flex-1">{item.name}</span>
              
              <div className="flex items-center gap-1">
                {item.badge && (
                  <Badge variant="secondary" className="text-xs h-4 px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
                
                {/* Professional: Active indicator dot */}
                {isCurrentItem && (
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
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
          "ml-8 mt-0.5 relative",
          isSubmenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          {/* Connector line */}
          <div className="absolute left-0 top-0 w-0.5 h-full bg-border/30 rounded-full" />
          <div className="py-1 space-y-0.5 pl-4">
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
