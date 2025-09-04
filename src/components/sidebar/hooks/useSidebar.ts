"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useSidebarState } from "./useSidebarState"
import { useActiveMenu } from "./useActiveMenu"
import { useMenuPermissions } from "./useMenuPermissions"
import { useSidebarAnalytics } from "./useSidebarAnalytics"
import type { SidebarProps, MenuType } from "../types/sidebar.types"

export const useSidebar = ({ isMobileOpen, onMobileClose }: Pick<SidebarProps, 'isMobileOpen' | 'onMobileClose'>) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  // Get user roles for permission checking
  const userRoles = session?.user?.roles?.map((ur: any) => ur.role?.name || ur.name) || []
  
  // Compose all hooks
  const sidebarState = useSidebarState()
  const activeMenu = useActiveMenu(pathname)
  const permissions = useMenuPermissions(userRoles)
  const analytics = useSidebarAnalytics()

  // Helper function to handle link clicks on mobile
  const handleMobileLinkClick = () => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose()
    }
  }

  // Professional menu toggle with analytics and prevention logic
  const toggleMenu = (menuType: MenuType, forceValue?: boolean): boolean => {
    const canCollapse = activeMenu.canCollapseMenu(menuType, forceValue)
    const currentValue = sidebarState.isMenuExpanded(menuType)
    const newValue = forceValue !== undefined ? forceValue : !currentValue
    
    // Professional Rule: Never collapse active menu unless explicitly forced
    if (!canCollapse && !newValue) {
      // Visual feedback to user
      const menuElement = document.querySelector(`[data-menu-type="${menuType}"]`)
      if (menuElement) {
        menuElement.classList.add('animate-pulse')
        setTimeout(() => menuElement.classList.remove('animate-pulse'), 800)
      }
      
      // Track blocked action
      analytics.trackCollapseBlocked(menuType, 'contains_active_page')
      
      return false
    }
    
    // Perform the toggle
    const success = sidebarState.toggleMenu(menuType, forceValue)
    
    // Track the action
    if (success) {
      if (newValue) {
        analytics.trackMenuExpand(menuType, activeMenu.activeMenuType === menuType)
      } else {
        analytics.trackMenuCollapse(menuType, false)
      }
    }
    
    return success
  }

  // Auto-expand active menu (professional behavior)
  useEffect(() => {
    if (activeMenu.activeMenuType && sidebarState.menuState.preferences?.autoExpandActive) {
      const currentValue = sidebarState.isMenuExpanded(activeMenu.activeMenuType)
      if (!currentValue) {
        sidebarState.expandMenu(activeMenu.activeMenuType)
        analytics.trackAutoExpand(activeMenu.activeMenuType, pathname)
      }
    }
  }, [activeMenu.activeMenuType, pathname, sidebarState, analytics])

  // Mobile header context information
  const menuContext = {
    primaryActive: activeMenu.activeMenuType,
    totalOpenMenus: sidebarState.getExpandedMenus().length,
    hasMultipleActive: false // Simplified for now
  }

  return {
    // State & Detection
    ...sidebarState,
    ...activeMenu,
    ...permissions,
    
    // Actions
    toggleMenu,
    handleMobileLinkClick,
    
    // Analytics
    ...analytics,
    
    // Context
    menuContext,
    pathname,
    userRoles,
    
    // Session
    session
  }
}
