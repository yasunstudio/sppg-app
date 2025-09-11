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
import { usePermissions } from "@/hooks/use-permission"
import { getPermissionsForPath } from "../utils/permissionHelpers"

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

  // Get all possible permissions from menu structure
  const allMenuPermissions = SIDEBAR_MENU_STRUCTURE.flatMap(section => 
    section.items.flatMap(item => {
      const permissions = getPermissionsForPath(item.href)
      if (item.submenu) {
        const submenuPermissions = item.submenu.flatMap(subItem => getPermissionsForPath(subItem.href))
        return [...permissions, ...submenuPermissions]
      }
      return permissions
    })
  ).filter((perm, index, arr) => arr.indexOf(perm) === index && perm.length > 0)

  // Use permission hook to check all permissions
  const { permissionResults, isLoading: permissionsLoading } = usePermissions(allMenuPermissions)

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
    handleMobileLinkClick
  } = sidebarData

  // Create permission check function for components
  const hasPermissionCheck = (item: any) => {
    if (permissionsLoading) return false // Hide items while loading
    if (!sessionUser) return false // Hide items if not logged in
    
    const requiredPermissions = getPermissionsForPath(item.href)
    
    // If no permissions required, show item (like profile, dashboard)
    if (requiredPermissions.length === 0) return true
    
    // Check if user has at least one of the required permissions
    return requiredPermissions.some(perm => permissionResults[perm] === true)
  }

  // Filter menu sections based on permissions
  const filterMenuItems = (items: any[]) => {
    return items.filter(item => {
      // Check main item permission
      if (!hasPermissionCheck(item)) return false
      
      // If item has submenu, filter submenu items too
      if (item.submenu && item.submenu.length > 0) {
        const filteredSubmenu = item.submenu.filter((subItem: any) => hasPermissionCheck(subItem))
        // Only show parent if it has at least one accessible submenu item
        if (filteredSubmenu.length === 0) return false
        // Update item with filtered submenu
        item.submenu = filteredSubmenu
      }
      
      return true
    })
  }

  // Filter sidebar menu structure based on permissions
  const filteredMenuStructure = SIDEBAR_MENU_STRUCTURE.map(section => ({
    ...section,
    items: filterMenuItems([...section.items]) // Create copy to avoid mutating original
  })).filter(section => section.items.length > 0) // Remove empty sections

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
          "bg-background/95 dark:bg-background/95 backdrop-blur-xl border-r border-border/40",
          "shadow-xl shadow-black/5 dark:shadow-black/30",
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
        <div className="flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-transparent via-muted/5 to-muted/10 dark:from-transparent dark:via-muted/10 dark:to-muted/20">
          <nav className="p-2 pt-3 space-y-4" role="navigation">
            {/* Show loading state while permissions are being checked */}
            {permissionsLoading && !isCollapsed && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading menu...
              </div>
            )}
            
            {!permissionsLoading && filteredMenuStructure.map((section: MenuSection, index: number) => {
              // Handle expandable sections
              if (section.isExpandable && section.menuType) {
                const menuType = section.menuType as MenuType
                
                return (
                  <div key={section.title} className="space-y-1">
                    <SidebarExpandable
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
                    {/* Add separator after primary sections */}
                    {(index === 5 || index === 7) && !isCollapsed && (
                      <div className="mx-3 my-4 border-t border-border/30" />
                    )}
                  </div>
                )
              }

              // Handle regular sections
              return (
                <div key={section.title} className="space-y-1">
                  <SidebarNavSection
                    title={section.title}
                    items={section.items}
                    isCollapsed={isCollapsed}
                    onLinkClick={handleMobileLinkClick}
                    isMainSection={!section.isExpandable}
                    hasPermissionCheck={hasPermissionCheck}
                  />
                  {/* Add separator after specific sections */}
                  {(section.title === "Keuangan" || section.title === "Layanan Profesional") && !isCollapsed && (
                    <div className="mx-3 my-4 border-t border-border/30" />
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-border/30 p-4 bg-card/50 dark:bg-card/60 backdrop-blur-sm">
            <div className="flex items-center justify-between min-w-0">
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-foreground/90">SPPG Online</p>
                <p className="text-[10px] text-muted-foreground/70">v1.0.0 Professional</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={cn(
                  "w-2 h-2 rounded-full shadow-sm",
                  hasActiveMenu ? "bg-green-500 animate-pulse shadow-green-500/20" : "bg-muted-foreground/40"
                )} />
                <span className="text-[10px] text-muted-foreground/70 font-medium">
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
        menuStructure={filteredMenuStructure}
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
