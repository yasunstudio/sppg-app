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
      default: return 'bg-muted-foreground'
    }
  }

  const renderNutrientList = (nutrients: MicronutrientData[]) => (
    <div className="space-y-4">
      {nutrients.map((nutrient) => {
        const percentage = getPercentage(nutrient.current, nutrient.target)
        const status = getStatus(nutrient.current, nutrient.target)
        
        return (
          <Card key={nutrient.name} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getImportanceColor(nutrient.importance)}`} />
                    <h4 className="font-medium text-foreground">{nutrient.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {nutrient.importance}
                    </Badge>
                    <Badge variant={status.color} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {nutrient.current} {nutrient.unit}
                    </span>
                    <span className="text-muted-foreground">
                      Target: {nutrient.target} {nutrient.unit}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Manfaat:</p>
                  <div className="flex flex-wrap gap-1">
                    {nutrient.benefits.slice(0, 3).map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                    {nutrient.benefits.length > 3 && (
                      <Badge variant="outline" className="text-xs">
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
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Analisis Mikronutrien</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vitamins" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vitamins">Vitamin</TabsTrigger>
            <TabsTrigger value="minerals">Mineral</TabsTrigger>
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