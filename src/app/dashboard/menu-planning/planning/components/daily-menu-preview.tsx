'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DailyMenuPreviewProps {
  menus: any[]
  isLoading: boolean
}

export function DailyMenuPreview({ menus, isLoading }: DailyMenuPreviewProps) {
  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      case 'LUNCH':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'DINNER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'SNACK':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  // Get today's menus
  const today = new Date().toDateString()
  const todayMenus = menus.filter(menu => 
    new Date(menu.menuDate).toDateString() === today
  ).slice(0, 3)

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Today's Menus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg border border-border animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-2"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-12"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">
          Today's Menus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayMenus.length > 0 ? (
          todayMenus.map((menu) => (
            <div key={menu.id} className="p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{menu.name}</h4>
                <Badge className={getMealTypeColor(menu.mealType)}>
                  {menu.mealType}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {menu.description || 'No description available'}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{menu.totalCalories ? `${Math.round(menu.totalCalories)} cal` : 'N/A cal'}</span>
                <Badge className={getStatusColor(menu.isActive ? 'PUBLISHED' : 'DRAFT')}>
                  {menu.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No menus scheduled for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
