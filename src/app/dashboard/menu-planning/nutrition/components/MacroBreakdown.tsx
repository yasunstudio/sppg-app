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

function MacroBreakdown({ data }: MacroBreakdownProps) {
  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage < 80) return { label: 'Kurang', color: 'destructive' as const }
    if (percentage > 120) return { label: 'Berlebih', color: 'destructive' as const }
    return { label: 'Baik', color: 'default' as const }
  }

  const macros = [
    {
      name: 'Karbohidrat',
      current: data.carbs.current,
      target: data.carbs.target,
      unit: 'g',
      color: 'bg-blue-500'
    },
    {
      name: 'Protein',
      current: data.protein.current,
      target: data.protein.target,
      unit: 'g',
      color: 'bg-green-500'
    },
    {
      name: 'Lemak',
      current: data.fat.current,
      target: data.fat.target,
      unit: 'g',
      color: 'bg-yellow-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Kalori Total */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">Total Kalori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
              {data.calories.current} kcal
            </span>
            <Badge variant={getStatus(data.calories.current, data.calories.target).color} className="px-3 py-1">
              {getStatus(data.calories.current, data.calories.target).label}
            </Badge>
          </div>
          <Progress 
            value={getPercentage(data.calories.current, data.calories.target)} 
            className="h-3 bg-emerald-200 dark:bg-emerald-900"
          />
          <div className="flex justify-between text-sm text-emerald-700 dark:text-emerald-300 mt-3">
            <span>Target: {data.calories.target} kcal</span>
            <span className="font-medium">{Math.round((data.calories.current / data.calories.target) * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Makronutrien */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Distribusi Makronutrien</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {macros.map((macro) => {
              const percentage = getPercentage(macro.current, macro.target)
              const status = getStatus(macro.current, macro.target)
              
              return (
                <div key={macro.name} className="space-y-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${macro.color} shadow-md`} />
                      <span className="font-medium text-slate-900 dark:text-slate-100">{macro.name}</span>
                    </div>
                    <Badge variant={status.color} className="text-xs px-2 py-1">
                      {status.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {macro.current}{macro.unit}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Target: {macro.target}{macro.unit}
                    </span>
                  </div>
                  
                  <Progress value={percentage} className="h-3 bg-slate-200 dark:bg-slate-600" />
                  
                  <div className="text-right">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MacroBreakdown