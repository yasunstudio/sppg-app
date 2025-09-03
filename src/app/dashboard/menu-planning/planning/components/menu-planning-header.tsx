'use client'

import { Button } from '@/components/ui/button'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function MenuPlanningHeader() {
  const router = useRouter()

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Perencanaan Menu
        </h1>
        <p className="text-muted-foreground">
          Kelola dan rencanakan menu harian untuk program SPPG
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          className="bg-card/80 dark:bg-card/80 border-border hover:bg-muted backdrop-blur-sm transition-all duration-200"
          onClick={() => router.push('/dashboard/menu-planning/planning?view=calendar')}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Lihat Kalender
        </Button>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => router.push('/dashboard/menu-planning/create')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Menu Baru
        </Button>
      </div>
    </div>
  )
}
