// Consistent spacing system for raw materials pages
export const SPACING = {
  // Container spacing
  page: {
    mobile: 'p-4',
    tablet: 'p-6', 
    desktop: 'p-8'
  },
  
  // Section spacing
  section: {
    mobile: 'space-y-4',
    tablet: 'space-y-6',
    desktop: 'space-y-8'
  },
  
  // Component spacing
  component: {
    mobile: 'space-y-3',
    tablet: 'space-y-4',
    desktop: 'space-y-6'
  },
  
  // Card spacing
  card: {
    padding: {
      mobile: 'p-4',
      tablet: 'p-6',
      desktop: 'p-6'
    },
    header: {
      mobile: 'pb-2',
      tablet: 'pb-3',
      desktop: 'pb-4'
    },
    content: {
      mobile: 'pt-0 space-y-3',
      tablet: 'pt-0 space-y-4',
      desktop: 'pt-0 space-y-4'
    }
  },
  
  // Grid spacing
  grid: {
    gap: {
      mobile: 'gap-3',
      tablet: 'gap-4',
      desktop: 'gap-6'
    }
  },
  
  // Form spacing
  form: {
    fieldset: {
      mobile: 'space-y-3',
      tablet: 'space-y-4',
      desktop: 'space-y-6'
    },
    field: {
      mobile: 'space-y-2',
      tablet: 'space-y-2',
      desktop: 'space-y-3'
    }
  },
  
  // Header spacing
  header: {
    container: {
      mobile: 'mb-4',
      tablet: 'mb-6',
      desktop: 'mb-8'
    },
    title: {
      mobile: 'mb-2',
      tablet: 'mb-3',
      desktop: 'mb-4'
    }
  }
} as const

// Responsive spacing utility function
export function getResponsiveSpacing(
  category: keyof typeof SPACING,
  type: string,
  isMobile: boolean,
  isTablet: boolean,
  isDesktop: boolean
): string {
  const spacingCategory = SPACING[category] as any
  const spacingType = spacingCategory[type] as any
  
  if (!spacingType) return ''
  
  if (isMobile) return spacingType.mobile || ''
  if (isTablet) return spacingType.tablet || ''
  if (isDesktop) return spacingType.desktop || ''
  
  return spacingType.desktop || ''
}

// Predefined responsive class combinations
export const RESPONSIVE_SPACING = {
  // Page container
  pageContainer: 'p-4 md:p-6 lg:p-8',
  
  // Section container
  sectionContainer: 'space-y-4 md:space-y-6 lg:space-y-8',
  
  // Component container
  componentContainer: 'space-y-3 md:space-y-4 lg:space-y-6',
  
  // Card spacing
  cardPadding: 'p-4 md:p-6',
  cardHeader: 'pb-2 md:pb-3 lg:pb-4',
  cardContent: 'pt-0 space-y-3 md:space-y-4',
  
  // Grid spacing
  gridGap: 'gap-3 md:gap-4 lg:gap-6',
  
  // Form spacing
  formFieldset: 'space-y-3 md:space-y-4 lg:space-y-6',
  filterContainer: 'gap-4 space-y-4 md:space-y-0',
  inputContainer: 'space-y-2',
  
  // Header spacing
  headerContainer: 'mb-4 md:mb-6 lg:mb-8',
  headerTitle: 'mb-2 md:mb-3 lg:mb-4',
  
  // Form spacing
  formField: 'space-y-2 md:space-y-3',
  
  // Button spacing
  buttonGroup: 'gap-2 md:gap-3',
  buttonContainer: 'pt-3 md:pt-4',
  
  // Table spacing
  tableContainer: 'py-4 md:py-6',
  tablePadding: 'px-4 md:px-6',
  
  // Stats spacing
  statsGrid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6',
  cardGrid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6',
  
  // Modal/Dialog spacing
  modalContent: 'p-4 md:p-6 space-y-4 md:space-y-6'
} as const

// Spacing validation utility
export function validateSpacing(spacing: string): boolean {
  const validSpacingPattern = /^(p|m|space|gap)-\d+$/
  return validSpacingPattern.test(spacing) || spacing.includes('md:') || spacing.includes('lg:')
}

// Common layout patterns
export const LAYOUT_PATTERNS = {
  // Full page layout
  fullPage: 'min-h-screen bg-gray-50 dark:bg-gray-900',
  
  // Container layout
  container: 'container mx-auto p-4 md:p-6 lg:p-8 space-y-6',
  
  // Card layout
  card: 'shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
  
  // Header section
  headerSection: 'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4',
  
  // Content section
  contentSection: 'space-y-4 md:space-y-6',
  
  // Action section
  actionSection: 'flex flex-col sm:flex-row gap-2',
} as const
