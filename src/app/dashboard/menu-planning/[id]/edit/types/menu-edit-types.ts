import { z } from 'zod'

// Schema validation for editing existing menu
export const menuEditSchema = z.object({
  name: z.string().min(1, 'Menu name is required'),
  description: z.string().optional(),
  menuDate: z.string().min(1, 'Menu date is required'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  targetGroup: z.enum(['STUDENT', 'PREGNANT_WOMAN', 'LACTATING_MOTHER', 'TODDLER', 'ELDERLY']),
  totalCalories: z.number().optional(),
  totalProtein: z.number().optional(),
  totalFat: z.number().optional(),
  totalCarbs: z.number().optional(),
  totalFiber: z.number().optional(),
  isActive: z.boolean(),
  menuItems: z.array(z.object({
    id: z.string().optional(), // Include ID for existing items
    name: z.string().min(1, 'Menu item name is required'),
    category: z.enum(['RICE', 'MAIN_DISH', 'VEGETABLE', 'FRUIT', 'BEVERAGE', 'SNACK']),
    servingSize: z.number().min(1, 'Serving size must be at least 1'),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      id: z.string().optional(), // Include ID for existing ingredients
      rawMaterialId: z.string(),
      quantity: z.number().min(0.1, 'Quantity must be at least 0.1'),
    })).optional()
  })).optional()
})

export type MenuEditFormData = z.infer<typeof menuEditSchema>

// API Response Types
export interface MenuDetail {
  id: string
  name: string
  description?: string
  menuDate: string
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'
  targetGroup: 'STUDENT' | 'PREGNANT_WOMAN' | 'LACTATING_MOTHER' | 'TODDLER' | 'ELDERLY'
  totalCalories?: number
  totalProtein?: number
  totalFat?: number
  totalCarbs?: number
  totalFiber?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  menuItems: MenuItemDetail[]
  createdBy: {
    id: string
    name: string
  }
}

export interface MenuItemDetail {
  id: string
  name: string
  category: 'RICE' | 'MAIN_DISH' | 'VEGETABLE' | 'FRUIT' | 'BEVERAGE' | 'SNACK'
  servingSize: number
  description?: string
  ingredients: MenuIngredientDetail[]
}

export interface MenuIngredientDetail {
  id: string
  rawMaterialId: string
  quantity: number
  rawMaterial: {
    id: string
    name: string
    category: string
    unit: string
    costPerUnit: number
    supplier?: {
      id: string
      name: string
    }
  }
}

export interface RawMaterial {
  id: string
  name: string
  category: string
  unit: string
  costPerUnit: number
  supplier?: {
    id: string
    name: string
  }
}

export interface MenuUpdateRequest {
  name: string
  description?: string
  menuDate: string
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'
  targetGroup: 'STUDENT' | 'PREGNANT_WOMAN' | 'LACTATING_MOTHER' | 'TODDLER' | 'ELDERLY'
  totalCalories?: number
  totalProtein?: number
  totalFat?: number
  totalCarbs?: number
  totalFiber?: number
  isActive: boolean
  menuItems?: {
    id?: string
    name: string
    category: 'RICE' | 'MAIN_DISH' | 'VEGETABLE' | 'FRUIT' | 'BEVERAGE' | 'SNACK'
    servingSize: number
    description?: string
    ingredients?: {
      id?: string
      rawMaterialId: string
      quantity: number
    }[]
  }[]
}
