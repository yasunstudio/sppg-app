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
      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-teal-950/30 border-emerald-200/60 dark:border-emerald-800/50 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-400/5 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-400/5 dark:to-teal-400/5"></div>
        <CardHeader className="relative pb-3">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">Total Kalori</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {data.calories.current} kcal
            </span>
            <Badge variant={getStatus(data.calories.current, data.calories.target).color} className="shadow-sm">
              {getStatus(data.calories.current, data.calories.target).label}
            </Badge>
          </div>
          <Progress 
            value={getPercentage(data.calories.current, data.calories.target)} 
            className="h-3 bg-slate-200 dark:bg-slate-700"
          />
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-2">
            <span>Target: {data.calories.target} kcal</span>
            <span>{Math.round((data.calories.current / data.calories.target) * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Makronutrien */}
      <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 shadow-lg backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50"></div>
        <CardHeader className="relative pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Distribusi Makronutrien</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-6">
            {macros.map((macro) => {
              const percentage = getPercentage(macro.current, macro.target)
              const status = getStatus(macro.current, macro.target)
              
              return (
                <div key={macro.name} className="space-y-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-600/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${macro.color} shadow-sm ring-2 ring-white dark:ring-slate-800`} />
                      <span className="font-medium text-slate-900 dark:text-slate-100">{macro.name}</span>
                    </div>
                    <Badge variant={status.color} className="text-xs shadow-sm">
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
                  
                  <Progress value={percentage} className="h-2 bg-slate-200 dark:bg-slate-600" />
                  
                  <div className="text-right">
                    <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
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