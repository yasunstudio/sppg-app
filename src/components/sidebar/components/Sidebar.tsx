"use client"

import { cn } from "@/lib/utils"
import { useSidebar } from "../hooks/useSidebar"
import { SIDEBAR_MENU_STRUCTURE } from "../data/menuStructure"
import { 
  SidebarHeader, 
  SidebarNavSection, 
  SidebarExpandable, 
  SidebarMobile 
} from "."
import type { SidebarProps, MenuType, MenuSection } from "../types/sidebar.types"
import { useSession } from "next-auth/react"

interface ModularSidebarProps extends SidebarProps {
  user?: any // Will be properly typed when integrated
}

export default function Sidebar({ 
  isCollapsed: externalCollapsed,
  onToggle: externalOnToggle,
  isMobileOpen: externalMobileOpen,
  onMobileClose: externalOnMobileClose,
  className,
  user
}: ModularSidebarProps) {
  const { data: session } = useSession()
  const sessionUser = user || session?.user

  const sidebarData = useSidebar({
    isMobileOpen: externalMobileOpen,
    onMobileClose: externalOnMobileClose
  })

  // Destructure needed properties
  const {
    // State
    menuState,
    isMenuExpanded,
    hasActiveSubmenu,
    
    // Active detection
    activeMenuType,
    hasActiveMenu,
    
    // Actions
    toggleMenu,
    handleMobileLinkClick,
    
    // Permissions
    filterMenuItems
  } = sidebarData

  // Create permission check function for components
  const hasPermissionCheck = (item: any) => {
    return filterMenuItems([item]).length > 0
  }

  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed ?? false
  const handleToggle = externalOnToggle ?? (() => {})
  const isMobileOpen = externalMobileOpen ?? false
  const handleMobileClose = externalOnMobileClose ?? (() => {})

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-screen transition-all duration-300 ease-in-out",
          "hidden lg:flex lg:flex-col",
          // Enhanced background with proper dark/light mode support
          "bg-card/95 backdrop-blur-xl border-r border-border/50",
          "shadow-lg shadow-black/5 dark:shadow-black/20",
          // Increase width for better menu visibility
          isCollapsed ? "w-16" : "w-72",
          className
        )}
        aria-label="Main navigation"
      >
        {/* Header */}
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggle={handleToggle}
          user={sessionUser}
          appName="SPPG Online"
        />

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-transparent to-muted/10">
          <nav className="p-4 pt-6 space-y-4" role="navigation">
            {SIDEBAR_MENU_STRUCTURE.map((section: MenuSection) => {
              // Handle expandable sections
              if (section.isExpandable && section.menuType) {
                const menuType = section.menuType as MenuType
                
                return (
                  <SidebarExpandable
                    key={section.title}
                    title={section.title}
                    icon={section.items[0]?.icon} // Use first item's icon as section icon
                    items={section.items}
                    isExpanded={isMenuExpanded(menuType)}
                    isCollapsed={isCollapsed}
                    hasActiveSubmenu={hasActiveSubmenu(menuType)}
                    onToggle={() => toggleMenu(menuType, undefined)}
                    onLinkClick={handleMobileLinkClick}
                    menuType={menuType}
                    hasPermissionCheck={hasPermissionCheck}
                  />
                )
              }

              // Handle regular sections
              return (
                <SidebarNavSection
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  isCollapsed={isCollapsed}
                  onLinkClick={handleMobileLinkClick}
                  isMainSection={!section.isExpandable}
                  hasPermissionCheck={hasPermissionCheck}
                />
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-border/40 p-4 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
            <div className="flex items-center justify-between min-w-0">
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-foreground/90">SPPG Online</p>
                <p className="text-[10px] text-muted-foreground/80">v1.0.0 Professional</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={cn(
                  "w-2 h-2 rounded-full shadow-sm",
                  hasActiveMenu ? "bg-green-500 animate-pulse shadow-green-500/20" : "bg-muted-foreground/40"
                )} />
                <span className="text-[10px] text-muted-foreground/80 font-medium">
                  {hasActiveMenu ? 'Online' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <SidebarMobile
        isOpen={isMobileOpen}
        onClose={handleMobileClose}
        menuStructure={SIDEBAR_MENU_STRUCTURE}
        hasPermissionCheck={hasPermissionCheck}
        user={sessionUser}
        onLinkClick={handleMobileLinkClick}
        appName="SPPG Online"
      />

      {/* Mobile Menu Button */}
      <button
        onClick={handleToggle}
        className={cn(
          "fixed top-4 left-4 z-40 lg:hidden",
          "flex items-center justify-center w-10 h-10 rounded-lg",
          "bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg",
          "hover:bg-accent/60 hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          "transition-all duration-200"
        )}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileOpen}
      >
        <div className="flex flex-col gap-1">
          <div className={cn(
            "w-4 h-0.5 bg-current transition-all duration-200",
            isMobileOpen ? "rotate-45 translate-y-1.5" : ""
          )} />
          <div className={cn(
            "w-4 h-0.5 bg-current transition-all duration-200",
            isMobileOpen ? "opacity-0" : ""
          )} />
          <div className={cn(
            "w-4 h-0.5 bg-current transition-all duration-200",
            isMobileOpen ? "-rotate-45 -translate-y-1.5" : ""
          )} />
        </div>
      </button>
    </>
  )
}
