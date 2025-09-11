import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
import { z } from 'zod'

const menuSearchSchema = z.object({
  search: z.string().optional(),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']).optional(),
  isActive: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
})

export async function GET(request: NextRequest) {
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

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const params = menuSearchSchema.parse({
      search: searchParams.get('search') || undefined,
      mealType: searchParams.get('mealType') || undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
    })

    const page = parseInt(params.page || '1')
    const limit = parseInt(params.limit || '10')
    const offset = (page - 1) * limit

    const where: any = {
      deletedAt: null,
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    if (params.mealType) {
      where.mealType = params.mealType
    }

    if (params.isActive !== undefined) {
      where.isActive = params.isActive
    }

    if (params.dateFrom || params.dateTo) {
      where.menuDate = {}
      if (params.dateFrom) {
        where.menuDate.gte = new Date(params.dateFrom)
      }
      if (params.dateTo) {
        where.menuDate.lte = new Date(params.dateTo)
      }
    }

    const [menus, total] = await Promise.all([
      prisma.menu.findMany({
        where,
        include: {
          menuItems: {
            include: {
              ingredients: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          recipes: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { menuDate: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.menu.count({ where }),
    ])

    return NextResponse.json({
      data: menus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching menus:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'menuPlanning:create'
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

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const menuData = z.object({
      name: z.string().min(1, 'Name is required'),
      description: z.string().optional(),
      menuDate: z.string().transform((str) => new Date(str)),
      mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
      targetGroup: z.enum(['STUDENT', 'PREGNANT_WOMAN', 'LACTATING_MOTHER', 'TODDLER', 'ELDERLY']).default('STUDENT'),
      isActive: z.boolean().default(true),
      totalCalories: z.number().optional(),
      totalProtein: z.number().optional(),
      totalFat: z.number().optional(),
      totalCarbs: z.number().optional(),
      totalFiber: z.number().optional(),
      menuItems: z.array(z.object({
        name: z.string(),
        category: z.enum(['RICE', 'MAIN_DISH', 'VEGETABLE', 'FRUIT', 'BEVERAGE', 'SNACK']),
        servingSize: z.number(),
        description: z.string().optional(),
      })).optional(),
    }).parse(body)

    const menu = await prisma.menu.create({
      data: {
        ...menuData,
        createdById: session.user.id,
        menuItems: menuData.menuItems ? {
          create: menuData.menuItems,
        } : undefined,
      },
      include: {
        menuItems: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(menu, { status: 201 })
  } catch (error) {
    console.error('Error creating menu:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
