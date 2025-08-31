# Production Permission Management Strategy

## 🚨 Critical Issue: Permission Sync Problems

### Problem Scenario
```
Database State: ✅ SUPER_ADMIN has 'quality.check' permission
File State:     ❌ permissions.ts excludes SUPER_ADMIN from 'quality.check'
Result:         🔴 UI hidden but API accessible (Security Gap!)
```

## 🛡️ Production-Safe Solutions

### 1. **Dynamic Permission Loading (Recommended)**

Instead of static file permissions, load permissions from database:

```typescript
// ❌ CURRENT: Static file-based
export const PERMISSIONS = {
  'quality.check': ['CHEF', 'NUTRITIONIST', 'QUALITY_CONTROL']
}

// ✅ BETTER: Dynamic database-driven
export async function getPermissions(): Promise<PermissionMap> {
  const roles = await prisma.role.findMany()
  const permissionMap: PermissionMap = {}
  
  roles.forEach(role => {
    role.permissions.forEach(permission => {
      if (!permissionMap[permission]) {
        permissionMap[permission] = []
      }
      permissionMap[permission].push(role.name)
    })
  })
  
  return permissionMap
}
```

### 2. **Permission Validation Middleware**

```typescript
// Validate file vs database permissions on startup
export async function validatePermissionSync() {
  const filePermissions = PERMISSIONS
  const dbPermissions = await getPermissions()
  
  const mismatches = []
  
  Object.keys(filePermissions).forEach(permission => {
    const fileRoles = new Set(filePermissions[permission])
    const dbRoles = new Set(dbPermissions[permission] || [])
    
    if (!setsEqual(fileRoles, dbRoles)) {
      mismatches.push({
        permission,
        fileRoles: Array.from(fileRoles),
        dbRoles: Array.from(dbRoles)
      })
    }
  })
  
  if (mismatches.length > 0) {
    console.error('🚨 PERMISSION MISMATCH DETECTED:', mismatches)
    // In production: send alert, log to monitoring
  }
}
```

### 3. **Hot Reload Permission System**

```typescript
class PermissionManager {
  private static instance: PermissionManager
  private permissions: PermissionMap = {}
  private lastUpdate = 0
  private readonly CACHE_TTL = 60000 // 1 minute
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new PermissionManager()
    }
    return this.instance
  }
  
  async getPermissions(): Promise<PermissionMap> {
    const now = Date.now()
    if (now - this.lastUpdate > this.CACHE_TTL) {
      await this.refreshPermissions()
    }
    return this.permissions
  }
  
  private async refreshPermissions() {
    try {
      this.permissions = await getPermissions()
      this.lastUpdate = Date.now()
    } catch (error) {
      console.error('Failed to refresh permissions:', error)
      // Fallback to file-based permissions
      this.permissions = PERMISSIONS
    }
  }
  
  // Force refresh (useful for admin actions)
  async forceRefresh() {
    await this.refreshPermissions()
  }
}
```

## 🔄 **Migration Strategy for Existing Production**

### Phase 1: Add Validation (Non-Breaking)
```typescript
// Add to existing system without breaking changes
export function usePermissionWithValidation(permission: string) {
  const fileBasedResult = usePermission(permission) // existing
  
  // Add validation in background
  useEffect(() => {
    validatePermissionInBackground(permission)
  }, [permission])
  
  return fileBasedResult
}

async function validatePermissionInBackground(permission: string) {
  try {
    const dbPermissions = await fetch('/api/permissions/validate', {
      method: 'POST',
      body: JSON.stringify({ permission })
    })
    // Log mismatches for monitoring
  } catch (error) {
    // Silent fail - don't break UI
  }
}
```

### Phase 2: Gradual Migration
```typescript
// Feature flag for permission source
const USE_DYNAMIC_PERMISSIONS = process.env.USE_DYNAMIC_PERMISSIONS === 'true'

export function usePermission(permission: string) {
  if (USE_DYNAMIC_PERMISSIONS) {
    return useDynamicPermission(permission)
  }
  return useStaticPermission(permission)
}
```

### Phase 3: Full Dynamic System
```typescript
// Replace static permissions entirely
export const usePermission = useDynamicPermission
```

## 🛠️ **Immediate Production Fixes**

### Option A: Database Update (Fastest)
```sql
-- Quick fix: Update database to match file
UPDATE roles 
SET permissions = array_remove(permissions, 'quality.check')
WHERE name = 'SUPER_ADMIN';
```

### Option B: Hot Deploy (Safest)
```typescript
// Deploy permission file fix
'quality.check': ['CHEF', 'NUTRITIONIST', 'QUALITY_CONTROL', 'SUPER_ADMIN']
```

### Option C: Runtime Override (Emergency)
```typescript
// Emergency permission override
if (process.env.NODE_ENV === 'production') {
  PERMISSIONS['quality.check'].push('SUPER_ADMIN')
}
```

## 📊 **Monitoring & Alerting**

```typescript
// Add to monitoring system
export function trackPermissionMismatch(permission: string, expected: string[], actual: string[]) {
  // Send to logging service
  console.error('Permission mismatch:', {
    permission,
    expected,
    actual,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
  
  // Send alert to team
  if (process.env.NODE_ENV === 'production') {
    sendSlackAlert(`🚨 Permission mismatch detected: ${permission}`)
  }
}
```

## 🎯 **Best Practices for Production**

1. **Single Source of Truth**: Use database as primary source
2. **Validation on Startup**: Check sync on app start
3. **Monitoring**: Track permission mismatches  
4. **Feature Flags**: Enable gradual rollout
5. **Rollback Strategy**: Keep file-based as fallback
6. **Automated Tests**: Test permission sync in CI/CD

## 🔒 **Security Considerations**

- Never trust client-side permission checks for security
- Always validate permissions on server-side
- Log all permission changes for audit
- Use principle of least privilege
- Regular permission audits
