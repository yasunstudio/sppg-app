'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, Settings, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { MenuDetail } from '../types/menu-edit-types'
import { MenuEditHeader } from './menu-edit-header'
import { MenuEditForm } from './menu-edit-form'
import { MenuEditGuidelines } from './menu-edit-guidelines'

export function MenuEditManagement() {
  const params = useParams()
  const menuId = params.id as string
  const [retryCount, setRetryCount] = useState(0)

  // Fetch menu details
  const {
    data: menu,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery<MenuDetail>({
    queryKey: ['menu-detail', menuId],
    queryFn: async () => {
      const response = await fetch(`/api/menu-planning/${menuId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Menu not found')
        }
        throw new Error('Failed to fetch menu details')
      }
      
      return response.json()
    },
    retry: (failureCount, error) => {
      if (error.message === 'Menu not found') {
        return false
      }
      return failureCount < 3
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000,   // 5 minutes
  })

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    refetch()
    toast.info('Retrying to fetch menu data...')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="h-8 w-8" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-[90px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading menu details...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium mb-1">Failed to load menu</p>
              <p className="text-sm">
                {error.message === 'Menu not found' 
                  ? 'The menu you are looking for does not exist or may have been deleted.'
                  : 'There was an error loading the menu details. Please try again.'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isRefetching}
              className="flex items-center space-x-1"
            >
              {isRefetching ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              <span>Retry</span>
            </Button>
          </AlertDescription>
        </Alert>

        {/* Debugging info for development */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Debug Information
                </span>
              </div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <p>Menu ID: {menuId}</p>
                <p>Retry Count: {retryCount}</p>
                <p>Error: {error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Success state - render the edit form
  if (!menu) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Menu data is not available. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <MenuEditHeader menu={menu} isLoading={isRefetching} />
      <MenuEditForm menu={menu} menuId={menuId} />
      <MenuEditGuidelines />
    </div>
  )
}
