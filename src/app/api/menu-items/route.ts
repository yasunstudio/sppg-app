import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';

// prisma imported from lib;

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        menu: {
          select: {
            name: true,
            menuDate: true,
            mealType: true
          }
        },
        ingredients: {
          include: {
            rawMaterial: {
              select: {
                name: true,
                unit: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: menuItems,
      count: menuItems.length
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { menuId, name, category, servingSize, description, ingredients } = body;

    // Create menu item with ingredients in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const menuItem = await tx.menuItem.create({
        data: {
          menuId,
          name,
          category,
          servingSize,
          description
        }
      });

      // Add ingredients if provided
      if (ingredients && ingredients.length > 0) {
        await tx.menuItemIngredient.createMany({
          data: ingredients.map((ingredient: any) => ({
            menuItemId: menuItem.id,
            rawMaterialId: ingredient.rawMaterialId,
            quantity: ingredient.quantity
          }))
        });
      }

      return menuItem;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Menu item created successfully'
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
