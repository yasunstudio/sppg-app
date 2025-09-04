/**
 * 🏗️ Page Title Helpers - Utilities for page title management
 * @fileoverview Helper functions for page title generation and management
 */

import { PAGE_CONFIGS, DEFAULT_PAGE_CONFIG } from "../data/pageConfig"
import type { BreadcrumbItem, PageConfig } from "../types/header.types"

// ================================
// Title Generation Functions
// ================================

/**
 * Generates page title based on pathname
 */
export const generatePageTitle = (pathname: string, customTitle?: string): string => {
  // Return custom title if provided
  if (customTitle) return customTitle
  
  // Check exact match first
  const exactConfig = PAGE_CONFIGS[pathname]
  if (exactConfig) return exactConfig.title
  
  // Check dynamic routes
  const dynamicConfig = findDynamicRouteConfig(pathname)
  if (dynamicConfig) return dynamicConfig.title
  
  // Generate title from path segments
  const generatedTitle = generateTitleFromPath(pathname)
  if (generatedTitle) return generatedTitle
  
  return DEFAULT_PAGE_CONFIG.title
}

/**
 * Finds configuration for dynamic routes (containing [id] or similar)
 */
export const findDynamicRouteConfig = (pathname: string): PageConfig | null => {
  for (const [route, config] of Object.entries(PAGE_CONFIGS)) {
    if (isDynamicRoute(route) && matchesDynamicRoute(route, pathname)) {
      return config
    }
  }
  return null
}

/**
 * Checks if a route pattern is dynamic (contains brackets)
 */
export const isDynamicRoute = (route: string): boolean => {
  return route.includes('[') && route.includes(']')
}

/**
 * Checks if pathname matches a dynamic route pattern
 */
export const matchesDynamicRoute = (pattern: string, pathname: string): boolean => {
  const patternParts = pattern.split('/')
  const pathParts = pathname.split('/')
  
  if (patternParts.length !== pathParts.length) return false
  
  return patternParts.every((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return true // Dynamic segment matches anything
    }
    return part === pathParts[index]
  })
}

/**
 * Generates title from path segments when no config exists
 */
export const generateTitleFromPath = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) return "Beranda"
  if (segments[0] !== "dashboard") return titleCase(segments[segments.length - 1])
  
  // For dashboard routes, use the last meaningful segment
  const lastSegment = segments[segments.length - 1]
  return titleCase(lastSegment.replace(/-/g, ' '))
}

/**
 * Converts kebab-case or snake_case to Title Case
 */
export const titleCase = (str: string): string => {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
}

// ================================
// Breadcrumb Generation Functions
// ================================

/**
 * Generates breadcrumbs based on pathname
 */
export const generateBreadcrumbs = (
  pathname: string, 
  customBreadcrumbs?: BreadcrumbItem[]
): BreadcrumbItem[] => {
  // Return custom breadcrumbs if provided
  if (customBreadcrumbs) return customBreadcrumbs
  
  // Check exact match first
  const exactConfig = PAGE_CONFIGS[pathname]
  if (exactConfig?.breadcrumbs) return exactConfig.breadcrumbs
  
  // Check dynamic routes
  const dynamicConfig = findDynamicRouteConfig(pathname)
  if (dynamicConfig?.breadcrumbs) {
    return interpolateDynamicBreadcrumbs(dynamicConfig.breadcrumbs, pathname)
  }
  
  // Generate breadcrumbs from path
  return generateBreadcrumbsFromPath(pathname)
}

/**
 * Interpolates dynamic values in breadcrumbs
 */
export const interpolateDynamicBreadcrumbs = (
  breadcrumbs: BreadcrumbItem[],
  pathname: string
): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  return breadcrumbs.map(crumb => {
    // Replace [id] with actual ID from path
    if (crumb.label.includes('[') && crumb.label.includes(']')) {
      const dynamicValue = pathSegments[pathSegments.length - 1]
      return {
        ...crumb,
        label: crumb.label.replace(/\[.*?\]/g, dynamicValue)
      }
    }
    return crumb
  })
}

/**
 * Generates breadcrumbs from pathname when no config exists
 */
