/**
 * 🏗️ Header Types - Comprehensive type definitions for modular header
 * @fileoverview Type definitions for all header components and hooks
 */

import { LucideIcon } from "lucide-react"

// ================================
// Core Header Types
// ================================

export interface HeaderProps {
  onMobileSidebarToggle?: () => void
  sidebarOpen?: boolean
  className?: string
  // Add sidebar toggle props
  sidebarCollapsed?: boolean
  onSidebarToggle?: () => void
}

export interface HeaderConfig {
  showSearch?: boolean
  showNotifications?: boolean
  showThemeToggle?: boolean
  showUserMenu?: boolean
  showMobileMenu?: boolean
  searchPlaceholder?: string
}

// ================================
// Section Component Types
// ================================

export interface HeaderSectionProps {
  className?: string
  children?: React.ReactNode
}

export interface HeaderLeftProps extends HeaderSectionProps {
  onMobileSidebarToggle?: () => void
  sidebarOpen?: boolean
  pageTitle?: string
  // Sidebar toggle props
  sidebarCollapsed?: boolean
  onSidebarToggle?: () => void
}

export interface HeaderCenterProps extends HeaderSectionProps {
  showSearch?: boolean
  searchPlaceholder?: string
}

export interface HeaderRightProps extends HeaderSectionProps {
  showNotifications?: boolean
  showThemeToggle?: boolean
  showUserMenu?: boolean
}

// ================================
// Feature Component Types
// ================================

export interface MobileMenuToggleProps {
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

export interface PageTitleProps {
  title?: string
  className?: string
  showBreadcrumb?: boolean
}

export interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  showMobileSearch?: boolean
}

export interface NotificationButtonProps {
  className?: string
  position?: "left" | "right"
}

export interface ThemeToggleProps {
  className?: string
  variant?: "button" | "inline"
}

export interface UserMenuProps {
  className?: string
  showRole?: boolean
  showAvatar?: boolean
}

// ================================
// Hook Types
// ================================

export interface UseHeaderReturn {
  // State
  mobileSearchOpen: boolean
  searchQuery: string
  
  // Handlers
  toggleMobileSearch: () => void
  handleSearch: (query: string) => void
  handleMobileSidebarToggle: () => void
  
  // Data
  pageTitle: string
  notificationCount: number
  user: HeaderUser | null
  
  // Config
  config: HeaderConfig
}

export interface UsePageTitleReturn {
  title: string
  breadcrumbs: BreadcrumbItem[]
  setCustomTitle: (title: string) => void
  resetTitle: () => void
}

export interface UseHeaderSearchReturn {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  isSearching: boolean
  handleSearch: (query: string) => void
  handleClearSearch: () => void
  recentSearches: string[]
}

export interface UseHeaderNotificationsReturn {
  notifications: HeaderNotification[]
  count: number
  loading: boolean
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  refreshNotifications: () => void
}

export interface UseHeaderThemeReturn {
  theme: string | undefined
  setTheme: (theme: string) => void
  toggleTheme: () => void
  isDark: boolean
  isSystem: boolean
}

export interface UseHeaderUserReturn {
  user: HeaderUser | null
  profile: UserProfile | null
  role: string
  handleSignOut: () => void
  isLoading: boolean
}

export interface UseHeaderAnalyticsReturn {
  trackHeaderClick: (element: string, action: string) => void
  trackSearch: (query: string, resultsCount: number) => void
  trackThemeChange: (newTheme: string) => void
  trackNotificationClick: (notificationId: string) => void
}

// ================================
// Data Types
// ================================

export interface HeaderUser {
  id: string
  name: string
  email: string
  avatar?: string
  roles: UserRole[]
}

export interface UserRole {
  id: string
  name: string
  displayName: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  roles: Array<{
    role: {
      id: string
      name: string
    }
  }>
}

export interface HeaderNotification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  read: boolean
  createdAt: string
  link?: string
  icon?: LucideIcon
}

export interface SearchResult {
  id: string
  title: string
  description: string
  type: "user" | "school" | "menu" | "report" | "page"
  url: string
  icon?: LucideIcon
}

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
  icon?: string // Icon name for specific breadcrumb items
  isDynamic?: boolean // Indicates if the label should be replaced with dynamic data
}

export interface PageConfig {
  title: string
  breadcrumbs?: BreadcrumbItem[]
  description?: string
  keywords?: string[]
}

// ================================
// Navigation Types
// ================================

export interface NavigationItem {
  href: string
  label: string
  icon?: LucideIcon
  children?: NavigationItem[]
}

export interface RouteConfig {
  [key: string]: PageConfig
}

// ================================
// Theme Types
// ================================

export type ThemeMode = "light" | "dark" | "system"

export interface ThemeOption {
  value: ThemeMode
  label: string
  icon: LucideIcon
}

// ================================
// Search Types
// ================================

export interface SearchConfig {
  placeholder: string
  shortcuts: SearchShortcut[]
  categories: SearchCategory[]
  maxResults: number
  debounceMs: number
}

export interface SearchShortcut {
  key: string
  label: string
  action: () => void
}

export interface SearchCategory {
  id: string
  label: string
  icon: LucideIcon
  filter: string
}

// ================================
// Analytics Types
// ================================

export interface HeaderAnalyticsEvent {
  element: string
  action: string
  value?: string | number
  timestamp: Date
  userId?: string
}

// ================================
// Responsive Types
// ================================

export interface ResponsiveConfig {
  mobile: {
    showSearch: boolean
    showTitle: boolean
    maxTitleLength: number
  }
  tablet: {
    showSearch: boolean
    showTitle: boolean
    maxTitleLength: number
  }
  desktop: {
    showSearch: boolean
    showTitle: boolean
    maxTitleLength: number
  }
}

// ================================
// Error Types
// ================================

export interface HeaderError {
  component: string
  message: string
  timestamp: Date
  userId?: string
}

// ================================
// Utility Types
// ================================

export type HeaderVariant = "default" | "compact" | "minimal"
export type HeaderPosition = "sticky" | "fixed" | "static"
export type HeaderSize = "sm" | "md" | "lg"

// ================================
// Component Ref Types
// ================================

export interface HeaderRef {
  focusSearch: () => void
  toggleMobileSearch: () => void
  toggleTheme: () => void
  openNotifications: () => void
  openUserMenu: () => void
}

// ================================
// Context Types
// ================================

export interface HeaderContextValue {
  state: UseHeaderReturn
  config: HeaderConfig
  theme: UseHeaderThemeReturn
  user: UseHeaderUserReturn
  search: UseHeaderSearchReturn
  notifications: UseHeaderNotificationsReturn
  analytics: UseHeaderAnalyticsReturn
}
