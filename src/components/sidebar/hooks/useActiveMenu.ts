"use client"

import { useMemo } from "react"
import type { MenuType } from "../types/sidebar.types"

export const useActiveMenu = (pathname: string) => {
  // Centralized active menu detection
  const getActiveMenuType = (path: string): MenuType | null => {
    if (path.startsWith("/dashboard/production") || 
        path.startsWith("/dashboard/production-plans") || 
        path.startsWith("/dashboard/resource-usage")) {
      return 'production'
    }
    if (path.startsWith("/dashboard/menu-planning") || 
        path.startsWith("/dashboard/recipes")) {
      return 'menuPlanning'
    }
    if (path.startsWith("/dashboard/distributions") || 
        path.startsWith("/dashboard/distribution")) {
      return 'distribution'
    }
    if (path.startsWith("/dashboard/monitoring")) {
      return 'monitoring'
    }
    if (path.startsWith("/dashboard/quality") || 
        path.startsWith("/dashboard/quality-checks") ||
        path.startsWith("/dashboard/food-samples") || 
        path.startsWith("/dashboard/nutrition-consultations")) {
      return 'quality'
    }
    if (path.startsWith("/dashboard/purchase-orders") || 
        path.startsWith("/dashboard/inventory")) {
      return 'operational'
    }
    if (path.startsWith("/dashboard/schools") || 
        path.startsWith("/dashboard/students") ||
        path.startsWith("/dashboard/classes") ||
        path.startsWith("/dashboard/raw-materials") ||
        path.startsWith("/dashboard/items") ||
        path.startsWith("/dashboard/suppliers") ||
        path.startsWith("/dashboard/vehicles") ||
        path.startsWith("/dashboard/drivers") ||
        path.startsWith("/dashboard/quality-standards") ||
        path.startsWith("/dashboard/quality-checkpoints")) {
      return 'dataMaster'
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
    
    const menuLabels: Record<MenuType, string> = {
      production: 'Produksi',
      menuPlanning: 'Perencanaan Menu',
      distribution: 'Distribusi',
      monitoring: 'Monitoring & Laporan',
      quality: 'Manajemen Kualitas',
      operational: 'Operasional Harian',
      dataMaster: 'Data Master',
      system: 'Administrasi Sistem'
    }

    return {
      menuType: activeMenuType,
      menuLabel: menuLabels[activeMenuType],
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
