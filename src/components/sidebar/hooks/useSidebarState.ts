"use client"

import { useState, useEffect } from "react"
import type { MenuState, MenuType } from "../types/sidebar.types"

const STORAGE_KEY = 'sppg-professional-sidebar'

const defaultMenuState: MenuState = {
  production: false,
  menuPlanning: false,
  distribution: false,
  monitoring: false,
  quality: false,
  operational: false,
  dataMaster: false,
  system: false,
  preferences: {
    autoExpandActive: true,
    persistState: true,
    preventActiveCollapse: true
  }
}

export const useSidebarState = () => {
  // Initialize state with persistence
  const [menuState, setMenuState] = useState<MenuState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return {
            ...defaultMenuState,
            ...parsed,
            preferences: {
              ...defaultMenuState.preferences,
              ...parsed.preferences
            }
          }
        } catch (e) {
          console.warn('Professional sidebar: Failed to parse saved state')
        }
      }
    }
    return defaultMenuState
  })

  // Persist state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && menuState.preferences?.persistState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuState))
    }
  }, [menuState])

  // Professional menu toggle with smart behavior
  const toggleMenu = (menuType: MenuType, forceValue?: boolean): boolean => {
    const currentValue = menuState[menuType]
    const newValue = forceValue !== undefined ? forceValue : !currentValue
    
    setMenuState(prev => ({
      ...prev,
      [menuType]: newValue
    }))
    
    return true
  }

  // Force expand a menu (used by auto-expand logic)
  const expandMenu = (menuType: MenuType) => {
    if (!menuState[menuType]) {
      toggleMenu(menuType, true)
    }
  }

  // Check if menu is expanded
  const isMenuExpanded = (menuType: MenuType): boolean => {
    return menuState[menuType]
  }

  // Get all expanded menus
  const getExpandedMenus = (): MenuType[] => {
    return Object.entries(menuState)
      .filter(([key, value]) => key !== 'preferences' && value === true)
      .map(([key]) => key as MenuType)
  }

  // Get menu context for analytics
  const getMenuContext = () => ({
    totalOpenMenus: getExpandedMenus().length,
    expandedMenus: getExpandedMenus(),
    preferences: menuState.preferences
  })

  return {
    // State
    menuState,
    
    // Actions
    toggleMenu,
    expandMenu,
    setMenuState,
    
    // Getters
    isMenuExpanded,
    getExpandedMenus,
    getMenuContext,
    
    // Legacy compatibility (untuk backward compatibility)
    productionExpanded: menuState.production,
    menuPlanningExpanded: menuState.menuPlanning,
    distributionExpanded: menuState.distribution,
    monitoringExpanded: menuState.monitoring,
    qualityExpanded: menuState.quality
  }
}
