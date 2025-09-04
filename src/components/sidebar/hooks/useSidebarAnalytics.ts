"use client"

import { useCallback } from "react"
import type { MenuType, AnalyticsMetadata } from "../types/sidebar.types"

export const useSidebarAnalytics = () => {
  // Professional analytics tracking
  const trackMenuInteraction = useCallback((
    action: string, 
    menuType: MenuType, 
    metadata: Partial<AnalyticsMetadata> = {}
  ) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'professional_sidebar_interaction', {
        action,
        menu_type: menuType,
        current_path: window.location.pathname,
        timestamp: Date.now(),
        ...metadata
      })
    }
    
    // Also log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Sidebar Analytics:`, {
        action,
        menuType,
        timestamp: new Date().toISOString(),
        ...metadata
      })
    }
  }, [])

  // Specific tracking functions
  const trackMenuExpand = useCallback((menuType: MenuType, isActiveMenu: boolean = false) => {
    trackMenuInteraction('expand', menuType, {
      is_active_menu: isActiveMenu,
      user_initiated: true
    })
  }, [trackMenuInteraction])

  const trackMenuCollapse = useCallback((menuType: MenuType, wasBlocked: boolean = false) => {
    trackMenuInteraction('collapse', menuType, {
      was_blocked: wasBlocked,
      user_initiated: true
    })
  }, [trackMenuInteraction])

  const trackCollapseBlocked = useCallback((menuType: MenuType, reason: string) => {
    trackMenuInteraction('collapse_blocked', menuType, {
      reason,
      professional_ux: true
    })
  }, [trackMenuInteraction])

  const trackAutoExpand = useCallback((menuType: MenuType, pathname: string) => {
    trackMenuInteraction('auto_expand', menuType, {
      trigger: 'navigation',
      target_path: pathname,
      professional_behavior: true
    })
  }, [trackMenuInteraction])

  const trackSidebarToggle = useCallback((action: 'open' | 'close', isMobile: boolean = false) => {
    trackMenuInteraction(action, 'sidebar' as MenuType, {
      device_type: isMobile ? 'mobile' : 'desktop',
      interaction_type: 'sidebar_toggle'
    })
  }, [trackMenuInteraction])

  const trackNavigationClick = useCallback((href: string, menuType: MenuType | null = null) => {
    trackMenuInteraction('navigation_click', menuType || 'unknown' as MenuType, {
      target_href: href,
      interaction_type: 'navigation'
    })
  }, [trackMenuInteraction])

  // Session tracking
  const trackSidebarSession = useCallback((sessionData: {
    totalInteractions: number
    averageTimeOnPage: number
    mostUsedMenu: MenuType
    sessionDuration: number
  }) => {
    trackMenuInteraction('session_summary', sessionData.mostUsedMenu, {
      ...sessionData,
      interaction_type: 'session_analytics'
    })
  }, [trackMenuInteraction])

  // Performance tracking
  const trackPerformance = useCallback((performanceData: {
    renderTime: number
    stateUpdateTime: number
    animationFrames: number
  }) => {
    trackMenuInteraction('performance_metrics', 'system' as MenuType, {
      ...performanceData,
      interaction_type: 'performance'
    })
  }, [trackMenuInteraction])

  return {
    // Core tracking
    trackMenuInteraction,
    
    // Specific actions
    trackMenuExpand,
    trackMenuCollapse,
    trackCollapseBlocked,
    trackAutoExpand,
    trackSidebarToggle,
    trackNavigationClick,
    
    // Advanced tracking
    trackSidebarSession,
    trackPerformance
  }
}
