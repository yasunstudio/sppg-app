'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface MicronutrientData {
  name: string
  current: number
  target: number
  unit: string
  importance: 'Tinggi' | 'Sedang' | 'Rendah'
  benefits: string[]
}

interface MicronutrientsProps {
  vitamins: MicronutrientData[]
  minerals: MicronutrientData[]
}

function Micronutrients({ vitamins, minerals }: MicronutrientsProps) {
  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage < 70) return { label: 'Kurang', color: 'destructive' as const }
    if (percentage > 150) return { label: 'Berlebih', color: 'destructive' as const }
    return { label: 'Cukup', color: 'default' as const }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'Tinggi': return 'bg-red-500'
      case 'Sedang': return 'bg-yellow-500'
      case 'Rendah': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const renderNutrientList = (nutrients: MicronutrientData[]) => (
    <div className="space-y-4">
      {nutrients.map((nutrient) => {
        const percentage = getPercentage(nutrient.current, nutrient.target)
        const status = getStatus(nutrient.current, nutrient.target)
        
        return (
          <Card key={nutrient.name} className="border-0 shadow-md bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getImportanceColor(nutrient.importance)} shadow-sm`} />
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{nutrient.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                      {nutrient.importance}
                    </Badge>
                    <Badge variant={status.color} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {nutrient.current} {nutrient.unit}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Target: {nutrient.target} {nutrient.unit}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2 bg-slate-200 dark:bg-slate-600" />
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Manfaat:</p>
                  <div className="flex flex-wrap gap-1">
                    {nutrient.benefits.slice(0, 3).map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                        {benefit}
                      </Badge>
                    ))}
                    {nutrient.benefits.length > 3 && (
                      <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                        +{nutrient.benefits.length - 3} lainnya
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Analisis Mikronutrien</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vitamins" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-700 p-1">
            <TabsTrigger 
              value="vitamins"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 transition-all"
            >
              Vitamin
            </TabsTrigger>
            <TabsTrigger 
              value="minerals"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 transition-all"
            >
              Mineral
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="vitamins" className="mt-4">
            {renderNutrientList(vitamins)}
          </TabsContent>
          
          <TabsContent value="minerals" className="mt-4">
            {renderNutrientList(minerals)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default Micronutrients