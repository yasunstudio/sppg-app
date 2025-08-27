import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get("type")
    const status = url.searchParams.get("status")
    const limit = parseInt(url.searchParams.get("limit") || "10")

    const where: any = {}
    if (type) where.type = type
    
    // Handle multiple statuses separated by comma
    if (status) {
      const statuses = status.split(',').map(s => s.trim())
      if (statuses.length === 1) {
        where.status = statuses[0]
      } else {
        where.status = { in: statuses }
      }
    }

    const productionResources = await prisma.productionResource.findMany({
      where,
      take: limit,
      orderBy: {
        name: "asc"
      },
      include: {
        usage: {
          where: {
            endTime: null // Active usage
          },
          select: {
            id: true,
            startTime: true,
            plannedDuration: true,
            batch: {
              select: {
                id: true,
                batchNumber: true,
                status: true
              }
            }
          }
        }
      }
    })

    // Calculate utilization for each resource
    const resourcesWithUtilization = productionResources.map(resource => {
      const activeUsage = resource.usage.length > 0
      const utilization = activeUsage ? Math.floor(Math.random() * 40 + 60) : 0 // Mock calculation
      
      return {
        ...resource,
        utilization,
        isActive: activeUsage
      }
    })

    return NextResponse.json({
      success: true,
      data: resourcesWithUtilization,
      total: resourcesWithUtilization.length
    })
  } catch (error) {
    console.error("Error fetching production resources:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch production resources" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      type,
      capacityPerHour,
      availabilitySchedule,
      maintenanceSchedule,
      location,
      specifications
    } = body

    const productionResource = await prisma.productionResource.create({
      data: {
        name,
        type,
        capacityPerHour,
        availabilitySchedule,
        maintenanceSchedule,
        location,
        specifications,
        status: "AVAILABLE"
      }
    })

    return NextResponse.json({
      success: true,
      data: productionResource
    })
  } catch (error) {
    console.error("Error creating production resource:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create production resource" },
      { status: 500 }
    )
  }
}
