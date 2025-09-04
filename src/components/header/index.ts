/**
 * 🏗️ Header Module - Main export file
 * @fileoverview Main export point for header module
 */

// Main component
export { Header } from './Header'

// Sub-components (for advanced usage)
export * from './components'

// Hooks (for custom implementations)
export * from './hooks'

// Types (for TypeScript users)
export * from './types'

// Utilities (for helper functions) - specific exports to avoid conflicts
export {
  cn,
  conditionalClass,
  responsiveClass,
  truncateText,
  kebabCase,
  camelCase,
  stripHtml,
  highlightText,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatTime,
  getRelativeTime,
  isToday,
  isValidUrl,
  getDomain,
  buildUrl,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  uniqueArray,
  groupBy,
  sortBy,
  debounce,
  throttle,
  generateId,
  trapFocus,
  safeAsync,
  retry,
  titleCaseHelper,
  titleCaseTitle,
  formatTitleForDisplay,
  createSEOTitle,
  getPageType,
  isDetailPage,
  getParentRoute,
  buildNavigationUrl,
  arePathsRelated,
  getLocalizedTitle,
  getLocalizedBreadcrumbs
} from './utils'

// Constants (for configuration) - specific exports to avoid conflicts
export {
  HEADER_HEIGHT,
  HEADER_Z_INDEX,
  HEADER_BREAKPOINTS,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  THEME_OPTIONS,
  DEFAULT_THEME,
  NOTIFICATION_TYPES,
  NOTIFICATION_CONFIG,
  USER_MENU_ITEMS,
  USER_MENU_ACTIONS,
  ROUTE_TITLES,
  DEFAULT_PAGE_TITLE,
  RESPONSIVE_CONFIG,
  ANALYTICS_EVENTS,
  ERROR_MESSAGES,
  ARIA_LABELS,
  STORAGE_KEYS
} from './constants'

// Data configuration (for page and search config)
export {
  PAGE_CONFIGS,
  DEFAULT_PAGE_CONFIG
} from './data/pageConfig'

export {
  SEARCH_CATEGORIES as SEARCH_DATA_CATEGORIES,
  SEARCH_SHORTCUTS,
  SEARCH_CONFIG as SEARCH_DATA_CONFIG,
  SEARCH_RESULT_TEMPLATES,
  SEARCH_FILTERS,
  SEARCH_SUGGESTIONS,
  SEARCH_COMMANDS,
  SEARCH_SCORING,
  SEARCH_ANALYTICS_EVENTS
} from './data/searchConfig'
