// Meal Type Constants and Utilities
export const MEAL_TYPES = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH', 
  DINNER: 'DINNER',
  SNACK: 'SNACK'
} as const

export const MEAL_TYPE_LABELS = {
  BREAKFAST: 'Sarapan',
  LUNCH: 'Makan Siang',
  DINNER: 'Makan Malam',
  SNACK: 'Snack'
} as const

export const MEAL_TYPE_COLORS = {
  BREAKFAST: 'bg-yellow-100 text-yellow-800',
  LUNCH: 'bg-blue-100 text-blue-800', 
  DINNER: 'bg-purple-100 text-purple-800',
  SNACK: 'bg-green-100 text-green-800'
} as const

export const MEAL_TYPE_LEGEND_COLORS = {
  BREAKFAST: 'bg-yellow-100 border-yellow-200',
  LUNCH: 'bg-blue-100 border-blue-200',
  DINNER: 'bg-purple-100 border-purple-200', 
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
