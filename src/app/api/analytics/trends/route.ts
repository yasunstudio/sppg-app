import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock trends data
    const trendsData = {
      userGrowth: [
        { date: "2024-01", value: 100 },
        { date: "2024-02", value: 120 },
        { date: "2024-03", value: 150 }
      ],
      revenueGrowth: [
        { date: "2024-01", value: 50000 },
        { date: "2024-02", value: 75000 },
        { date: "2024-03", value: 125000 }
      ]
    }

    return NextResponse.json(trendsData)
  } catch (error) {
    console.error("[TRENDS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}