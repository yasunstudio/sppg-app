// ============================================================================
// CONSTANTS (src/lib/constants.ts)
// ============================================================================

export const NUTRITION_TARGETS = {
  STUDENT: {
    CALORIES: 900, // kcal per meal
    PROTEIN: 15,   // grams
    FAT: 20,       // grams
    CARBS: 135,    // grams
    FIBER: 11,     // grams
  },
  PREGNANT_WOMAN: {
    CALORIES: 1200,
    PROTEIN: 25,
    FAT: 30,
    CARBS: 180,
    FIBER: 14,
  },
  LACTATING_MOTHER: {
    CALORIES: 1300,
    PROTEIN: 30,
    FAT: 35,
    CARBS: 195,
    FIBER: 16,
  },
  TODDLER: {
    CALORIES: 500,
    PROTEIN: 8,
    FAT: 15,
    CARBS: 75,
    FIBER: 6,
  },
  ELDERLY: {
    CALORIES: 800,
    PROTEIN: 20,
    FAT: 25,
    CARBS: 120,
    FIBER: 10,
  },
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 1000,
} as const

// Status constants for various entities
export const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const

// Gender constants
export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const

// Participant types for Posyandu
export const PARTICIPANT_TYPE = {
  PREGNANT_WOMAN: 'PREGNANT_WOMAN',
  LACTATING_MOTHER: 'LACTATING_MOTHER',
  TODDLER: 'TODDLER',
  CHILD: 'CHILD',
  ELDERLY: 'ELDERLY',
} as const

// Nutritional status categories
export const NUTRITION_STATUS = {
  NORMAL: 'NORMAL',
  UNDERWEIGHT: 'UNDERWEIGHT',
  OVERWEIGHT: 'OVERWEIGHT',
  OBESE: 'OBESE',
  STUNTED: 'STUNTED',
  WASTED: 'WASTED',
  SEVERELY_UNDERWEIGHT: 'SEVERELY_UNDERWEIGHT',
} as const

// Menu meal types
export const MEAL_TYPE = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
  SNACK: 'SNACK',
} as const

// Production status
export const PRODUCTION_STATUS = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD',
} as const

// Distribution status
export const DISTRIBUTION_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
} as const

// Quality control status
export const QC_STATUS = {
  PASS: 'PASS',
  FAIL: 'FAIL',
  PENDING: 'PENDING',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED',
} as const

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

// API Response constants
export const API_RESPONSE = {
  SUCCESS: 'success',
  ERROR: 'error',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  VALIDATION_ERROR: 'validation_error',
} as const

// Date format constants
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm',
} as const

// Type definitions for better TypeScript support
export type ParticipantType = typeof PARTICIPANT_TYPE[keyof typeof PARTICIPANT_TYPE]
export type NutritionStatus = typeof NUTRITION_STATUS[keyof typeof NUTRITION_STATUS]
export type MealType = typeof MEAL_TYPE[keyof typeof MEAL_TYPE]
export type Gender = typeof GENDER[keyof typeof GENDER]
export type Status = typeof STATUS[keyof typeof STATUS]
export type ProductionStatus = typeof PRODUCTION_STATUS[keyof typeof PRODUCTION_STATUS]
export type DistributionStatus = typeof DISTRIBUTION_STATUS[keyof typeof DISTRIBUTION_STATUS]
export type QCStatus = typeof QC_STATUS[keyof typeof QC_STATUS]
