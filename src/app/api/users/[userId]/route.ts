import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/auth-utils"
import type { ApiUser, ApiUserUpdateInput } from "@/lib/types/api"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()

    if (!session || !isAdmin(session)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { userId } = await params
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user satisfies ApiUser)
  } catch (error) {
    console.error("[USER_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()

    if (!session || !isAdmin(session)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body: ApiUserUpdateInput = await request.json()
    const { name, email, role } = body
    const { userId } = await params

    // First delete existing roles
    await prisma.userRole.deleteMany({
      where: {
        userId: userId
      }
    })

    // Then update user and create new role
    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updateData,
        ...(role && {
          roles: {
            create: {
              role: {
                connect: {
                  name: role,
                },
              },
            },
          },
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user satisfies ApiUser)
  } catch (error) {
    console.error("[USER_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()

    if (!session || !isAdmin(session)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { userId } = await params
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[USER_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
