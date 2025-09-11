import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { vehicleUpdateSchema } from "@/app/dashboard/vehicles/components/utils/vehicle-schemas"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

interface RouteParams {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
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

    const vehicle = await prisma.vehicle.findUnique({
      where: { 
        id,
        deletedAt: null 
      },
      include: {
        _count: {
          select: {
            distributions: true,
            deliveries: true
          }
        }
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Kendaraan tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: vehicle
    })

  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal memuat detail kendaraan",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'vehicles:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }


    const { id } = await params
    const body = await request.json()
    
    const {
      plateNumber,
      type,
      capacity,
      isActive,
      lastService,
      notes
    } = body

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { 
        id,
        deletedAt: null 
      }
    })

    if (!existingVehicle) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Kendaraan tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    // Check if plate number is already taken by another vehicle
    if (plateNumber && plateNumber !== existingVehicle.plateNumber) {
      const plateExists = await prisma.vehicle.findFirst({
        where: {
          plateNumber,
          id: { not: id },
          deletedAt: null
        }
      })

      if (plateExists) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Nomor plat sudah digunakan oleh kendaraan lain" 
          },
          { status: 400 }
        )
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        plateNumber,
        type,
        capacity,
        isActive,
        lastService: lastService ? new Date(lastService) : null,
        notes
      },
      include: {
        _count: {
          select: {
            distributions: true,
            deliveries: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: vehicle
    })

  } catch (error) {
    console.error("Error updating vehicle:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal memperbarui kendaraan",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'vehicles:delete'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }


    const { id } = await params

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { 
        id,
        deletedAt: null 
      }
    })

    if (!existingVehicle) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Kendaraan tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    // Check if vehicle is being used in distributions or deliveries
    const distributionCount = await prisma.distribution.count({
      where: { vehicleId: id }
    })

    const deliveryCount = await prisma.delivery.count({
      where: { vehicleId: id }
    })

    if (distributionCount > 0 || deliveryCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Kendaraan tidak dapat dihapus karena masih digunakan dalam distribusi atau pengiriman" 
        },
        { status: 400 }
      )
    }

    // Soft delete the vehicle
    await prisma.vehicle.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Kendaraan berhasil dihapus"
    })

  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal menghapus kendaraan",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// Update vehicle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'vehicles:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }


    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validatedData = vehicleUpdateSchema.parse(body)

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { 
        id,
        deletedAt: null 
      }
    })

    if (!existingVehicle) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Kendaraan tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    // Check for duplicate plate number (if plate number is being updated)
    if (validatedData.plateNumber && validatedData.plateNumber !== existingVehicle.plateNumber) {
      const duplicatePlate = await prisma.vehicle.findFirst({
        where: {
          plateNumber: validatedData.plateNumber,
          deletedAt: null,
          id: { not: id }
        }
      })

      if (duplicatePlate) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Nomor plat sudah digunakan kendaraan lain" 
          },
          { status: 400 }
        )
      }
    }

    // Update vehicle data
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...validatedData,
        id: undefined, // Remove id from update data
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Kendaraan berhasil diperbarui",
      data: updatedVehicle
    })

  } catch (error: any) {
    console.error("Error updating vehicle:", error)
    
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Data tidak valid",
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal memperbarui kendaraan",
        details: error.message || "Unknown error"
      },
      { status: 500 }
    )
  }
}
