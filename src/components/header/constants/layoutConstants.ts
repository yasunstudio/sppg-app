/**
 * 🏗️ Layout Constants - Layout and positioning constants
 * @fileoverview Constants for layout positioning and sizing
 */

// ================================
// Layout Dimensions
// ================================

export const LAYOUT_DIMENSIONS = {
  SIDEBAR_WIDTH: {
    COLLAPSED: 60,
    EXPANDED: 260,
  },
  HEADER_HEIGHT: {
    DEFAULT: 64,
    COMPACT: 48,
  },
  CONTENT_PADDING: {
    MOBILE: 16,
    TABLET: 24,
    DESKTOP: 32,
  },
} as const

// ================================
// Spacing Constants
// ================================

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const

// ================================
// Border Radius
// ================================

export const BORDER_RADIUS = {
  NONE: 0,
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  FULL: 9999,
} as const

// ================================
// Shadow Levels
// ================================

export const SHADOWS = {
  NONE: "none",
  SM: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  MD: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  LG: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  XL: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const

// ================================
// Z-Index Scale
// ================================

export const Z_INDEX = {
  BACKGROUND: -1,
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  OVERLAY: 30,
  MODAL: 40,
  POPOVER: 50,
  TOOLTIP: 60,
  TOAST: 70,
} as const

// ================================
// Grid System
// ================================

export const GRID = {
  COLUMNS: 12,
  GUTTER: {
    MOBILE: 16,
    TABLET: 24,
    DESKTOP: 32,
  },
  CONTAINER: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },
} as const

// ================================
// Transition Durations
// ================================

export const TRANSITION_DURATION = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  SLOWER: 500,
} as const
