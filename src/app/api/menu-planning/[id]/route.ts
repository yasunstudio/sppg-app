import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for updating menu
const updateMenuSchema = z.object({
  name: z.string().min(1, 'Menu name is required'),
  description: z.string().optional(),
  menuDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  targetGroup: z.enum(['STUDENT', 'PREGNANT_WOMAN', 'LACTATING_MOTHER', 'TODDLER', 'ELDERLY']),
  totalCalories: z.number().optional(),
  totalProtein: z.number().optional(),
  totalFat: z.number().optional(),
  totalCarbs: z.number().optional(),
  totalFiber: z.number().optional(),
  isActive: z.boolean().default(true),
  menuItems: z.array(z.object({
    id: z.string().optional(), // For existing items
    name: z.string().min(1),
    category: z.enum(['RICE', 'MAIN_DISH', 'VEGETABLE', 'FRUIT', 'BEVERAGE', 'SNACK']),
    servingSize: z.number().positive(),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      id: z.string().optional(), // For existing ingredients
      rawMaterialId: z.string(),
      quantity: z.number().positive()
    }))
  }))
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Uncomment when auth is implemented
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { id: menuId } = await params

    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
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
        }
      }
    })

    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 })
    }

    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Uncomment when auth is implemented
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { id: menuId } = await params
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateMenuSchema.parse(body)

    // Update menu with transaction
    const updatedMenu = await prisma.$transaction(async (tx) => {
      // Update menu basic info
      const menu = await tx.menu.update({
        where: { id: menuId },
        data: {
          name: validatedData.name,
          description: validatedData.description,
          menuDate: new Date(validatedData.menuDate),
          mealType: validatedData.mealType,
          targetGroup: validatedData.targetGroup,
          totalCalories: validatedData.totalCalories,
          totalProtein: validatedData.totalProtein,
          totalFat: validatedData.totalFat,
          totalCarbs: validatedData.totalCarbs,
          totalFiber: validatedData.totalFiber,
          isActive: validatedData.isActive,
          updatedAt: new Date()
        }
      })

      // Delete existing menu items and their ingredients
      await tx.menuItemIngredient.deleteMany({
        where: {
          menuItem: {
            menuId: menuId
          }
        }
      })
      
      await tx.menuItem.deleteMany({
        where: { menuId: menuId }
      })

      // Create new menu items
      for (const item of validatedData.menuItems) {
        const menuItem = await tx.menuItem.create({
          data: {
            name: item.name,
            category: item.category,
            servingSize: item.servingSize,
            description: item.description,
            menuId: menuId
          }
        })

        // Create ingredients for this menu item
        for (const ingredient of item.ingredients) {
          await tx.menuItemIngredient.create({
            data: {
              menuItemId: menuItem.id,
              rawMaterialId: ingredient.rawMaterialId,
              quantity: ingredient.quantity
            }
          })
        }
      }

      return menu
    })

    return NextResponse.json(updatedMenu)
  } catch (error) {
    console.error('Error updating menu:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Uncomment when auth is implemented
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { id: menuId } = await params

    // Delete menu and related data with cascade
    await prisma.$transaction(async (tx) => {
      // Delete menu item ingredients first
      await tx.menuItemIngredient.deleteMany({
        where: {
          menuItem: {
            menuId: menuId
          }
        }
      })
      
      // Delete menu items
      await tx.menuItem.deleteMany({
        where: { menuId: menuId }
      })
      
      // Delete menu
      await tx.menu.delete({
        where: { id: menuId }
      })
    })

    return NextResponse.json({ message: 'Menu deleted successfully' })
  } catch (error) {
    console.error('Error deleting menu:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
