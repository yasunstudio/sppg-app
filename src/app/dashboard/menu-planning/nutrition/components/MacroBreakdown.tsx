'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface MacroData {
  carbs: { current: number; target: number }
  protein: { current: number; target: number }
  fat: { current: number; target: number }
  calories: { current: number; target: number }
}

interface MacroBreakdownProps {
  data: MacroData
}

export default function MacroBreakdown({ data }: MacroBreakdownProps) {
  const macros = [
    {
      name: 'Karbohidrat',
      current: data.carbs.current,
      target: data.carbs.target,
      unit: 'g',
      color: 'bg-blue-500',
      percentage: (data.carbs.current / data.carbs.target) * 100
    },
    {
      name: 'Protein',
      current: data.protein.current,
      target: data.protein.target,
      unit: 'g',
      color: 'bg-green-500',
      percentage: (data.protein.current / data.protein.target) * 100
    },
    {
      name: 'Lemak',
      current: data.fat.current,
      target: data.fat.target,
      unit: 'g',
      color: 'bg-orange-500',
      percentage: (data.fat.current / data.fat.target) * 100
    },
    {
      name: 'Kalori',
      current: data.calories.current,
      target: data.calories.target,
      unit: 'kcal',
      color: 'bg-purple-500',
      percentage: (data.calories.current / data.calories.target) * 100
    }
  ]

  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Distribusi Makronutrien</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {macros.map((macro) => (
          <div key={macro.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{macro.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {macro.current} / {macro.target} {macro.unit}
                </span>
                <Badge 
                  variant={macro.percentage >= 90 ? "default" : macro.percentage >= 70 ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {Math.round(macro.percentage)}%
                </Badge>
              </div>
            </div>
            <Progress value={macro.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}