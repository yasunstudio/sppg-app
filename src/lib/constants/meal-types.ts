// Meal Type Constants and Utilities
// This file is now deprecated - use src/lib/constants.ts and src/lib/constants/utils.ts instead

import { MEAL_TYPE } from '@/lib/constants'

// Legacy exports for backward compatibility
export const MEAL_TYPES = MEAL_TYPE

export const MEAL_TYPE_LABELS = {
  BREAKFAST: 'Sarapan',
  LUNCH: 'Makan Siang',
  DINNER: 'Makan Malam',
  SNACK: 'Camilan',
} as const

export const MEAL_TYPE_COLORS = {
  BREAKFAST: 'bg-yellow-100 text-yellow-800',
  LUNCH: 'bg-orange-100 text-orange-800', 
  DINNER: 'bg-blue-100 text-blue-800',
  SNACK: 'bg-green-100 text-green-800',
} as const

export const MEAL_TYPE_LEGEND_COLORS = {
  BREAKFAST: 'bg-yellow-100 border-yellow-200',
  LUNCH: 'bg-orange-100 border-orange-200',
  DINNER: 'bg-blue-100 border-blue-200', 
  SNACK: 'bg-green-100 border-green-200'
} as const

export const getMealTypeLabel = (mealType: string) => {
  return MEAL_TYPE_LABELS[mealType as keyof typeof MEAL_TYPE_LABELS] || mealType
}

export const getMealTypeColor = (mealType: string) => {
  return MEAL_TYPE_COLORS[mealType as keyof typeof MEAL_TYPE_COLORS] || 'bg-gray-100 text-gray-800'
}

export const getMealTypeLegendColor = (mealType: string) => {
  return MEAL_TYPE_LEGEND_COLORS[mealType as keyof typeof MEAL_TYPE_LEGEND_COLORS] || 'bg-gray-100 border-gray-200'
}

export type MealType = keyof typeof MEAL_TYPES
