'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { hasPermission, type Permission } from '@/lib/permissions'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PermissionGuardProps {
  children: React.ReactNode
  permission: Permission | Permission[]
  fallback?: React.ReactNode
  redirectTo?: string
}

export function PermissionGuard({ 
  children, 
  permission, 
  fallback,
  redirectTo 
}: PermissionGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    const userRoles = session.user.roles?.map((ur: any) => ur.role.name) || []
    
    // Check if user has required permission(s)
    const permissions = Array.isArray(permission) ? permission : [permission]
    const hasRequiredPermission = permissions.some(perm => hasPermission(userRoles, perm))
    
    setHasAccess(hasRequiredPermission)

    // Redirect if no access and redirect URL is provided
    if (!hasRequiredPermission && redirectTo) {
      router.push(redirectTo)
    }
  }, [session, status, permission, router, redirectTo])

  // Loading state
  if (status === 'loading' || hasAccess === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // No access
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Akses Ditolak</h2>
            <p className="text-muted-foreground mb-4">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span>Permission yang diperlukan: {Array.isArray(permission) ? permission.join(', ') : permission}</span>
            </div>
            <Button onClick={() => router.back()} variant="outline">
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

// Hook untuk mengecek permission dalam komponen
export function usePermission(permission: Permission | Permission[]) {
  const { data: session } = useSession()
  
  if (!session?.user) return false

  const userRoles = session.user.roles?.map((ur: any) => ur.role.name) || []
  const permissions = Array.isArray(permission) ? permission : [permission]
  
  return permissions.some(perm => hasPermission(userRoles, perm))
}

// Hook untuk mendapatkan semua permission user
export function useUserPermissions() {
  const { data: session } = useSession()
  
  if (!session?.user) return []

  const userRoles = session.user.roles?.map((ur: any) => ur.role.name) || []
  
  return userRoles
}
