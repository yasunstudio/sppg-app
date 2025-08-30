import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/distribution/optimize-routes - Optimize distribution routes
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      distributionDate,
      vehicleId,
      schoolIds,
      driverPreference,
      priorityLevel = "normal",
    } = body;

    if (!distributionDate || !schoolIds || schoolIds.length === 0) {
      return NextResponse.json(
        { error: "Distribution date and school IDs are required" },
        { status: 400 }
      );
    }

    // Get school information with coordinates
    const schools = await prisma.school.findMany({
      where: {
        id: { in: schoolIds },
      },
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        totalStudents: true,
      },
    });

    if (schools.length === 0) {
      return NextResponse.json(
        { error: "No schools found" },
        { status: 404 }
      );
    }

    // Get vehicle information if specified
    let vehicle = null;
    if (vehicleId) {
      vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        select: {
          id: true,
          plateNumber: true,
          type: true,
          capacity: true,
          isActive: true,
        },
      });
    }

    // Simple route optimization algorithm (can be enhanced with real routing services)
    const optimizedRoute = optimizeRouteSimple(schools, {
      priorityLevel,
      vehicleCapacity: vehicle?.capacity || 1000,
      driverPreference,
    });

    // Calculate estimated metrics
    const routeMetrics = calculateRouteMetrics(optimizedRoute, {
      baseDeliveryTime: 15, // minutes per school
      travelTimePerKm: 2, // minutes per km
      setupTime: 30, // initial setup time
    });

    // Create distribution plan
    const distributionPlan = await prisma.distribution.create({
      data: {
        distributionDate: new Date(distributionDate),
        vehicleId: vehicleId || null,
        driverId: null, // Will be assigned later
        status: "PREPARING",
        totalPortions: optimizedRoute.reduce((sum, stop) => sum + stop.estimatedMeals, 0),
        estimatedDuration: routeMetrics.totalTime,
        notes: `Optimized route for ${schools.length} schools`,
      },
    });

    // Create distribution schools for each school
    const distributionSchools = await Promise.all(
      optimizedRoute.map(async (routeStop, index) => {
        return prisma.distributionSchool.create({
          data: {
            distributionId: distributionPlan.id,
            schoolId: routeStop.school.id,
            plannedPortions: routeStop.estimatedMeals,
            routeOrder: index + 1,
          },
        });
      })
    );

    return NextResponse.json({
      distributionPlan: {
        ...distributionPlan,
        vehicle,
        schools: distributionSchools,
      },
      optimizedRoute: optimizedRoute.map((stop, index) => ({
        order: index + 1,
        school: stop.school,
        estimatedMeals: stop.estimatedMeals,
        estimatedArrival: stop.estimatedArrival,
        travelTime: stop.travelTime,
        cumulativeTime: stop.cumulativeTime,
        distance: stop.distance,
      })),
      metrics: routeMetrics,
      recommendations: generateRouteRecommendations(optimizedRoute, routeMetrics),
    }, { status: 201 });

  } catch (error) {
    console.error("Error optimizing distribution route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Simple route optimization function
function optimizeRouteSimple(schools: any[], options: any) {
  const { priorityLevel, vehicleCapacity, driverPreference } = options;
  
  // Start from depot (can be configurable)
  const depot = { latitude: -6.2088, longitude: 106.8456 }; // Jakarta center as default
  
  // Sort schools by priority and distance
  let sortedSchools = [...schools];
  
  if (priorityLevel === "distance") {
    // Sort by distance from depot
    sortedSchools.sort((a, b) => {
      const distA = calculateDistance(depot, { latitude: a.latitude, longitude: a.longitude });
      const distB = calculateDistance(depot, { latitude: b.latitude, longitude: b.longitude });
      return distA - distB;
    });
  } else if (priorityLevel === "student_count") {
    // Sort by student count (high priority first)
    sortedSchools.sort((a, b) => b.totalStudents - a.totalStudents);
  } else if (priorityLevel === "area") {
    // Group by area for efficiency (simplified)
    sortedSchools.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  // Calculate route with cumulative metrics
  let cumulativeTime = 30; // Setup time
  let cumulativeDistance = 0;
  let previousLocation = depot;
  
  return sortedSchools.map((school, index) => {
    const currentLocation = { latitude: school.latitude, longitude: school.longitude };
    const distance = calculateDistance(previousLocation, currentLocation);
    const travelTime = distance * 2; // 2 minutes per km
    const deliveryTime = 15; // 15 minutes per delivery
    
    cumulativeTime += travelTime + deliveryTime;
    cumulativeDistance += distance;
    
    const routeStop = {
      school,
      estimatedMeals: Math.ceil(school.totalStudents * 1.1), // 10% buffer
      estimatedArrival: `${Math.floor(cumulativeTime / 60)}:${String(cumulativeTime % 60).padStart(2, '0')}`,
      travelTime,
      cumulativeTime,
      distance: Math.round(distance * 100) / 100,
    };
    
    previousLocation = currentLocation;
    return routeStop;
  });
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(point1: any, point2: any): number {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate route metrics
function calculateRouteMetrics(route: any[], options: any) {
  const totalDistance = route.reduce((sum, stop) => sum + stop.distance, 0);
  const totalTime = route[route.length - 1]?.cumulativeTime || 0;
  const averageDeliveryTime = totalTime / route.length;
  
  return {
    totalDistance: Math.round(totalDistance * 100) / 100,
    totalTime,
    averageDeliveryTime: Math.round(averageDeliveryTime),
    estimatedFuelCost: Math.round(totalDistance * 1.5), // Rp 1500 per km
    efficiencyScore: Math.min(100, Math.round((route.length / totalTime) * 100)),
  };
}

// Generate route recommendations
function generateRouteRecommendations(route: any[], metrics: any) {
  const recommendations = [];
  
  if (metrics.totalTime > 480) { // More than 8 hours
    recommendations.push({
      type: "time_optimization",
      message: "Route duration exceeds 8 hours. Consider splitting into multiple routes.",
      priority: "HIGH",
    });
  }
  
  if (metrics.efficiencyScore < 50) {
    recommendations.push({
      type: "efficiency_improvement",
      message: "Route efficiency is low. Consider regrouping schools by district.",
      priority: "MEDIUM",
    });
  }
  
  if (route.length > 15) {
    recommendations.push({
      type: "load_optimization",
      message: "High number of stops. Verify vehicle capacity and driver workload.",
      priority: "MEDIUM",
    });
  }
  
  return recommendations;
}

// GET /api/distribution/optimize-routes - Get route optimization history
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [distributions, total] = await Promise.all([
      prisma.distribution.findMany({
        include: {
          vehicle: {
            select: {
              plateNumber: true,
              capacity: true,
            },
          },
          driver: {
            select: {
              name: true,
              phone: true,
            },
          },
          schools: {
            include: {
              school: {
                select: {
                  name: true,
                  address: true,
                },
              },
            },
          },
          _count: {
            select: {
              schools: true,
            },
          },
        },
        orderBy: { distributionDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.distribution.count(),
    ]);

    return NextResponse.json({
      distributions,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
      },
    });

  } catch (error) {
    console.error("Error fetching distribution routes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
