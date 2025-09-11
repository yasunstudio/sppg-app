import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// GET /api/items/[id] - Get single item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...item,
      supplierName: item.supplier?.name
    })
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    )
  }
}

// PUT /api/items/[id] - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'items:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await request.json()
    const {
      name,
      description,
      category,
      unit,
      unitPrice,
      allergens,
      shelfLife,
      storageRequirement,
      supplierId,
      isActive
    } = body

    // Validate required fields
    if (!name || !category || !unit) {
      return NextResponse.json(
        { error: "Name, category, and unit are required" },
        { status: 400 }
      )
    }

    const item = await prisma.item.update({
      where: { id },
      data: {
        name,
        description,
        category,
        unit,
        unitPrice: unitPrice ? parseFloat(unitPrice) : null,
        allergens: allergens || [],
        shelfLife: shelfLife ? parseInt(shelfLife) : null,
        storageRequirement,
        supplierId,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        supplierName: item.supplier?.name
      },
      message: 'Item updated successfully'
    })
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    )
  }
}

// DELETE /api/items/[id] - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'items:delete'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if item exists
    const existingItem = await prisma.item.findUnique({
      where: { id }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    // Check if item is used in recipes
    const recipeIngredients = await prisma.recipeIngredient.count({
      where: { itemId: id }
    })

    if (recipeIngredients > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete item that is used in recipes",
          details: `This item is used in ${recipeIngredients} recipe(s)`
        },
        { status: 400 }
      )
    }

    await prisma.item.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully'
    })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    )
  }
}

// PATCH /api/items/[id] - Toggle item status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'items:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await request.json()
    const { isActive } = body

    const item = await prisma.item.update({
      where: { id },
      data: { isActive },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        supplierName: item.supplier?.name
      },
      message: `Item ${isActive ? 'activated' : 'deactivated'} successfully`
    })
  } catch (error) {
    console.error("Error updating item status:", error)
    return NextResponse.json(
      { error: "Failed to update item status" },
      { status: 500 }
    )
  }
}
