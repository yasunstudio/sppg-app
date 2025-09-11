// ============================================================================
// QUALITY STANDARDS API ROUTE (src/app/api/quality-standards/route.ts)
// Enhanced with Database-Driven Permission System
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// GET: Fetch quality standards
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'quality.view')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const category = searchParams.get('category')

    const whereCondition: any = {}
    
    if (active === 'true') {
      whereCondition.isActive = true
    } else if (active === 'false') {
      whereCondition.isActive = false
    }

    if (category) {
      whereCondition.category = category
    }

    const qualityStandards = await prisma.qualityStandard.findMany({
      where: whereCondition,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: qualityStandards
    })

  } catch (error) {
    console.error('Error in GET /api/quality-standards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quality standards' },
      { status: 500 }
    )
  }
}

// POST: Create new quality standard
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'quality.create')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      category, 
      targetValue, 
      unit,
      isActive = true
    } = body

    if (!name || !category || targetValue === undefined) {
      return NextResponse.json(
        { error: 'Name, category, and targetValue are required' },
        { status: 400 }
      )
    }

    const qualityStandard = await prisma.qualityStandard.create({
      data: {
        name,
        description: description || '',
        category,
        targetValue: parseFloat(targetValue),
        unit: unit || '',
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: qualityStandard,
      message: 'Quality standard created successfully'
    })

  } catch (error) {
    console.error('Error in POST /api/quality-standards:', error)
    return NextResponse.json(
      { error: 'Failed to create quality standard' },
      { status: 500 }
    )
  }
}

// PUT: Update quality standard
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'quality.update')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      id,
      name, 
      description, 
      category, 
      targetValue, 
      currentValue,
      unit,
      isActive
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Quality standard ID is required' },
        { status: 400 }
      )
    }

    const existingStandard = await prisma.qualityStandard.findUnique({
      where: { id }
    })

    if (!existingStandard) {
      return NextResponse.json(
        { error: 'Quality standard not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (targetValue !== undefined) updateData.targetValue = parseFloat(targetValue)
    if (currentValue !== undefined) updateData.currentValue = currentValue ? parseFloat(currentValue) : null
    if (unit !== undefined) updateData.unit = unit
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedStandard = await prisma.qualityStandard.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: updatedStandard,
      message: 'Quality standard updated successfully'
    })

  } catch (error) {
    console.error('Error in PUT /api/quality-standards:', error)
    return NextResponse.json(
      { error: 'Failed to update quality standard' },
      { status: 500 }
    )
  }
}

// DELETE: Delete quality standard
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'quality.delete')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Quality standard ID is required' },
        { status: 400 }
      )
    }

    const existingStandard = await prisma.qualityStandard.findUnique({
      where: { id }
    })

    if (!existingStandard) {
      return NextResponse.json(
        { error: 'Quality standard not found' },
        { status: 404 }
      )
    }

    await prisma.qualityStandard.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Quality standard deleted successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/quality-standards:', error)
    return NextResponse.json(
      { error: 'Failed to delete quality standard' },
      { status: 500 }
    )
  }
}
