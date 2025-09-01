'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Target, TrendingUp, PieChart } from 'lucide-react'

interface MenuAnalyticsViewProps {
  menus: any[]
  isLoading: boolean
}

export function MenuAnalyticsView({ menus, isLoading }: MenuAnalyticsViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calculate analytics data
  const mealTypeDistribution = menus.reduce((acc, menu) => {
    acc[menu.mealType] = (acc[menu.mealType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const nutritionAverages = menus.reduce(
    (acc, menu) => {
      if (menu.totalCalories) acc.calories += menu.totalCalories
      if (menu.totalProtein) acc.protein += menu.totalProtein
      if (menu.totalCarbs) acc.carbs += menu.totalCarbs
      if (menu.totalFat) acc.fat += menu.totalFat
      acc.count += 1
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 }
  )

  const avgNutrition = {
    calories: nutritionAverages.count > 0 ? Math.round(nutritionAverages.calories / nutritionAverages.count) : 0,
    protein: nutritionAverages.count > 0 ? Math.round((nutritionAverages.protein / nutritionAverages.count) * 10) / 10 : 0,
    carbs: nutritionAverages.count > 0 ? Math.round((nutritionAverages.carbs / nutritionAverages.count) * 10) / 10 : 0,
    fat: nutritionAverages.count > 0 ? Math.round((nutritionAverages.fat / nutritionAverages.count) * 10) / 10 : 0,
  }

  const targetGroupDistribution = menus.reduce((acc, menu) => {
    acc[menu.targetGroup] = (acc[menu.targetGroup] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Meal Type Distribution */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Meal Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(mealTypeDistribution).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${((count as number) / menus.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{count as number}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Average Nutrition */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Average Nutrition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{avgNutrition.calories}</p>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{avgNutrition.protein}g</p>
                <p className="text-sm text-muted-foreground">Protein</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{avgNutrition.carbs}g</p>
                <p className="text-sm text-muted-foreground">Carbs</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{avgNutrition.fat}g</p>
                <p className="text-sm text-muted-foreground">Fat</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Group Distribution */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Target Group Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(targetGroupDistribution).map(([group, count]) => (
              <div key={group} className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{group.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${((count as number) / menus.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{count as number}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 bg-muted/30 rounded-lg border border-border text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-medium text-foreground mb-2">Trend Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Monthly menu planning trends and statistics will be displayed here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
