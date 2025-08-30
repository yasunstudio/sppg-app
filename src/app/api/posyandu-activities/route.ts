import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    // Get total count for pagination
    const totalActivities = await prisma.posyanduActivity.count()

    // Get paginated activities with posyandu details
    const activities = await prisma.posyanduActivity.findMany({
      skip,
      take: limit,
      include: {
        posyandu: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    })

    // Calculate summary statistics
    const completedActivities = await prisma.posyanduActivity.count({
      where: { status: 'COMPLETED' },
    })

    const ongoingActivities = await prisma.posyanduActivity.count({
      where: { status: 'IN_PROGRESS' },
    })

    const totalParticipants = await prisma.posyanduActivity.aggregate({
      _sum: {
        participantCount: true,
      },
    })

    const summary = {
      totalActivities,
      completedActivities,
      ongoingActivities,
      totalParticipants: totalParticipants._sum?.participantCount || 0,
    }

    // Transform data to match frontend expectations
    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      title: activity.activityName,
      description: activity.description,
      activityType: activity.activityType,
      date: activity.scheduledDate.toISOString(),
      startTime: activity.scheduledDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      endTime: activity.duration ? 
        new Date(activity.scheduledDate.getTime() + activity.duration * 60000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) :
        '',
      location: 'Posyandu ' + activity.posyandu.name,
      targetParticipants: activity.targetParticipants || 0,
      actualParticipants: activity.participantCount || 0,
      status: activity.status,
      posyandu: activity.posyandu,
      organizer: 'Kader Posyandu',
      notes: activity.notes,
      createdAt: activity.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      data: transformedActivities,
      pagination: {
        total: totalActivities,
        page,
        limit,
        totalPages: Math.ceil(totalActivities / limit),
      },
      summary,
    })
  } catch (error) {
    console.error('Error fetching posyandu activities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posyandu activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const activity = await prisma.posyanduActivity.create({
      data: {
        activityName: body.title,
        description: body.description,
        activityType: body.activityType,
        scheduledDate: new Date(body.date),
        duration: body.duration,
        targetParticipants: body.targetParticipants,
        participantCount: body.actualParticipants || 0,
        status: body.status || 'PLANNED',
        posyanduId: body.posyanduId,
        notes: body.notes,
      },
      include: {
        posyandu: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: activity,
    })
  } catch (error) {
    console.error('Error creating posyandu activity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create posyandu activity' },
      { status: 500 }
    )
  }
}