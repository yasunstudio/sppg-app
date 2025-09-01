// ============================================================================
// DYNAMIC PERMISSION MANAGER (src/lib/permissions/dynamic-permissions.ts)
// ============================================================================

export interface PermissionMap {
  [permission: string]: string[]
}

export interface ValidationResult {
  isValid: boolean
  mismatches: PermissionMismatch[]
}

export interface PermissionMismatch {
  permission: string
  fileRoles: string[]
  dbRoles: string[]
  type: 'missing_in_file' | 'missing_in_db' | 'role_mismatch'
}

class PermissionManager {
  private static instance: PermissionManager
  private permissions: PermissionMap = {}
  private lastUpdate = 0
  private readonly CACHE_TTL = 60000 // 1 minute cache
  private isLoading = false

  static getInstance(): PermissionManager {
    if (!this.instance) {
      this.instance = new PermissionManager()
    }
    return this.instance
  }

  /**
   * Get permissions from database with caching
   */
  async getPermissions(): Promise<PermissionMap> {
    const now = Date.now()
    
    // Return cached if still valid
    if (now - this.lastUpdate < this.CACHE_TTL && Object.keys(this.permissions).length > 0) {
      return this.permissions
    }

    // Prevent multiple concurrent loads
    if (this.isLoading) {
      await this.waitForLoad()
      return this.permissions
    }

    await this.refreshPermissions()
    return this.permissions
  }

  /**
   * Force refresh permissions from database
   */
  async forceRefresh(): Promise<void> {
    await this.refreshPermissions()
  }

  /**
   * Refresh permissions from database via API
   */
  private async refreshPermissions(): Promise<void> {
    this.isLoading = true
    
    try {
      const response = await fetch('/api/permissions?all=true')
      if (!response.ok) {
        throw new Error('Failed to fetch permissions')
      }
      
      const result = await response.json()
      
      if (result.success && result.data) {
        // Assuming the API returns a permission map structure
        this.permissions = result.data
        this.lastUpdate = Date.now()
        
        console.log('✅ Permissions refreshed from API', {
          permissionCount: Object.keys(result.data).length,
          timestamp: new Date().toISOString()
        })
      } else {
        throw new Error('Invalid permissions response')
      }
    } catch (error) {
      console.error('❌ Failed to refresh permissions from API:', error)
      
      // Fallback to static permissions if API fails
      const { PERMISSIONS } = await import('../permissions')
      this.permissions = PERMISSIONS
      
      // Set shorter TTL for fallback to retry soon
      this.lastUpdate = Date.now() - (this.CACHE_TTL - 10000)
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Wait for ongoing load to complete
   */
  private async waitForLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkLoading = () => {
        if (!this.isLoading) {
          resolve()
        } else {
          setTimeout(checkLoading, 100)
        }
      }
      checkLoading()
    })
  }

  /**
   * Check if role has permission
   */
  async hasPermission(roleName: string, permission: string): Promise<boolean> {
    const permissions = await this.getPermissions()
    return permissions[permission]?.includes(roleName) ?? false
  }

  /**
   * Check if role has any of the permissions
   */
  async hasAnyPermission(roleName: string, requiredPermissions: string[]): Promise<boolean> {
    const permissions = await this.getPermissions()
    return requiredPermissions.some(permission => 
      permissions[permission]?.includes(roleName) ?? false
    )
  }

  /**
   * Check if role has all permissions
   */
  async hasAllPermissions(roleName: string, requiredPermissions: string[]): Promise<boolean> {
    const permissions = await this.getPermissions()
    return requiredPermissions.every(permission => 
      permissions[permission]?.includes(roleName) ?? false
    )
  }

  /**
   * Validate permissions against static file
   */
  async validateAgainstStatic(): Promise<ValidationResult> {
    try {
      const { PERMISSIONS: staticPermissions } = await import('../permissions')
      const dynamicPermissions = await this.getPermissions()
      
      const mismatches: PermissionMismatch[] = []
      const allPermissions = new Set([
        ...Object.keys(staticPermissions),
        ...Object.keys(dynamicPermissions)
      ])

      allPermissions.forEach(permission => {
        const fileRoles = (staticPermissions as any)[permission] || []
        const dbRoles = dynamicPermissions[permission] || []
        
        const fileSet = new Set(fileRoles as string[])
        const dbSet = new Set(dbRoles)
        
        // Check for mismatches
        const areEqual = fileSet.size === dbSet.size && 
          [...fileSet].every((role: string) => dbSet.has(role))
        
        if (!areEqual) {
          let type: PermissionMismatch['type'] = 'role_mismatch'
          
          if (fileRoles.length === 0) {
            type = 'missing_in_file'
          } else if (dbRoles.length === 0) {
            type = 'missing_in_db'
          }
          
          mismatches.push({
            permission,
            fileRoles: fileRoles as string[],
            dbRoles,
            type
          })
        }
      })

      return {
        isValid: mismatches.length === 0,
        mismatches
      }
    } catch (error) {
      console.error('Failed to validate permissions:', error)
      return {
        isValid: false,
        mismatches: []
      }
    }
  }

  /**
   * Get permission statistics
   */
  async getStats(): Promise<{
    totalPermissions: number
    totalRoles: number
    lastUpdate: Date
    cacheAge: number
  }> {
    const permissions = await this.getPermissions()
    const roles = new Set()
    
    Object.values(permissions).forEach(roleList => {
      roleList.forEach(role => roles.add(role))
    })

    return {
      totalPermissions: Object.keys(permissions).length,
      totalRoles: roles.size,
      lastUpdate: new Date(this.lastUpdate),
      cacheAge: Date.now() - this.lastUpdate
    }
  }
}

// Export singleton instance
export const permissionManager = PermissionManager.getInstance()

// Convenience functions
export const getDynamicPermissions = () => permissionManager.getPermissions()
export const hasPermission = (role: string, permission: string) => 
  permissionManager.hasPermission(role, permission)
export const hasAnyPermission = (role: string, permissions: string[]) => 
  permissionManager.hasAnyPermission(role, permissions)
export const hasAllPermissions = (role: string, permissions: string[]) => 
  permissionManager.hasAllPermissions(role, permissions)
export const refreshPermissions = () => permissionManager.forceRefresh()
export const validatePermissions = () => permissionManager.validateAgainstStatic()
