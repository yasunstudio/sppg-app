import { z } from 'zod'

// Schema validation
export const menuSchema = z.object({
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
    name: z.string().min(1, 'Menu item name is required'),
    category: z.enum(['RICE', 'MAIN_DISH', 'VEGETABLE', 'FRUIT', 'BEVERAGE', 'SNACK']),
    servingSize: z.number().min(1, 'Serving size must be at least 1'),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      rawMaterialId: z.string(),
      quantity: z.number().min(0.1, 'Quantity must be at least 0.1'),
    })).optional()
  })).optional()
})

export type MenuFormData = z.infer<typeof menuSchema>

// API Response Types
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

export interface MenuItem {
  name: string
  category: 'RICE' | 'MAIN_DISH' | 'VEGETABLE' | 'FRUIT' | 'BEVERAGE' | 'SNACK'
  servingSize: number
  description?: string
  ingredients?: {
    rawMaterialId: string
    quantity: number
  }[]
}

export interface MenuCreateRequest {
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
  menuItems?: MenuItem[]
}
