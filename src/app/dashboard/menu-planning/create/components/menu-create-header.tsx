'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'

export function MenuCreateHeader() {
  const router = useRouter()

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
              <Plus className="w-6 h-6 text-primary-foreground" />
            </div>
            <span>Create New Menu</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create nutritious menus for the SPPG program with proper nutritional guidelines
          </p>
        </div>
      </div>
    </div>
  )
}
