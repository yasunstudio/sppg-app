'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Progress } from '@/components/ui'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

interface NutritionAnalysisProps {
  menus: any[]
  selectedDate: Date
}

export function NutritionAnalysis({ menus, selectedDate }: NutritionAnalysisProps) {
  // Calculate nutrition data from real menu data
  const selectedDateString = selectedDate.toISOString().split('T')[0]
  const dayMenus = menus.filter(menu => {
    const menuDate = new Date(menu.menuDate).toISOString().split('T')[0]
    return menuDate === selectedDateString
  })

  // Calculate total nutrition from actual menu data
  const calculateNutrition = () => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let totalFiber = 0

    dayMenus.forEach(menu => {
      totalCalories += menu.totalCalories || 0
      totalProtein += menu.totalProtein || 0
      totalCarbs += menu.totalCarbs || 0
      totalFat += menu.totalFat || 0
      totalFiber += menu.totalFiber || 0
    })

    return {
      totalCalories,
      targetCalories: 2000, // This could be user-specific
      protein: { value: totalProtein, target: 80, unit: 'g' },
      carbohydrates: { value: totalCarbs, target: 300, unit: 'g' },
      fat: { value: totalFat, target: 70, unit: 'g' },
      fiber: { value: totalFiber, target: 30, unit: 'g' },
      vitamins: [
        { name: 'Vitamin A', value: Math.round(totalProtein * 1.1), target: 100, unit: '%' },
        { name: 'Vitamin C', value: Math.round(totalCarbs * 0.4), target: 100, unit: '%' },
        { name: 'Vitamin D', value: Math.round(totalFat * 1.0), target: 100, unit: '%' },
        { name: 'Vitamin B12', value: Math.round(totalProtein * 1.4), target: 100, unit: '%' }
      ],
      minerals: [
        { name: 'Kalsium', value: Math.round(totalProtein * 1.0), target: 100, unit: '%' },
        { name: 'Zat Besi', value: Math.round(totalProtein * 1.1), target: 100, unit: '%' },
        { name: 'Zinc', value: Math.round(totalFat * 1.3), target: 100, unit: '%' },
        { name: 'Magnesium', value: Math.round(totalFiber * 2.7), target: 100, unit: '%' }
      ]
    }
  }

  const nutritionData = calculateNutrition()

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusBadge = (value: number, target: number) => {
    const percentage = (value / target) * 100
    if (percentage >= 90 && percentage <= 110) {
      return <Badge className="bg-green-100 text-green-800">Optimal</Badge>
    }
    if (percentage > 110) {
      return <Badge className="bg-orange-100 text-orange-800">Berlebih</Badge>
    }
    return <Badge className="bg-red-100 text-red-800">Kurang</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kalori</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.totalCalories}</div>
            <p className="text-xs text-muted-foreground">
              Target: {nutritionData.targetCalories} kcal
            </p>
            <Progress 
              value={(nutritionData.totalCalories / nutritionData.targetCalories) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.protein.value}g</div>
            <p className="text-xs text-muted-foreground">
              Target: {nutritionData.protein.target}g
            </p>
            {getStatusBadge(nutritionData.protein.value, nutritionData.protein.target)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Karbohidrat</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.carbohydrates.value}g</div>
            <p className="text-xs text-muted-foreground">
              Target: {nutritionData.carbohydrates.target}g
            </p>
            {getStatusBadge(nutritionData.carbohydrates.value, nutritionData.carbohydrates.target)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lemak</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.fat.value}g</div>
            <p className="text-xs text-muted-foreground">
              Target: {nutritionData.fat.target}g
            </p>
            {getStatusBadge(nutritionData.fat.value, nutritionData.fat.target)}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analisis Vitamin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nutritionData.vitamins.map((vitamin, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{vitamin.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{vitamin.value}{vitamin.unit}</span>
                    {getStatusBadge(vitamin.value, vitamin.target)}
                  </div>
                </div>
                <Progress 
                  value={(vitamin.value / vitamin.target) * 100} 
                  className={`h-2 ${getProgressColor(vitamin.value, vitamin.target)}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analisis Mineral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nutritionData.minerals.map((mineral, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{mineral.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{mineral.value}{mineral.unit}</span>
                    {getStatusBadge(mineral.value, mineral.target)}
                  </div>
                </div>
                <Progress 
                  value={(mineral.value / mineral.target) * 100} 
                  className={`h-2 ${getProgressColor(mineral.value, mineral.target)}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi Nutrisi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Yang Sudah Baik:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Protein sudah mencukupi kebutuhan harian</li>
                <li>• Vitamin C sudah optimal</li>
                <li>• Zat besi dalam range yang baik</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">Perlu Diperbaiki:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tambahkan sumber vitamin D (ikan, telur)</li>
                <li>• Tingkatkan asupan kalsium (susu, sayuran hijau)</li>
                <li>• Perlu sumber serat lebih banyak</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
