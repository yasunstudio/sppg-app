import { LucideIcon } from "lucide-react"

export interface MenuState {
  // Core Operations
  production: boolean
  menuPlanning: boolean
  distribution: boolean
  quality: boolean
  
  // Management & Administration  
  institution: boolean
  supplyChain: boolean
  standards: boolean
  procurement: boolean
  logistics: boolean
  monitoring: boolean
  system: boolean
  
  // UI Preferences
  preferences: MenuPreferences
}

export interface MenuPreferences {
  autoExpandActive: boolean
  persistState: boolean
  preventActiveCollapse: boolean
}

export interface MenuItem {
  name: string
  href: string
  icon: LucideIcon
  current: boolean
  permission?: string[]
  submenu?: MenuItem[]
  badge?: string
  description?: string
}

export interface MenuSection {
  title: string
  items: MenuItem[]
  isExpandable?: boolean
  menuType?: string
  pathMatch?: string
}

export interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
  className?: string
}

export interface SidebarContextType {
  // State
  menuState: MenuState
  activeMenuType: string | null
  hasActiveMenu: boolean
  
  // Actions
  toggleMenu: (menuType: string, forceValue?: boolean) => boolean
  
  // Computed
  isMenuExpanded: (menuType: string) => boolean
  hasActiveSubmenu: (menuType: string) => boolean
  
  // Mobile
  handleMobileLinkClick: () => void
}

export type MenuType = 
  | 'production' 
  | 'menuPlanning' 
  | 'distribution' 
  | 'quality'
  | 'institution'
  | 'supplyChain' 
  | 'standards'
  | 'procurement'
  | 'logistics'
  | 'monitoring' 
  | 'system'

export interface AnalyticsMetadata {
  action: string
  menuType: string
  currentPath: string
  timestamp: number
  [key: string]: any
}