export const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  // Always start with dashboard for dashboard routes
  if (segments[0] === 'dashboard') {
    breadcrumbs.push({
      label: 'Dasbor',
      href: '/dashboard',
      isActive: segments.length === 1
    })
    
    // Add subsequent segments
    for (let i = 1; i < segments.length; i++) {
      const href = '/' + segments.slice(0, i + 1).join('/')
      const isActive = i === segments.length - 1
      
      breadcrumbs.push({
        label: titleCase(segments[i]),
        href: isActive ? undefined : href,
        isActive
      })
    }
  } else {
    // For non-dashboard routes
    breadcrumbs.push({
      label: titleCase(segments[segments.length - 1] || 'Home'),
      isActive: true
    })
  }
  
  return breadcrumbs
}

// ================================
// Title Formatting Functions
// ================================

/**
 * Formats title for display with length constraints
 */
export const formatTitleForDisplay = (
  title: string, 
  maxLength: number = 50,
  ellipsis: boolean = true
): string => {
  if (title.length <= maxLength) return title
  
  if (ellipsis) {
    return `${title.substring(0, maxLength - 3)}...`
  }
  
  return title.substring(0, maxLength)
}

/**
 * Creates SEO-friendly title
 */
export const createSEOTitle = (
  pageTitle: string, 
  siteTitle: string = "SPPG System"
): string => {
  if (pageTitle === siteTitle) return siteTitle
  return `${pageTitle} - ${siteTitle}`
}

/**
 * Extracts page type from pathname
 */
export const getPageType = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) return 'home'
  if (segments[0] === 'dashboard') {
    if (segments.length === 1) return 'dashboard'
    return segments[1]
  }
  
  return segments[0]
}

// ================================
// Route Analysis Functions
// ================================

/**
 * Gets route depth (number of path segments)
 */
export const getRouteDepth = (pathname: string): number => {
  return pathname.split('/').filter(Boolean).length
}

/**
 * Checks if route is a detail page (typically contains ID)
 */
export const isDetailPage = (pathname: string): boolean => {
  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  
  // Check if last segment looks like an ID (UUID, number, etc.)
  return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(lastSegment) ||
         /^\d+$/.test(lastSegment) ||
         segments.length > 2
}

/**
 * Gets parent route from current pathname
 */
export const getParentRoute = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length <= 1) return '/'
  
  return '/' + segments.slice(0, -1).join('/')
}

/**
 * Extracts route parameters from dynamic route
 */
export const extractRouteParams = (pattern: string, pathname: string): Record<string, string> => {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)
  const params: Record<string, string> = {}
  
  patternParts.forEach((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const paramName = part.slice(1, -1)
      params[paramName] = pathParts[index] || ''
    }
  })
  
  return params
}

// ================================
// Navigation Helpers
// ================================

/**
 * Builds navigation URL with proper base path
 */
export const buildNavigationUrl = (path: string, basePath: string = ""): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
  
  return `${cleanBasePath}${cleanPath}`
}

/**
 * Checks if two paths are related (one is ancestor of other)
 */
export const arePathsRelated = (path1: string, path2: string): boolean => {
  const segments1 = path1.split('/').filter(Boolean)
  const segments2 = path2.split('/').filter(Boolean)
  
  const minLength = Math.min(segments1.length, segments2.length)
  
  for (let i = 0; i < minLength; i++) {
    if (segments1[i] !== segments2[i]) return false
  }
  
  return true
}

// ================================
// Localization Helpers
// ================================

/**
 * Gets localized page title
 */
export const getLocalizedTitle = (
  pathname: string, 
  locale: string = 'id',
  fallback?: string
): string => {
  // For now, we only support Indonesian
  // This can be extended for multi-language support
  const title = generatePageTitle(pathname, fallback)
  
  // Future: Add translation logic here
  // const translations = getTranslations(locale)
  // return translations[title] || title
  
  return title
}

/**
 * Gets localized breadcrumbs
 */
export const getLocalizedBreadcrumbs = (
  pathname: string,
  locale: string = 'id'
): BreadcrumbItem[] => {
  const breadcrumbs = generateBreadcrumbs(pathname)
  
  // Future: Add translation logic here
  // return breadcrumbs.map(crumb => ({
  //   ...crumb,
  //   label: getTranslation(crumb.label, locale)
  // }))
  
  return breadcrumbs
}
