/**
 * 🏗️ Search Configuration - Search functionality configuration
 * @fileoverview Configuration for search features and categories
 */

import { Users, School, Package, ChefHat, Truck, FileText, DollarSign, Settings, Search, Filter, Clock, Star } from "lucide-react"
import type { SearchConfig, SearchCategory, SearchShortcut } from "../types/header.types"

// ================================
// Search Categories Configuration
// ================================

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
    id: "raw-materials",
    label: "Bahan Baku",
    icon: Package,
    filter: "type:raw-material",
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
    id: "distribution",
    label: "Distribusi",
    icon: Truck,
    filter: "type:distribution",
  },
  {
    id: "reports",
    label: "Laporan",
    icon: FileText,
    filter: "type:report",
  },
  {
    id: "financial",
    label: "Keuangan",
    icon: DollarSign,
    filter: "type:financial",
  },
  {
    id: "settings",
    label: "Pengaturan",
    icon: Settings,
    filter: "type:setting",
  },
]

// ================================
// Search Shortcuts Configuration
// ================================

export const SEARCH_SHORTCUTS: SearchShortcut[] = [
  {
    key: "cmd+k",
    label: "Buka pencarian",
    action: () => {
      // Will be implemented in search hook
      console.log("Open search")
    },
  },
  {
    key: "esc",
    label: "Tutup pencarian",
    action: () => {
      // Will be implemented in search hook
      console.log("Close search")
    },
  },
  {
    key: "↑↓",
    label: "Navigasi hasil",
    action: () => {
      // Will be implemented in search hook
      console.log("Navigate results")
    },
  },
  {
    key: "enter",
    label: "Pilih hasil",
    action: () => {
      // Will be implemented in search hook
      console.log("Select result")
    },
  },
]

// ================================
// Main Search Configuration
// ================================

export const SEARCH_CONFIG: SearchConfig = {
  placeholder: "Cari pengguna, sekolah, atau data...",
  shortcuts: SEARCH_SHORTCUTS,
  categories: SEARCH_CATEGORIES,
  maxResults: 10,
  debounceMs: 300,
}

// ================================
// Search Result Templates
// ================================

export const SEARCH_RESULT_TEMPLATES = {
  user: {
    titleField: "name",
    descriptionField: "email",
    subtitleField: "role",
    urlPattern: "/dashboard/users/[id]",
    icon: Users,
  },
  school: {
    titleField: "name",
    descriptionField: "address",
    subtitleField: "type",
    urlPattern: "/dashboard/schools/[id]",
    icon: School,
  },
  "raw-material": {
    titleField: "name",
    descriptionField: "description",
    subtitleField: "category",
    urlPattern: "/dashboard/raw-materials/[id]",
    icon: Package,
  },
  inventory: {
    titleField: "name",
    descriptionField: "description",
    subtitleField: "quantity",
    urlPattern: "/dashboard/inventory/[id]",
    icon: Package,
  },
  production: {
    titleField: "batchNumber",
    descriptionField: "menuName",
    subtitleField: "status",
    urlPattern: "/dashboard/production/batches/[id]",
    icon: ChefHat,
  },
  distribution: {
    titleField: "deliveryNumber",
    descriptionField: "schoolName",
    subtitleField: "status",
    urlPattern: "/dashboard/distribution/[id]",
    icon: Truck,
  },
  report: {
    titleField: "title",
    descriptionField: "description",
    subtitleField: "type",
    urlPattern: "/dashboard/reports/[id]",
    icon: FileText,
  },
  financial: {
    titleField: "description",
    descriptionField: "amount",
    subtitleField: "date",
    urlPattern: "/dashboard/financial/[id]",
    icon: DollarSign,
  },
  setting: {
    titleField: "name",
    descriptionField: "description",
    subtitleField: "category",
    urlPattern: "/dashboard/settings/[category]",
    icon: Settings,
  },
} as const

// ================================
// Search Filters
// ================================

