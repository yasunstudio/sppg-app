import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// GET /api/raw-materials/[id] - Get single raw material
export async function GET(
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
      'resource:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params

    const rawMaterial = await prisma.rawMaterial.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        inventory: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            supplier: {
              select: { name: true }
            },
            expiryDate: true,
            batchNumber: true
          },
          orderBy: { createdAt: 'desc' }
        },
        menuItems: {
          select: {
            id: true,
            quantity: true,
            menuItem: {
              select: { name: true }
            }
          }
        },
        purchaseOrderItems: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            purchaseOrder: {
              select: {
                poNumber: true,
                orderDate: true
              }
            }
          }
        }
      }
    })

    if (!rawMaterial) {
      return NextResponse.json(
        { success: false, error: 'Raw material not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: rawMaterial,
      message: 'Raw material fetched successfully'
    })

  } catch (error) {
    console.error('Error fetching raw material:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/raw-materials/[id] - Update raw material
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
      'rawMaterials:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params
    const body = await request.json()
    
    const {
      name,
      category,
      unit,
      description,
      caloriesPer100g,
      proteinPer100g,
      fatPer100g,
      carbsPer100g,
      fiberPer100g
    } = body

    // Validate required fields
    if (!name || !category || !unit) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and unit are required' },
        { status: 400 }
      )
    }

    // Check if raw material exists
    const existingMaterial = await prisma.rawMaterial.findFirst({
      where: {
        id,
        deletedAt: null
      }
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { success: false, error: 'Raw material not found' },
        { status: 404 }
      )
    }

    // Check if another raw material with same name exists (excluding current one)
    const duplicateCheck = await prisma.rawMaterial.findFirst({
      where: {
        name: { equals: name.trim(), mode: 'insensitive' },
        id: { not: id },
        deletedAt: null
      }
    })

    if (duplicateCheck) {
      return NextResponse.json(
        { success: false, error: 'Raw material with this name already exists' },
        { status: 409 }
      )
    }

    // Update raw material
    const updatedMaterial = await prisma.rawMaterial.update({
      where: { id },
      data: {
        name: name.trim(),
        category,
        unit,
        description: description?.trim() || null,
        caloriesPer100g,
        proteinPer100g,
        fatPer100g,
        carbsPer100g,
        fiberPer100g
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedMaterial,
      message: 'Raw material updated successfully'
    })

  } catch (error) {
    console.error('Error updating raw material:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/raw-materials/[id] - Delete raw material (soft delete)
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
      'rawMaterials:delete'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params

    // Check if raw material exists
    const existingMaterial = await prisma.rawMaterial.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        inventory: true,
        menuItems: true,
        purchaseOrderItems: true
      }
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { success: false, error: 'Raw material not found' },
        { status: 404 }
      )
    }

    // Check if raw material is being used
    const isInUse = existingMaterial.inventory.length > 0 || 
                   existingMaterial.menuItems.length > 0 || 
                   existingMaterial.purchaseOrderItems.length > 0

    if (isInUse) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete raw material as it is being used in inventory, menu items, or purchase orders' 
        },
        { status: 409 }
      )
    }

    // Soft delete the raw material
    await prisma.rawMaterial.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Raw material deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting raw material:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
