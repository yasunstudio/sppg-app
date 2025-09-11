'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { usePermission } from '@/hooks/use-permission'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PermissionGuardProps {
  children: React.ReactNode
  permission: string | string[]
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
  
  const permissions = Array.isArray(permission) ? permission : [permission]
  const { hasAnyPermission, isLoading } = usePermission(permissions)

  useEffect(() => {
    if (status === 'loading' || isLoading) return

    if (!session && redirectTo) {
      router.push(redirectTo)
    }
  }, [session, status, redirectTo, router, isLoading])

  // Show loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Not authenticated
  if (!session) {
    return fallback || (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-4">
            Please sign in to access this content.
          </p>
          <Button onClick={() => router.push('/auth/login')}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  // No permission
  if (!hasAnyPermission(permissions)) {
    return fallback || (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this resource.
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Has permission - show content
  return <>{children}</>
}

// Re-export usePermission from hooks for backward compatibility
export { usePermission } from '@/hooks/use-permission'
