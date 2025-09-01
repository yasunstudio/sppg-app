'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DailyMenuPreview } from './daily-menu-preview'

interface MenuCalendarViewProps {
  menus: any[]
  isLoading: boolean
  error: any
}

export function MenuCalendarView({ menus, isLoading, error }: MenuCalendarViewProps) {
  if (error) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="p-8 text-center">
          <p className="text-destructive">Failed to load calendar data</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Menu Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 bg-muted/30 rounded-lg border border-border text-center">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-medium text-foreground mb-2">Interactive Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Interactive calendar will be displayed here to manage daily menu schedules
            </p>
            <Button variant="outline" className="mt-4 border-border hover:bg-muted">
              View Calendar Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Menu Preview */}
      <DailyMenuPreview 
        menus={menus}
        isLoading={isLoading}
      />
    </div>
  )
}