export const SEARCH_FILTERS = {
  // Date filters
  today: {
    label: "Hari ini",
    value: "date:today",
    icon: Clock,
  },
  week: {
    label: "Minggu ini",
    value: "date:week",
    icon: Clock,
  },
  month: {
    label: "Bulan ini",
    value: "date:month",
    icon: Clock,
  },
  
  // Status filters
  active: {
    label: "Aktif",
    value: "status:active",
    icon: Filter,
  },
  inactive: {
    label: "Tidak aktif",
    value: "status:inactive",
    icon: Filter,
  },
  pending: {
    label: "Pending",
    value: "status:pending",
    icon: Filter,
  },
  
  // Priority filters
  high: {
    label: "Prioritas tinggi",
    value: "priority:high",
    icon: Star,
  },
  medium: {
    label: "Prioritas sedang",
    value: "priority:medium",
    icon: Star,
  },
  low: {
    label: "Prioritas rendah",
    value: "priority:low",
    icon: Star,
  },
} as const

// ================================
// Search Query Suggestions
// ================================

export const SEARCH_SUGGESTIONS = [
  "pengguna aktif",
  "sekolah jakarta",
  "bahan baku habis",
  "produksi hari ini",
  "distribusi pending",
  "laporan bulanan",
  "inventori rendah",
  "keuangan pengeluaran",
] as const

// ================================
// Search Commands
// ================================

export const SEARCH_COMMANDS = {
  // Navigation commands
  "go to": {
    pattern: /^go to (.+)$/i,
    handler: (match: RegExpMatchArray) => {
      const page = match[1].toLowerCase()
      // Navigation logic will be implemented
      console.log(`Navigate to: ${page}`)
    },
  },
  
  // Quick actions
  "create": {
    pattern: /^create (.+)$/i,
    handler: (match: RegExpMatchArray) => {
      const entity = match[1].toLowerCase()
      // Creation logic will be implemented
      console.log(`Create: ${entity}`)
    },
  },
  
  // Search with filters
  "find": {
    pattern: /^find (.+) in (.+)$/i,
    handler: (match: RegExpMatchArray) => {
      const term = match[1]
      const category = match[2]
      // Filtered search logic will be implemented
      console.log(`Find: ${term} in ${category}`)
    },
  },
} as const

// ================================
// Search Result Scoring
// ================================

export const SEARCH_SCORING = {
  // Boost factors for different match types
  EXACT_MATCH: 100,
  STARTS_WITH: 80,
  CONTAINS: 60,
  PARTIAL: 40,
  FUZZY: 20,
  
  // Field importance weights
  TITLE_WEIGHT: 1.0,
  DESCRIPTION_WEIGHT: 0.7,
  SUBTITLE_WEIGHT: 0.5,
  CONTENT_WEIGHT: 0.3,
  
  // Recency boost
  RECENT_BOOST: 1.2,
  
  // Category boost
  CATEGORY_BOOST: 1.1,
} as const

// ================================
// Search Analytics
// ================================

export const SEARCH_ANALYTICS_EVENTS = {
  SEARCH_QUERY: "search_query",
  SEARCH_RESULT_CLICK: "search_result_click",
  SEARCH_FILTER_APPLIED: "search_filter_applied",
  SEARCH_SUGGESTION_USED: "search_suggestion_used",
  SEARCH_COMMAND_EXECUTED: "search_command_executed",
  SEARCH_CLEARED: "search_cleared",
  SEARCH_NO_RESULTS: "search_no_results",
} as const

// ================================
// Utility Functions
// ================================

export const parseSearchQuery = (query: string) => {
  const filters = []
  const terms = []
  
  // Extract filters (type:value format)
  const filterRegex = /(\w+):(\w+)/g
  let match
  while ((match = filterRegex.exec(query)) !== null) {
    filters.push({ key: match[1], value: match[2] })
  }
  
  // Extract regular terms
  const cleanQuery = query.replace(/\w+:\w+/g, '').trim()
  if (cleanQuery) {
    terms.push(...cleanQuery.split(/\s+/))
  }
  
  return { filters, terms }
}

export const buildSearchUrl = (query: string, category?: string) => {
  const params = new URLSearchParams()
  params.set('q', query)
  if (category) params.set('category', category)
  
  return `/search?${params.toString()}`
}

export const highlightSearchTerm = (text: string, term: string) => {
  if (!term) return text
  
  const regex = new RegExp(`(${term})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
