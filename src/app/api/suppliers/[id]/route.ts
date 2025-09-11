import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

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

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            purchaseOrders: true,
            inventory: true,
          }
        },
        purchaseOrders: {
          select: {
            id: true,
            poNumber: true,
            orderDate: true,
            expectedDelivery: true,
            status: true,
            totalAmount: true,
          },
          orderBy: { orderDate: 'desc' },
          take: 5,
        },
        inventory: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            expiryDate: true,
            qualityStatus: true,
            rawMaterial: {
              select: {
                name: true,
                category: true,
                unit: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }
      }
    })

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: supplier
    })
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch supplier' },
      { status: 500 }
    )
  }
}

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
      'suppliers:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }


    const { id } = await params
    const body = await request.json()
    const { name, contactName, phone, email, address, isActive } = body

    // Validate required fields
    if (!name || !contactName || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'Name, contact name, phone, and address are required' },
        { status: 400 }
      )
    }

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id }
    })

    if (!existingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Check if another supplier with the same name exists (excluding current supplier)
    const duplicateSupplier = await prisma.supplier.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        id: { not: id }
      }
    })

    if (duplicateSupplier) {
      return NextResponse.json(
        { success: false, error: 'Another supplier with this name already exists' },
        { status: 400 }
      )
    }

    // Update supplier
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        contactName,
        phone,
        email: email || null,
        address,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        _count: {
          select: {
            purchaseOrders: true,
            inventory: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: supplier,
      message: 'Supplier updated successfully'
    })
  } catch (error) {
    console.error('Error updating supplier:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update supplier' },
      { status: 500 }
    )
  }
}

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
      'suppliers:delete'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }


    const { id } = await params

    // Check if supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            purchaseOrders: true,
            inventory: true,
          }
        }
      }
    })

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Check if supplier has related records
    if (supplier._count.purchaseOrders > 0 || supplier._count.inventory > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete supplier with existing purchase orders or inventory items. Please deactivate instead.' 
        },
        { status: 400 }
      )
    }

    // Delete supplier
    await prisma.supplier.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete supplier' },
      { status: 500 }
    )
  }
}
