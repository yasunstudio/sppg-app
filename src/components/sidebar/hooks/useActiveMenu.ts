"use client"

import { useMemo } from "react"
import type { MenuType } from "../types/sidebar.types"

export const useActiveMenu = (pathname: string) => {
  // Centralized active menu detection
  const getActiveMenuType = (path: string): MenuType | null => {
    // Core Operations
    if (path.startsWith("/dashboard/production") || 
        path.startsWith("/dashboard/production-plans")) {
      return 'production'
    }
    if (path.startsWith("/dashboard/menu-planning")) {
      return 'menuPlanning'
    }
    if (path.startsWith("/dashboard/distributions") || 
        path.startsWith("/dashboard/distribution")) {
      return 'distribution'
    }
    if (path.startsWith("/dashboard/quality")) {
      return 'quality'
    }
    
    // Management & Administration
    if (path.startsWith("/dashboard/schools") || 
        path.startsWith("/dashboard/students") ||
        path.startsWith("/dashboard/classes")) {
      return 'institution'
    }
    if (path.startsWith("/dashboard/raw-materials") ||
        path.startsWith("/dashboard/suppliers") ||
        path.startsWith("/dashboard/items")) {
      return 'supplyChain'
    }
    if (path.startsWith("/dashboard/quality-standards") ||
        path.startsWith("/dashboard/quality-checkpoints") ||
        path.startsWith("/dashboard/recipes")) {
      return 'standards'
    }
    if (path.startsWith("/dashboard/purchase-orders") || 
        path.startsWith("/dashboard/inventory") ||
        path.startsWith("/dashboard/resource-usage")) {
      return 'procurement'
    }
    if (path.startsWith("/dashboard/vehicles") ||
        path.startsWith("/dashboard/drivers")) {
      return 'logistics'
    }
    if (path.startsWith("/dashboard/monitoring") ||
        path.startsWith("/dashboard/analytics") ||
        path.startsWith("/dashboard/performance")) {
      return 'monitoring'
    }
    if (path.startsWith("/dashboard/users") || 
        path.startsWith("/dashboard/roles") ||
        path.startsWith("/dashboard/user-roles") ||
        path.startsWith("/dashboard/audit-logs") ||
        path.startsWith("/dashboard/notifications") ||
        path.startsWith("/dashboard/system-config") ||
        path.startsWith("/dashboard/admin") ||
        path.startsWith("/dashboard/profile")) {
      return 'system'
    }
    
    return null
  }

  // Memoize active menu detection for performance
  const activeMenuType = useMemo(() => {
    return getActiveMenuType(pathname)
  }, [pathname])

  // Check if there's any active menu
  const hasActiveMenu = activeMenuType !== null

  // Check if specific menu type has active submenu
  const hasActiveSubmenu = (menuType: MenuType): boolean => {
    return activeMenuType === menuType
  }

  // Check if path matches a specific pattern
  const matchesPath = (pathPattern: string): boolean => {
    return pathname.startsWith(pathPattern)
  }

  // Get breadcrumb info for current path
  const getBreadcrumbInfo = () => {
    if (!activeMenuType) return null
    
    const menuNames: Record<MenuType, string> = {
      production: 'Produksi',
      menuPlanning: 'Perencanaan Menu',
      distribution: 'Distribusi',
      quality: 'Quality Assurance',
      institution: 'Manajemen Institusi',
      supplyChain: 'Manajemen Pasokan',
      standards: 'Standar & Resep',
      procurement: 'Pengadaan & Inventory',
      logistics: 'Logistik & Transportasi',
      monitoring: 'Monitoring & Analytics',
      system: 'Sistem & Admin'
    }

    return {
      menuType: activeMenuType,
      menuLabel: menuNames[activeMenuType],
      currentPath: pathname
    }
  }

  // Professional active menu prevention logic
  const canCollapseMenu = (menuType: MenuType, forceValue?: boolean): boolean => {
    // Professional Rule: Never collapse active menu unless explicitly forced
    if (activeMenuType === menuType && forceValue === undefined) {
      return false
    }
    return true
  }

  return {
    // Core detection
    activeMenuType,
    hasActiveMenu,
    
    // Helpers
    hasActiveSubmenu,
    matchesPath,
    canCollapseMenu,
    getBreadcrumbInfo,
    
    // Utils
    getActiveMenuType
  }
}
