/**
 * 🏗️ Header Constants - Configuration and constant values
 * @fileoverview Central constants for header component system
 */

import { Bell, Moon, Sun, Search, Settings, LogOut, User, Home, Users, School, Package, ChefHat, Truck, BarChart3, DollarSign, FileText, Cog } from "lucide-react"
import type { ThemeOption, SearchCategory, RouteConfig } from "../types/header.types"

// ================================
// UI Constants
// ================================

export const HEADER_HEIGHT = {
  DEFAULT: 64, // 16 * 4 (h-16)
  COMPACT: 48, // 12 * 4 (h-12)
  MINIMAL: 40, // 10 * 4 (h-10)
} as const

export const HEADER_Z_INDEX = {
  HEADER: 50,
  DROPDOWN: 100,
  MOBILE_SEARCH: 40,
} as const

export const HEADER_BREAKPOINTS = {
  MOBILE: 640, // sm
  TABLET: 1024, // lg
  DESKTOP: 1280, // xl
} as const

// ================================
// Animation Constants
// ================================

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
} as const

export const ANIMATION_EASING = {
  DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
  SMOOTH: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  BOUNCE: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const

// ================================
// Theme Constants
// ================================

export const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "light",
    label: "Terang",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Gelap",
    icon: Moon,
  },
  {
    value: "system",
    label: "Sistem",
    icon: Settings,
  },
] as const

export const DEFAULT_THEME = "system" as const

// ================================
// Search Constants
// ================================

export const SEARCH_CONFIG = {
  PLACEHOLDER: "Cari pengguna, sekolah, atau data...",
  DEBOUNCE_MS: 300,
  MAX_RESULTS: 10,
  MAX_RECENT_SEARCHES: 5,
} as const

export const SEARCH_CATEGORIES: SearchCategory[] = [
  {
    id: "users",
    label: "Pengguna",
    icon: Users,
    filter: "type:user",
  },
  {
    id: "schools",
    label: "Sekolah",
    icon: School,
    filter: "type:school",
  },
  {
    id: "inventory",
    label: "Inventori",
    icon: Package,
    filter: "type:inventory",
  },
  {
    id: "production",
    label: "Produksi",
    icon: ChefHat,
    filter: "type:production",
  },
  {
    id: "reports",
    label: "Laporan",
    icon: FileText,
    filter: "type:report",
  },
] as const

// ================================
// Notification Constants
// ================================

export const NOTIFICATION_TYPES = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  SUCCESS: "success",
} as const

export const NOTIFICATION_CONFIG = {
  MAX_DISPLAY: 5,
  REFRESH_INTERVAL: 30000, // 30 seconds
  AUTO_MARK_READ_DELAY: 3000, // 3 seconds
} as const

// ================================
// User Menu Constants
// ================================

export const USER_MENU_ITEMS = [
  {
    id: "profile",
    label: "Profil Saya",
    href: "/profile",
    icon: User,
  },
  {
    id: "settings",
    label: "Pengaturan",
    href: "/settings",
    icon: Settings,
  },
] as const

export const USER_MENU_ACTIONS = {
  LOGOUT: "logout",
} as const

// ================================
// Navigation Constants
// ================================

export const ROUTE_TITLES: RouteConfig = {
  "/dashboard": {
    title: "Dasbor",
    breadcrumbs: [{ label: "Dasbor", isActive: true }],
    description: "Ringkasan sistem SPPG",
  },
  "/dashboard/users": {
    title: "Pengguna",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Pengguna", isActive: true },
    ],
    description: "Manajemen pengguna sistem",
  },
  "/dashboard/schools": {
    title: "Sekolah",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Sekolah", isActive: true },
    ],
    description: "Manajemen data sekolah",
  },
  "/dashboard/raw-materials": {
    title: "Bahan Baku",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Bahan Baku", isActive: true },
    ],
    description: "Manajemen bahan baku",
  },
  "/dashboard/inventory": {
    title: "Inventori",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Inventori", isActive: true },
    ],
    description: "Manajemen inventori",
  },
  "/dashboard/production": {
    title: "Produksi",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Produksi", isActive: true },
    ],
    description: "Manajemen produksi makanan",
  },
  "/dashboard/distribution": {
    title: "Distribusi",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Distribusi", isActive: true },
    ],
    description: "Manajemen distribusi",
  },
  "/dashboard/waste-management": {
    title: "Manajemen Limbah",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Manajemen Limbah", isActive: true },
    ],
    description: "Manajemen limbah makanan",
  },
  "/dashboard/quality": {
    title: "Quality Control",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Quality Control", isActive: true },
    ],
    description: "Kontrol kualitas makanan",
  },
  "/dashboard/financial": {
    title: "Keuangan",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Keuangan", isActive: true },
    ],
    description: "Manajemen keuangan",
  },
  "/dashboard/reports": {
    title: "Laporan",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Laporan", isActive: true },
    ],
    description: "Laporan sistem",
  },
  "/dashboard/settings": {
    title: "Pengaturan",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Pengaturan", isActive: true },
    ],
    description: "Pengaturan sistem",
  },
} as const

export const DEFAULT_PAGE_TITLE = "SPPG System" as const

// ================================
// Responsive Constants
// ================================

export const RESPONSIVE_CONFIG = {
  mobile: {
    showSearch: false,
    showTitle: true,
    maxTitleLength: 20,
  },
  tablet: {
    showSearch: true,
    showTitle: true,
    maxTitleLength: 30,
  },
  desktop: {
    showSearch: true,
    showTitle: true,
    maxTitleLength: 50,
  },
} as const

// ================================
// Analytics Constants
// ================================

export const ANALYTICS_EVENTS = {
  HEADER_CLICK: "header_click",
  SEARCH_QUERY: "search_query",
  THEME_CHANGE: "theme_change",
  NOTIFICATION_CLICK: "notification_click",
  USER_MENU_CLICK: "user_menu_click",
  MOBILE_MENU_TOGGLE: "mobile_menu_toggle",
} as const

// ================================
// Error Messages
// ================================

export const ERROR_MESSAGES = {
  SEARCH_FAILED: "Pencarian gagal. Silakan coba lagi.",
  NOTIFICATIONS_FAILED: "Gagal memuat notifikasi.",
  THEME_CHANGE_FAILED: "Gagal mengubah tema.",
  USER_DATA_FAILED: "Gagal memuat data pengguna.",
  SIGNOUT_FAILED: "Gagal keluar dari sistem.",
} as const

// ================================
// Accessibility Constants
// ================================

export const ARIA_LABELS = {
  MOBILE_MENU_TOGGLE: "Buka/tutup menu navigasi",
  SEARCH_INPUT: "Pencarian",
  SEARCH_BUTTON: "Cari",
  NOTIFICATIONS: "Notifikasi",
  THEME_TOGGLE: "Ubah tema",
  USER_MENU: "Menu pengguna",
  CLOSE_SEARCH: "Tutup pencarian",
} as const

// ================================
// Storage Keys
// ================================

export const STORAGE_KEYS = {
  RECENT_SEARCHES: "header_recent_searches",
  SEARCH_PREFERENCES: "header_search_preferences",
  NOTIFICATION_PREFERENCES: "header_notification_preferences",
} as const
