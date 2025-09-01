'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ChefHat, 
  Calendar as CalendarIcon, 
  TrendingUp,
  Target
} from 'lucide-react'

interface MenuPlanningStatsProps {
  data?: {
    totalMenus: number
    plannedWeeks: number
    totalCalories: number
    avgNutritionScore: number
    upcomingMenus: number
  }
  isLoading: boolean
}

export function MenuPlanningStats({ data, isLoading }: MenuPlanningStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return null
  }

  const stats = [
    {
      title: 'Total Menus',
      value: data.totalMenus.toLocaleString(),
      icon: ChefHat,
      bgColor: 'bg-primary',
      iconColor: 'text-primary-foreground',
    },
    {
      title: 'Planned Weeks',
      value: data.plannedWeeks.toLocaleString(),
      icon: CalendarIcon,
      bgColor: 'bg-muted',
      iconColor: 'text-primary',
    },
    {
      title: 'Total Calories',
      value: data.totalCalories.toLocaleString(),
      icon: TrendingUp,
      bgColor: 'bg-muted',
      iconColor: 'text-primary',
    },
    {
      title: 'Nutrition Score',
      value: `${data.avgNutritionScore}%`,
      icon: Target,
      bgColor: 'bg-muted',
      iconColor: 'text-primary',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
