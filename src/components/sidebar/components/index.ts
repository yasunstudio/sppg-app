// Main Sidebar Component
export { default as Sidebar } from "./Sidebar"

// Sidebar Components
export { SidebarHeader } from "./SidebarHeader"
export { SidebarMenuItem } from "./SidebarMenuItem"
export { default as SidebarNavSection } from "./SidebarNavSection"
export { SidebarExpandable } from "./SidebarExpandable"
export { SidebarMobile } from "./SidebarMobile"

// Re-export types for convenience
export type {
  MenuState,
  MenuPreferences,
  MenuItem,
  MenuSection,
  SidebarProps,
  SidebarContextType,
  MenuType,
  AnalyticsMetadata
} from "../types/sidebar.types"
