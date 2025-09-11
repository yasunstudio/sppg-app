/**
 * Database Migration Script for Permission System
 * Migrates from hardcoded permissions to full database-driven system
 */

import { prisma } from "@/lib/prisma"
import { PERMISSION_TEMPLATES, ROLE_TEMPLATES } from "../templates/permission-templates"

export class PermissionMigration {
  
  /**
   * Run full migration: permissions + roles + assignments
   */
  static async runFullMigration(): Promise<void> {
    console.log('🚀 Starting Permission System Migration...')

    try {
      // Step 1: Create permission metadata
      console.log('📝 Creating permission metadata...')
      await this.createPermissions()

      // Step 2: Create or update roles with new permissions
      console.log('👤 Creating/updating roles...')
      await this.createRoles()

      // Step 3: Verify existing user assignments
      console.log('🔍 Verifying user role assignments...')
      await this.verifyUserAssignments()

      console.log('✅ Migration completed successfully!')
    } catch (error) {
      console.error('❌ Migration failed:', error)
      throw error
    }
  }

  /**
   * Create permission metadata in database
   */
  private static async createPermissions(): Promise<void> {
    for (const permTemplate of PERMISSION_TEMPLATES) {
      await prisma.permission.upsert({
        where: { name: permTemplate.name },
        update: {
          displayName: permTemplate.displayName,
          description: permTemplate.description,
          category: permTemplate.category,
          module: permTemplate.module,
          action: permTemplate.action,
          isSystemPerm: true,
          isActive: true,
          updatedAt: new Date()
        },
        create: {
          name: permTemplate.name,
          displayName: permTemplate.displayName,
          description: permTemplate.description,
          category: permTemplate.category,
          module: permTemplate.module,
          action: permTemplate.action,
          isSystemPerm: true,
          isActive: true
        }
      })
    }

    console.log(`✨ Created/updated ${PERMISSION_TEMPLATES.length} permissions`)
  }

  /**
   * Create or update roles with new permission structure
   */
  private static async createRoles(): Promise<void> {
    for (const roleTemplate of ROLE_TEMPLATES) {
      await prisma.role.upsert({
        where: { name: roleTemplate.name },
        update: {
          description: roleTemplate.description,
          permissions: roleTemplate.permissions,
          color: roleTemplate.color,
          priority: roleTemplate.priority,
          isSystemRole: roleTemplate.isSystemRole,
          isActive: true,
          metadata: roleTemplate.metadata as any,
          updatedAt: new Date()
        },
        create: {
          name: roleTemplate.name,
          description: roleTemplate.description,
          permissions: roleTemplate.permissions,
          color: roleTemplate.color,
          priority: roleTemplate.priority,
          isSystemRole: roleTemplate.isSystemRole,
          isActive: true,
          metadata: roleTemplate.metadata as any
        }
      })
    }

    console.log(`✨ Created/updated ${ROLE_TEMPLATES.length} roles`)
  }

  /**
   * Verify and report on existing user role assignments
   */
  private static async verifyUserAssignments(): Promise<void> {
    const userRoles = await prisma.userRole.findMany({
      include: {
        user: { select: { email: true, name: true } },
        role: { select: { name: true, permissions: true } }
      }
    })

    console.log(`📊 Found ${userRoles.length} user role assignments:`)
    
    const roleStats = userRoles.reduce((acc, ur) => {
      acc[ur.role.name] = (acc[ur.role.name] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(roleStats).forEach(([role, count]) => {
      console.log(`   • ${role}: ${count} users`)
    })

    // Check for any users without roles
    const usersWithoutRoles = await prisma.user.count({
      where: {
        roles: { none: {} },
        isActive: true
      }
    })

    if (usersWithoutRoles > 0) {
      console.log(`⚠️  Warning: ${usersWithoutRoles} active users have no role assignments`)
    }
  }

  /**
   * Rollback migration (for testing purposes)
   */
  static async rollback(): Promise<void> {
    console.log('🔄 Rolling back permission migration...')

    // Don't delete user assignments, just clean up metadata
    await prisma.permission.deleteMany({
      where: { isSystemPerm: true }
    })

    // Reset role permissions but keep roles
    await prisma.role.updateMany({
      data: { 
        permissions: [],
        metadata: {},
        updatedAt: new Date()
      }
    })

    console.log('✅ Rollback completed')
  }

  /**
   * Get migration status
   */
  static async getMigrationStatus(): Promise<{
    permissionsCreated: number
    rolesUpdated: number
    userAssignments: number
    readyForFullDatabaseMode: boolean
  }> {
    const permissionsCreated = await prisma.permission.count({
      where: { isSystemPerm: true }
    })

    const rolesWithPermissions = await prisma.role.count({
      where: { 
        permissions: { isEmpty: false },
        isActive: true
      }
    })

    const userAssignments = await prisma.userRole.count()

    const readyForFullDatabaseMode = (
      permissionsCreated >= PERMISSION_TEMPLATES.length &&
      rolesWithPermissions >= ROLE_TEMPLATES.length &&
      userAssignments > 0
    )

    return {
      permissionsCreated,
      rolesUpdated: rolesWithPermissions,
      userAssignments,
      readyForFullDatabaseMode
    }
  }

  /**
   * Create a test user with specific role for testing
   */
  static async createTestUser(
    email: string, 
    name: string, 
    roleName: string,
    password: string = 'test123'
  ): Promise<void> {
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)

    const role = await prisma.role.findUnique({
      where: { name: roleName }
    })

    if (!role) {
      throw new Error(`Role ${roleName} not found`)
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        email,
        name,
        password: hashedPassword,
        isActive: true
      }
    })

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        roleId: role.id
      }
    })

    console.log(`✅ Test user created: ${email} with role ${roleName}`)
  }
}
