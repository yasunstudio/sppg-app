"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { isAdmin } from '@/lib/auth-utils'
import bcrypt from "bcryptjs"

export async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      roles: {
        include: {
          role: true
        }
      }
    }
  })

  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.avatar,
    role: user.roles[0]?.role.name || "USER",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }))
}

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true
        }
      }
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.avatar,
    role: user.roles[0]?.role.name || "USER",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

export async function createUser(formData: FormData) {
  try {
    const session = await auth()
    
    if (!session || !isAdmin(session)) {
      throw new Error("You are not authorized to perform this action")
    }

    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")
    const role = formData.get("role")

    if (!name || typeof name !== "string") throw new Error("Name is required")
    if (!email || typeof email !== "string") throw new Error("Email is required")
    if (!password || typeof password !== "string") throw new Error("Password is required")
    if (!role || (role !== "USER" && role !== "ADMIN")) throw new Error("Valid role is required")

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("A user with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create role if it doesn't exist
    const userRole = await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: {
        name: role,
        description: `${role} role`,
      },
    })

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          create: {
            role: {
              connect: {
                id: userRole.id,
              },
            },
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    revalidatePath("/users")
    return user
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Failed to create user")
  }
}

export async function updateUser(userId: string, formData: FormData) {
  try {
    const session = await auth()
    
    if (!session || !isAdmin(session)) {
      throw new Error("You are not authorized to perform this action")
    }

    const name = formData.get("name")
    const email = formData.get("email")
    const role = formData.get("role")
    const password = formData.get("password")

    if (!name || typeof name !== "string") throw new Error("Name is required")
    if (!email || typeof email !== "string") throw new Error("Email is required")
    if (!role || (role !== "USER" && role !== "ADMIN")) throw new Error("Valid role is required")

    // Check if email exists and belongs to another user
    const existingUser = await prisma.user.findUnique({
      where: { 
        email,
        NOT: {
          id: userId
        }
      },
    })

    if (existingUser) {
      throw new Error("A user with this email already exists")
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
    }

    // Only update password if provided
    if (password && typeof password === "string" && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Get or create role
    const userRole = await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: {
        name: role,
        description: `${role} role`,
      },
    })

    // Update user with new role
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        roles: {
          deleteMany: {},
          create: {
            role: {
              connect: {
                id: userRole.id,
              },
            },
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    revalidatePath("/users")
    return user
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Failed to update user")
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth()
    
    if (!session || !isAdmin(session)) {
      throw new Error("You are not authorized to perform this action")
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true
      }
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Delete user roles first
    await prisma.userRole.deleteMany({
      where: { userId }
    })

    // Then delete the user
    await prisma.user.delete({
      where: { id: userId }
    })

    revalidatePath("/users")
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Failed to delete user")
  }
}
