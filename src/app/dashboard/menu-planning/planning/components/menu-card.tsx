'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Edit, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MenuCardProps {
  menu: {
    id: string
    name: string
    description?: string
    mealType: string
    targetGroup: string
    isActive: boolean
    menuDate: string
    totalCalories?: number
    totalProtein?: number
    totalCarbs?: number
    totalFat?: number
    createdBy: {
      name: string
    }
    menuItems: any[]
  }
}

export function MenuCard({ menu }: MenuCardProps) {
  const router = useRouter()

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

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {menu.name}
          </CardTitle>
          <Badge className={getStatusColor(menu.isActive)}>
            {menu.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {menu.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {menu.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <Badge className={getMealTypeColor(menu.mealType)}>
            {menu.mealType}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {formatDate(menu.menuDate)}
          </div>
        </div>

        {/* Nutrition Info */}
        {menu.totalCalories && (
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Calories:</span> {Math.round(menu.totalCalories)}
            </div>
            <div>
              <span className="font-medium">Protein:</span> {menu.totalProtein ? `${Math.round(menu.totalProtein)}g` : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Carbs:</span> {menu.totalCarbs ? `${Math.round(menu.totalCarbs)}g` : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Fat:</span> {menu.totalFat ? `${Math.round(menu.totalFat)}g` : 'N/A'}
            </div>
          </div>
        )}

        {/* Menu Items Count */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Items:</span> {menu.menuItems.length} item{menu.menuItems.length !== 1 ? 's' : ''}
        </div>

        {/* Created By */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Created by:</span> {menu.createdBy.name}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-border hover:bg-muted"
            onClick={() => router.push(`/dashboard/menu-planning/${menu.id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-border hover:bg-muted"
            onClick={() => router.push(`/dashboard/menu-planning/${menu.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
