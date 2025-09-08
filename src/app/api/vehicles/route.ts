import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const isActive = searchParams.get("isActive")
    const type = searchParams.get("type")

    // Build where clause
    const where: any = {
      ...(isActive !== null && { isActive: isActive === "true" }),
      ...(type && { type }),
      deletedAt: null
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          _count: {
            select: {
              distributions: true,
              deliveries: true
            }
          }
        },
        orderBy: { plateNumber: "asc" },
        take: limit,
        skip: offset
      }),
      prisma.vehicle.count({ where })
    ])

    // Calculate stats
    const allVehicles = await prisma.vehicle.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: {
            distributions: true,
            deliveries: true
          }
        }
      }
    })

    const stats = {
      totalVehicles: allVehicles.length,
      activeVehicles: allVehicles.filter(v => v.isActive).length,
      inactiveVehicles: allVehicles.filter(v => !v.isActive).length,
      totalCapacity: allVehicles.reduce((sum, v) => sum + v.capacity, 0),
      averageCapacity: allVehicles.length > 0 ? Math.round(allVehicles.reduce((sum, v) => sum + v.capacity, 0) / allVehicles.length) : 0,
      totalDeliveries: allVehicles.reduce((sum, v) => sum + (v._count?.deliveries || 0), 0),
      vehicleTypeBreakdown: Object.entries(
        allVehicles.reduce((acc: Record<string, number>, vehicle) => {
          acc[vehicle.type] = (acc[vehicle.type] || 0) + 1
          return acc
        }, {})
      ).map(([type, count]) => ({
        type,
        count,
        percentage: parseFloat(((count / allVehicles.length) * 100).toFixed(1))
      }))
    }

    return NextResponse.json({
      success: true,
      data: vehicles,
      stats,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        hasMore: offset + limit < total,
        itemsPerPage: limit
      }
    })

  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch vehicles",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      plateNumber,
      type,
      capacity,
      brand,
      model,
      year,
      fuelType,
      status,
      lastService,
      nextService,
      mileage,
      insuranceExpiry,
      registrationExpiry,
      notes
    } = body

    // Validate required fields
    if (!plateNumber || !type || !capacity || !brand || !model || !year || !fuelType) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: plateNumber, type, capacity, brand, model, year, fuelType"
        },
        { status: 400 }
      )
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber: plateNumber.toUpperCase().trim(),
        type,
        capacity: parseInt(capacity),
        brand,
        model,
        year: parseInt(year),
        fuelType,
        status: status || 'ACTIVE',
        lastService: lastService ? new Date(lastService) : null,
        nextService: nextService ? new Date(nextService) : null,
        mileage: mileage ? parseFloat(mileage) : null,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        registrationExpiry: registrationExpiry ? new Date(registrationExpiry) : null,
        notes: notes || null,
        isActive: status !== 'RETIRED' && status !== 'INACTIVE' // Set legacy field based on status
      }
    })

    return NextResponse.json({
      success: true,
      data: vehicle,
      message: "Vehicle created successfully"
    })

  } catch (error) {
    console.error("Error creating vehicle:", error)
    
    // Handle duplicate plate number
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Plate number already exists",
          details: "A vehicle with this plate number is already registered"
        },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create vehicle",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
