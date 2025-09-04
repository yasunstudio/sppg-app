/**
 * 🏗️ Header Utils - Main export file
 * @fileoverview Exports all header utility functions
 */

// Re-export specific functions to avoid naming conflicts
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
  titleCase as titleCaseHelper
} from './headerHelpers'

export {
  generatePageTitle,
  findDynamicRouteConfig,
  isDynamicRoute,
  matchesDynamicRoute,
  generateTitleFromPath,
  titleCase as titleCaseTitle,
  generateBreadcrumbs,
  interpolateDynamicBreadcrumbs,
  generateBreadcrumbsFromPath,
  formatTitleForDisplay,
  createSEOTitle,
  getPageType,
  getRouteDepth,
  isDetailPage,
  getParentRoute,
  extractRouteParams,
  buildNavigationUrl,
  arePathsRelated,
  getLocalizedTitle,
  getLocalizedBreadcrumbs
} from './titleHelpers'
