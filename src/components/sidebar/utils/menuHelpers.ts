import type { MenuItem } from "../types/sidebar.types"

/**
 * Filters menu items based on a predicate function
 */
export const filterMenuItemsByPredicate = (items: MenuItem[], predicate?: (item: MenuItem) => boolean): MenuItem[] => {
  if (!predicate) return items
  return items.filter(predicate)
}

/**
 * Updates the current state of menu items based on pathname
 */
export const updateMenuItemsCurrentState = (items: MenuItem[], pathname: string): MenuItem[] => {
  return items.map(item => ({
    ...item,
    current: pathname === item.href || pathname.startsWith(item.href + "/")
  }))
}

/**
 * Finds the first menu item that matches the current pathname
 */
export const findCurrentMenuItem = (items: MenuItem[], pathname: string): MenuItem | null => {
  return items.find(item => 
    pathname === item.href || pathname.startsWith(item.href + "/")
  ) || null
}

/**
 * Checks if any menu item in a list is currently active
 */
export const hasAnyActiveMenuItem = (items: MenuItem[]): boolean => {
  return items.some(item => item.current)
}

/**
 * Groups menu items by their category or type
 */
export const groupMenuItemsByCategory = (items: MenuItem[]): Record<string, MenuItem[]> => {
  return items.reduce((groups, item) => {
    // Extract category from href (e.g., /dashboard/production -> production)
    const pathParts = item.href.split('/')
    const category = pathParts[2] || 'dashboard'
    
    if (!groups[category]) {
      groups[category] = []
    }
    
    groups[category].push(item)
    return groups
  }, {} as Record<string, MenuItem[]>)
}

/**
 * Filters menu items based on a search query
 */
export const filterMenuItems = (items: MenuItem[], query: string): MenuItem[] => {
  const lowercaseQuery = query.toLowerCase()
  
  return items.filter(item =>
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.href.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Sorts menu items alphabetically by name
 */
export const sortMenuItemsByName = (items: MenuItem[]): MenuItem[] => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Gets the breadcrumb path for a menu item
 */
export const getMenuItemBreadcrumb = (item: MenuItem): string[] => {
  const pathParts = item.href.split('/').filter(Boolean)
  return pathParts.slice(1) // Remove 'dashboard' prefix
}

/**
 * Validates if a menu item href is properly formatted
 */
export const isValidMenuItemHref = (href: string): boolean => {
  return href.startsWith('/dashboard/') && href.length > '/dashboard/'.length
}

/**
 * Creates a flattened list of all menu items from nested structure
 */
export const flattenMenuItems = (sections: { items: MenuItem[] }[]): MenuItem[] => {
  return sections.reduce((flat, section) => {
    return flat.concat(section.items)
  }, [] as MenuItem[])
}

/**
 * Finds parent menu section for a given menu item
 */
export const findParentSection = (
  menuItem: MenuItem, 
  sections: { title: string; items: MenuItem[] }[]
): { title: string; items: MenuItem[] } | null => {
  return sections.find(section => 
    section.items.some(item => item.href === menuItem.href)
  ) || null
}

/**
 * Gets menu item by href
 */
export const getMenuItemByHref = (href: string, sections: { items: MenuItem[] }[]): MenuItem | null => {
  const allItems = flattenMenuItems(sections)
  return allItems.find(item => item.href === href) || null
}
