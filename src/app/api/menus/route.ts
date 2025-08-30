import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { z } from 'zod'

// prisma imported from lib

const MenuSchema = z.object({
  name: z.string().min(1, 'Menu name is required'),
  description: z.string().optional(),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  menuDate: z.string(),
  targetGroup: z.enum(['STUDENT', 'TEACHER', 'STAFF']).optional(),
  menuItems: z.array(z.object({
    name: z.string().min(1, 'Menu item name is required'),
    category: z.enum(['RICE', 'MAIN_DISH', 'VEGETABLE', 'FRUIT', 'BEVERAGE', 'SNACK']),
    servingSize: z.number().positive('Serving size must be positive'),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      rawMaterialId: z.string(),
      quantity: z.number().positive('Quantity must be positive'),
      unit: z.string()
    }))
  }))
})

// GET /api/menus - Get all menus with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mealType = searchParams.get('mealType')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {
      deletedAt: null
    }

    if (mealType && mealType !== 'ALL') {
      where.mealType = mealType
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    const menus = await prisma.menu.findMany({
      where,
      include: {
        menuItems: {
          include: {
            ingredients: {
              include: {
                rawMaterial: {
                  select: {
                    id: true,
                    name: true,
                    category: true,
                    unit: true
                  }
                }
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        productionPlans: {
          select: {
            id: true,
            status: true,
            planDate: true,
            targetPortions: true,
            actualStartTime: true,
            actualEndTime: true
          },
          orderBy: {
            planDate: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(menus)
  } catch (error) {
    console.error('Error fetching menus:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/menus - Create new menu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = MenuSchema.parse(body)

    // Calculate nutrition based on raw materials
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let totalFiber = 0

    // Get nutrition data for all raw materials used
    const allRawMaterialIds = validatedData.menuItems.flatMap(item => 
      item.ingredients.map(ing => ing.rawMaterialId)
    )
    
    const rawMaterials = await prisma.rawMaterial.findMany({
      where: {
        id: {
          in: allRawMaterialIds
        }
      }
    })

    // Calculate nutrition for each menu item
    for (const menuItem of validatedData.menuItems) {
      for (const ingredient of menuItem.ingredients) {
        const rawMaterial = rawMaterials.find(rm => rm.id === ingredient.rawMaterialId)
        if (rawMaterial) {
          // Calculate per 100g basis, adjust by quantity
          const quantityRatio = ingredient.quantity / 100
          totalCalories += (rawMaterial.caloriesPer100g || 0) * quantityRatio
          totalProtein += (rawMaterial.proteinPer100g || 0) * quantityRatio
          totalCarbs += (rawMaterial.carbsPer100g || 0) * quantityRatio
          totalFat += (rawMaterial.fatPer100g || 0) * quantityRatio
          totalFiber += (rawMaterial.fiberPer100g || 0) * quantityRatio
        }
      }
    }

    const nutrition = {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10, // Round to 1 decimal
      carbohydrates: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10
    }

    const menu = await prisma.menu.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        mealType: validatedData.mealType as any,
        menuDate: new Date(validatedData.menuDate),
        targetGroup: (validatedData.targetGroup as any) || 'STUDENT',
        createdById: "user1", // TODO: Get from session
        totalCalories: nutrition.calories,
        totalProtein: nutrition.protein,
        totalCarbs: nutrition.carbohydrates,
        totalFat: nutrition.fat,
        totalFiber: nutrition.fiber,
        menuItems: {
          create: validatedData.menuItems.map(menuItem => ({
            name: menuItem.name,
            category: menuItem.category as any,
            servingSize: menuItem.servingSize,
            description: menuItem.description,
            ingredients: {
              create: menuItem.ingredients.map(ingredient => ({
                rawMaterialId: ingredient.rawMaterialId,
                quantity: ingredient.quantity,
                unit: ingredient.unit
              }))
            }
          }))
        }
      },
      include: {
        menuItems: {
          include: {
            ingredients: {
              include: {
                rawMaterial: {
                  select: {
                    id: true,
                    name: true,
                    category: true,
                    unit: true
                  }
                }
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(menu, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating menu:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
