/**
 * 🏗️ Page Configuration - Page titles and metadata
 * @fileoverview Configuration for page titles, breadcrumbs, and metadata
 */

import { Home, Users, School, Package, ChefHat, Truck, Trash2, CheckSquare, DollarSign, FileText, Settings } from "lucide-react"
import type { RouteConfig, PageConfig } from "../types/header.types"

// ================================
// Route to Page Configuration Mapping
// ================================

export const PAGE_CONFIGS: RouteConfig = {
  // Dashboard Routes
  "/dashboard": {
    title: "Dasbor",
    breadcrumbs: [
      { label: "Dasbor", isActive: true }
    ],
    description: "Ringkasan dan overview sistem SPPG",
    keywords: ["dashboard", "dasbor", "overview", "summary"]
  },

  // User Management
  "/dashboard/users": {
    title: "Pengguna",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Pengguna", isActive: true }
    ],
    description: "Manajemen pengguna, role, dan permissions",
    keywords: ["users", "pengguna", "management", "roles", "permissions"]
  },

  // School Management
  "/dashboard/schools": {
    title: "Sekolah",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Sekolah", isActive: true }
    ],
    description: "Manajemen data sekolah dan informasi institusi",
    keywords: ["schools", "sekolah", "institutions", "education"]
  },

  // Raw Materials
  "/dashboard/raw-materials": {
    title: "Bahan Baku",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Bahan Baku", isActive: true }
    ],
    description: "Manajemen bahan baku dan supplier",
    keywords: ["raw materials", "bahan baku", "ingredients", "suppliers"]
  },

  // Inventory Management
  "/dashboard/inventory": {
    title: "Inventori",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Inventori", isActive: true }
    ],
    description: "Manajemen stok dan inventori barang",
    keywords: ["inventory", "inventori", "stock", "warehouse"]
  },

  // Production Management
  "/dashboard/production": {
    title: "Produksi",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Produksi", isActive: true }
    ],
    description: "Manajemen produksi makanan dan menu",
    keywords: ["production", "produksi", "cooking", "menu", "food"]
  },

  // Distribution Management
  "/dashboard/distribution": {
    title: "Distribusi",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Distribusi", isActive: true }
    ],
    description: "Manajemen distribusi dan pengiriman makanan",
    keywords: ["distribution", "distribusi", "delivery", "logistics"]
  },

  // Waste Management
  "/dashboard/waste-management": {
    title: "Manajemen Limbah",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Manajemen Limbah", isActive: true }
    ],
    description: "Manajemen limbah makanan dan daur ulang",
    keywords: ["waste", "limbah", "recycling", "sustainability"]
  },

  // Quality Control
  "/dashboard/quality": {
    title: "Quality Control",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Quality Control", isActive: true }
    ],
    description: "Kontrol kualitas makanan dan standar keamanan",
    keywords: ["quality", "kualitas", "control", "safety", "standards"]
  },

  // Financial Management
  "/dashboard/financial": {
    title: "Keuangan",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Keuangan", isActive: true }
    ],
    description: "Manajemen keuangan dan anggaran",
    keywords: ["financial", "keuangan", "budget", "accounting"]
  },

  // Reports
  "/dashboard/reports": {
    title: "Laporan",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Laporan", isActive: true }
    ],
    description: "Laporan dan analisis data sistem",
    keywords: ["reports", "laporan", "analytics", "data"]
  },

  // Settings
  "/dashboard/settings": {
    title: "Pengaturan",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Pengaturan", isActive: true }
    ],
    description: "Pengaturan sistem dan konfigurasi",
    keywords: ["settings", "pengaturan", "configuration", "preferences"]
  },

  // Sub-routes for detailed views
  "/dashboard/users/[id]": {
    title: "Detail Pengguna",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Pengguna", href: "/dashboard/users" },
      { label: "Detail", isActive: true }
    ],
    description: "Detail informasi pengguna",
    keywords: ["user details", "profile", "information"]
  },

  "/dashboard/schools/[id]": {
    title: "Detail Sekolah",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Sekolah", href: "/dashboard/schools" },
      { label: "Detail", isActive: true }
    ],
    description: "Detail informasi sekolah",
    keywords: ["school details", "institution", "information"]
  },

  "/dashboard/production/batches": {
    title: "Batch Produksi",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Produksi", href: "/dashboard/production" },
      { label: "Batch", isActive: true }
    ],
    description: "Manajemen batch produksi makanan",
    keywords: ["production batch", "cooking", "food preparation"]
  },

  "/dashboard/reports/analytics": {
    title: "Analisis Data",
    breadcrumbs: [
      { label: "Dasbor", href: "/dashboard" },
      { label: "Laporan", href: "/dashboard/reports" },
      { label: "Analisis", isActive: true }
    ],
    description: "Analisis data dan statistik sistem",
    keywords: ["analytics", "statistics", "data analysis"]
  }
}

// ================================
// Default Configuration
// ================================

export const DEFAULT_PAGE_CONFIG: PageConfig = {
  title: "SPPG System",
  breadcrumbs: [
    { label: "SPPG System", isActive: true }
  ],
  description: "Sistem Pengelolaan Program Gizi",
  keywords: ["sppg", "nutrition", "management", "system"]
}

// ================================
// Page Title Generators
// ================================

export const generatePageTitle = (pathname: string, customTitle?: string): string => {
  if (customTitle) return customTitle
  
  const config = PAGE_CONFIGS[pathname]
  if (config) return config.title
  
  // Try to match dynamic routes
  for (const route in PAGE_CONFIGS) {
    if (route.includes('[') && pathname.startsWith(route.split('[')[0])) {
      return PAGE_CONFIGS[route].title
    }
  }
  
  return DEFAULT_PAGE_CONFIG.title
}

export const generateBreadcrumbs = (pathname: string, customBreadcrumbs?: Array<{ label: string; href?: string; isActive?: boolean }>) => {
  if (customBreadcrumbs) return customBreadcrumbs
  
  const config = PAGE_CONFIGS[pathname]
  if (config?.breadcrumbs) return config.breadcrumbs
  
  // Try to match dynamic routes
  for (const route in PAGE_CONFIGS) {
    if (route.includes('[') && pathname.startsWith(route.split('[')[0])) {
      return PAGE_CONFIGS[route].breadcrumbs
    }
  }
  
  return DEFAULT_PAGE_CONFIG.breadcrumbs
}

// ================================
// SEO Metadata Generators
// ================================

export const generateMetadata = (pathname: string) => {
  const config = PAGE_CONFIGS[pathname] || DEFAULT_PAGE_CONFIG
  
  return {
    title: `${config.title} - SPPG System`,
    description: config.description,
    keywords: config.keywords?.join(", "),
  }
}

// ================================
// Route Validation
// ================================

export const isValidRoute = (pathname: string): boolean => {
  return pathname in PAGE_CONFIGS || pathname.startsWith('/dashboard')
}

export const getRouteDepth = (pathname: string): number => {
  return pathname.split('/').filter(Boolean).length
}

// ================================
// Utility Functions
// ================================

export const formatPageTitle = (title: string, maxLength: number = 50): string => {
  if (title.length <= maxLength) return title
  return `${title.substring(0, maxLength - 3)}...`
}

export const extractRouteParams = (pattern: string, pathname: string): Record<string, string> => {
  const patternParts = pattern.split('/')
  const pathnameParts = pathname.split('/')
  const params: Record<string, string> = {}
  
  patternParts.forEach((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const paramName = part.slice(1, -1)
      params[paramName] = pathnameParts[index] || ''
    }
  })
  
  return params
}
