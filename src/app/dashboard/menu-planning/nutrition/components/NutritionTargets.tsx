'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface NutritionTarget {
  calories: number
  carbs: number
  protein: number
  fat: number
  fiber: number
  vitaminA: number
  vitaminC: number
  vitaminD: number
  vitaminE: number
  vitaminK: number
  thiamine: number
  riboflavin: number
  niacin: number
  vitaminB6: number
  vitaminB12: number
  folate: number
  calcium: number
  iron: number
  magnesium: number
  phosphorus: number
  potassium: number
  sodium: number
  zinc: number
}

interface NutritionTargetsProps {
  targets: NutritionTarget
  onTargetsChange: (targets: NutritionTarget) => void
}

// Data AKG Indonesia berdasarkan kelompok usia
const akgData = {
  '4-6': {
    calories: 1600, carbs: 220, protein: 35, fat: 62, fiber: 22,
    vitaminA: 450, vitaminC: 45, vitaminD: 15, vitaminE: 7, vitaminK: 20,
    thiamine: 0.9, riboflavin: 1.0, niacin: 10, vitaminB6: 1.0, vitaminB12: 1.5, folate: 200,
    calcium: 1000, iron: 9, magnesium: 95, phosphorus: 500, potassium: 1400, sodium: 1200, zinc: 5
  },
  '7-9': {
    calories: 1850, carbs: 254, protein: 49, fat: 72, fiber: 26,
    vitaminA: 500, vitaminC: 45, vitaminD: 15, vitaminE: 8, vitaminK: 25,
    thiamine: 1.1, riboflavin: 1.1, niacin: 12, vitaminB6: 1.1, vitaminB12: 1.8, folate: 250,
    calcium: 1000, iron: 10, magnesium: 120, phosphorus: 500, potassium: 1600, sodium: 1200, zinc: 11
  },
  '10-12': {
    calories: 2100, carbs: 289, protein: 56, fat: 81, fiber: 30,
    vitaminA: 600, vitaminC: 50, vitaminD: 15, vitaminE: 11, vitaminK: 35,
    thiamine: 1.3, riboflavin: 1.3, niacin: 14, vitaminB6: 1.3, vitaminB12: 2.0, folate: 300,
    calcium: 1200, iron: 13, magnesium: 150, phosphorus: 1200, potassium: 1800, sodium: 1500, zinc: 13
  }
}

function NutritionTargets({ targets, onTargetsChange }: NutritionTargetsProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<keyof typeof akgData>('7-9')

  const handleApplyAKG = () => {
    const akgTargets = akgData[selectedAgeGroup]
    onTargetsChange({
      ...targets,
      ...akgTargets
    })
  }

  const handleTargetChange = (field: keyof NutritionTarget, value: string) => {
    const numValue = parseFloat(value) || 0
    onTargetsChange({
      ...targets,
      [field]: numValue
    })
  }

  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Target Nutrisi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AKG Indonesia Quick Set */}
        <div className="p-4 bg-muted rounded-lg border border-border">
          <h3 className="font-medium text-foreground mb-3">Standar AKG Indonesia</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label>Kelompok Usia</Label>
              <Select value={selectedAgeGroup} onValueChange={(value) => setSelectedAgeGroup(value as keyof typeof akgData)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4-6">4-6 tahun</SelectItem>
                  <SelectItem value="7-9">7-9 tahun</SelectItem>
                  <SelectItem value="10-12">10-12 tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleApplyAKG} className="mt-6">
              Terapkan Target
            </Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Badge variant="outline">
              {akgData[selectedAgeGroup].calories} kcal
            </Badge>
            <Badge variant="outline">
              {akgData[selectedAgeGroup].protein}g protein
            </Badge>
            <Badge variant="outline">
              {akgData[selectedAgeGroup].carbs}g karbohidrat
            </Badge>
          </div>
        </div>

        {/* Manual Target Setting */}
        <Tabs defaultValue="macros" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="macros">Makronutrien</TabsTrigger>
            <TabsTrigger value="vitamins">Vitamin</TabsTrigger>
            <TabsTrigger value="minerals">Mineral</TabsTrigger>
          </TabsList>

          <TabsContent value="macros" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories">Kalori (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  value={targets.calories}
                  onChange={(e) => handleTargetChange('calories', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="carbs">Karbohidrat (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={targets.carbs}
                  onChange={(e) => handleTargetChange('carbs', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={targets.protein}
                  onChange={(e) => handleTargetChange('protein', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fat">Lemak (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={targets.fat}
                  onChange={(e) => handleTargetChange('fat', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fiber">Serat (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  value={targets.fiber}
                  onChange={(e) => handleTargetChange('fiber', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vitamins" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vitaminA">Vitamin A (μg)</Label>
                <Input
                  id="vitaminA"
                  type="number"
                  value={targets.vitaminA}
                  onChange={(e) => handleTargetChange('vitaminA', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vitaminC">Vitamin C (mg)</Label>
                <Input
                  id="vitaminC"
                  type="number"
                  value={targets.vitaminC}
                  onChange={(e) => handleTargetChange('vitaminC', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vitaminD">Vitamin D (μg)</Label>
                <Input
                  id="vitaminD"
                  type="number"
                  value={targets.vitaminD}
                  onChange={(e) => handleTargetChange('vitaminD', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vitaminE">Vitamin E (mg)</Label>
                <Input
                  id="vitaminE"
                  type="number"
                  value={targets.vitaminE}
                  onChange={(e) => handleTargetChange('vitaminE', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="thiamine">Thiamine/B1 (mg)</Label>
                <Input
                  id="thiamine"
                  type="number"
                  step="0.1"
                  value={targets.thiamine}
                  onChange={(e) => handleTargetChange('thiamine', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vitaminB12">Vitamin B12 (μg)</Label>
                <Input
                  id="vitaminB12"
                  type="number"
                  step="0.1"
                  value={targets.vitaminB12}
                  onChange={(e) => handleTargetChange('vitaminB12', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="minerals" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calcium">Kalsium (mg)</Label>
                <Input
                  id="calcium"
                  type="number"
                  value={targets.calcium}
                  onChange={(e) => handleTargetChange('calcium', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="iron">Zat Besi (mg)</Label>
                <Input
                  id="iron"
                  type="number"
                  value={targets.iron}
                  onChange={(e) => handleTargetChange('iron', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zinc">Seng (mg)</Label>
                <Input
                  id="zinc"
                  type="number"
                  value={targets.zinc}
                  onChange={(e) => handleTargetChange('zinc', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="magnesium">Magnesium (mg)</Label>
                <Input
                  id="magnesium"
                  type="number"
                  value={targets.magnesium}
                  onChange={(e) => handleTargetChange('magnesium', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="potassium">Kalium (mg)</Label>
                <Input
                  id="potassium"
                  type="number"
                  value={targets.potassium}
                  onChange={(e) => handleTargetChange('potassium', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sodium">Natrium (mg)</Label>
                <Input
                  id="sodium"
                  type="number"
                  value={targets.sodium}
                  onChange={(e) => handleTargetChange('sodium', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default NutritionTargets