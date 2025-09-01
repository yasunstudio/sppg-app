'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import { MenuDetail } from '../types/menu-edit-types'
import { Skeleton } from '@/components/ui/skeleton'

interface MenuEditHeaderProps {
  menu?: MenuDetail
  isLoading: boolean
}

export function MenuEditHeader({ menu, isLoading }: MenuEditHeaderProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-start space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center space-x-2 hover:bg-muted transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-xl">
                <Edit className="w-6 h-6 text-primary-foreground" />
              </div>
              <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-start space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center space-x-2 hover:bg-muted transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center space-x-3 text-foreground">
              <div className="p-2 bg-destructive rounded-xl">
                <Edit className="w-6 h-6 text-destructive-foreground" />
              </div>
              <span>Menu Not Found</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              The menu you're trying to edit could not be found
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div className="flex items-start space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="flex items-center space-x-2 hover:bg-muted transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center space-x-3 text-foreground">
            <div className="p-2 bg-primary rounded-xl">
              <Edit className="w-6 h-6 text-primary-foreground" />
            </div>
            <span>Edit Menu</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Edit nutritious menus for the SPPG program with proper nutritional guidelines
          </p>
        </div>
      </div>
    </div>
  )
}
