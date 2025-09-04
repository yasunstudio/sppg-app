/**
 * 🏗️ Header Helpers - General utility functions for header
 * @fileoverview Common utility functions for header components
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ================================
// CSS Class Utilities
// ================================

/**
 * Combines and optimizes Tailwind CSS classes
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Conditionally applies classes based on state
 */
export const conditionalClass = (
  baseClass: string,
  condition: boolean,
  trueClass: string,
  falseClass: string = ""
) => {
  return cn(baseClass, condition ? trueClass : falseClass)
}

/**
 * Creates responsive classes
 */
export const responsiveClass = (
  mobile: string,
  tablet?: string,
  desktop?: string
) => {
  return cn(
    mobile,
    tablet && `md:${tablet}`,
    desktop && `lg:${desktop}`
  )
}

// ================================
// String Utilities
// ================================

/**
 * Truncates text to specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength - 3)}...`
}

/**
 * Capitalizes first letter of each word
 */
export const titleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Converts string to kebab-case
 */
export const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Converts string to camelCase
 */
export const camelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

/**
 * Removes HTML tags from string
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Highlights search terms in text
 */
export const highlightText = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
}

// ================================
// Number Utilities
// ================================

/**
 * Formats number for display (e.g., 1000 -> "1K")
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Formats currency for Indonesian Rupiah
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

// ================================
// Date Utilities
// ================================

/**
 * Formats date for Indonesian locale
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

/**
 * Formats time for Indonesian locale
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Gets relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Baru saja'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`
  
  return formatDate(dateObj)
}

/**
 * Checks if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  
  return dateObj.toDateString() === today.toDateString()
}

// ================================
// URL Utilities
// ================================

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Extracts domain from URL
 */
export const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

/**
 * Builds URL with query parameters
 */
export const buildUrl = (base: string, params: Record<string, string | number | boolean>): string => {
  const url = new URL(base, window.location.origin)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })
  
  return url.toString()
}

// ================================
// Storage Utilities
// ================================

/**
 * Safely gets item from localStorage
 */
export const getStorageItem = (key: string, defaultValue: any = null): any => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Safely sets item in localStorage
 */
export const setStorageItem = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Safely removes item from localStorage
 */
export const removeStorageItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

// ================================
// Array Utilities
// ================================

/**
 * Removes duplicates from array
 */
export const uniqueArray = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

/**
 * Groups array by key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Sorts array by multiple criteria
 */
export const sortBy = <T>(array: T[], ...criteria: Array<keyof T | ((item: T) => any)>): T[] => {
  return [...array].sort((a, b) => {
    for (const criterion of criteria) {
      let aValue, bValue
      
      if (typeof criterion === 'function') {
        aValue = criterion(a)
        bValue = criterion(b)
      } else {
        aValue = a[criterion]
        bValue = b[criterion]
      }
      
      if (aValue < bValue) return -1
      if (aValue > bValue) return 1
    }
    return 0
  })
}

// ================================
// Debounce Utilities
// ================================

/**
 * Debounces function execution
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttles function execution
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// ================================
// Accessibility Utilities
// ================================

/**
 * Generates accessible ID
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Manages focus trap for modals/dropdowns
 */
export const trapFocus = (element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }
  }
  
  element.addEventListener('keydown', handleTabKey)
  firstElement?.focus()
  
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

// ================================
// Error Handling Utilities
// ================================

/**
 * Safe async function execution with error handling
 */
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await asyncFn()
  } catch (error) {
    console.error('Safe async error:', error)
    return fallback
  }
}

/**
 * Retry function with exponential backoff
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let attempts = 0
  
  while (attempts < maxAttempts) {
    try {
      return await fn()
    } catch (error) {
      attempts++
      if (attempts === maxAttempts) throw error
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempts - 1)))
    }
  }
  
  throw new Error('Max retry attempts reached')
}
