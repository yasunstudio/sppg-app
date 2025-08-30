import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock KPI data
    const kpiData = {
      totalUsers: 150,
      activeUsers: 120,
      totalOrders: 450,
      revenue: 125000
    }

    return NextResponse.json(kpiData)
  } catch (error) {
    console.error("[KPI_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}