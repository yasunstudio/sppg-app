'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Activity, Target, Settings, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MacroBreakdown, Micronutrients, NutritionTargets, NutritionSettings } from './components'

// Sample data untuk demonstrasi
const sampleMacroData = {
  carbs: { current: 285, target: 300 },
  protein: { current: 52, target: 60 },
  fat: { current: 71, target: 67 },
  calories: { current: 1895, target: 2000 }
}

const sampleVitamins = [
  {
    name: 'Vitamin A',
    current: 520,
    target: 600,
    unit: 'μg',
    importance: 'Tinggi' as const,
    benefits: ['Kesehatan mata', 'Sistem imun', 'Pertumbuhan sel']
  },
  {
    name: 'Vitamin C',
    current: 38,
    target: 45,
    unit: 'mg',
    importance: 'Tinggi' as const,
    benefits: ['Antioksidan', 'Penyerapan zat besi', 'Kolagen']
  },
  {
    name: 'Vitamin D',
    current: 12,
    target: 15,
    unit: 'μg',
    importance: 'Tinggi' as const,
    benefits: ['Kesehatan tulang', 'Sistem imun']
  },
  {
    name: 'Vitamin E',
    current: 6.5,
    target: 8,
    unit: 'mg',
    importance: 'Sedang' as const,
    benefits: ['Antioksidan', 'Kesehatan kulit']
  }
]

const sampleMinerals = [
  {
    name: 'Kalsium',
    current: 1050,
    target: 1200,
    unit: 'mg',
    importance: 'Tinggi' as const,
    benefits: ['Kesehatan tulang', 'Kontraksi otot', 'Fungsi saraf']
  },
  {
    name: 'Zat Besi',
    current: 11,
    target: 13,
    unit: 'mg',
    importance: 'Tinggi' as const,
    benefits: ['Pembentukan darah', 'Transportasi oksigen', 'Energi']
  },
  {
    name: 'Seng',
    current: 8,
    target: 11,
    unit: 'mg',
    importance: 'Sedang' as const,
    benefits: ['Sistem imun', 'Penyembuhan luka', 'Metabolisme']
  },
  {
    name: 'Magnesium',
    current: 98,
    target: 120,
    unit: 'mg',
    importance: 'Sedang' as const,
    benefits: ['Fungsi otot', 'Metabolisme energi', 'Kesehatan tulang']
  }
]

const defaultNutritionTargets = {
  calories: 2000,
  carbs: 300,
  protein: 60,
  fat: 67,
  fiber: 25,
  vitaminA: 600,
  vitaminC: 45,
  vitaminD: 15,
  vitaminE: 8,
  vitaminK: 25,
  thiamine: 1.1,
  riboflavin: 1.1,
  niacin: 12,
  vitaminB6: 1.1,
  vitaminB12: 1.8,
  folate: 250,
  calcium: 1200,
  iron: 13,
  magnesium: 120,
  phosphorus: 500,
  potassium: 1600,
  sodium: 1200,
  zinc: 11
}

export default function NutritionAnalysisPage() {
  const router = useRouter()
  const [nutritionTargets, setNutritionTargets] = useState(defaultNutritionTargets)
  const [nutritionSettings, setNutritionSettings] = useState({
    nutritionStandard: 'akg-indonesia' as 'akg-indonesia' | 'who' | 'usda',
    unitSystem: 'metric' as 'metric' | 'imperial',
    displayOptions: {
      showPercentages: true,
      showProgress: true,
      showRecommendations: true,
      groupByCategory: true
    },
    analysisDepth: 'detailed' as 'basic' | 'detailed' | 'comprehensive'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border shadow-sm">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl shadow-sm">
                <Activity className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
              </div>
              Analisis Nutrisi
            </h1>
            <p className="text-muted-foreground">
              Evaluasi komprehensif nilai gizi menu SPPG berdasarkan standar AKG Indonesia
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="border-border hover:bg-muted"
            >
              <Target className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <Settings className="w-4 h-4 mr-2" />
              Pengaturan
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Kalori</p>
                  <p className="text-2xl font-bold text-foreground">
                    {sampleMacroData.calories.current.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((sampleMacroData.calories.current / sampleMacroData.calories.target) * 100)}% dari target
                  </p>
                </div>
                <div className="p-2 bg-blue-500 rounded-xl shadow-sm">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Protein</p>
                  <p className="text-2xl font-bold text-foreground">
                    {sampleMacroData.protein.current}g
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((sampleMacroData.protein.current / sampleMacroData.protein.target) * 100)}% dari target
                  </p>
                </div>
                <div className="p-2 bg-emerald-500 rounded-xl shadow-sm">
                  <Activity className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Karbohidrat</p>
                  <p className="text-2xl font-bold text-foreground">
                    {sampleMacroData.carbs.current}g
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((sampleMacroData.carbs.current / sampleMacroData.carbs.target) * 100)}% dari target
                  </p>
                </div>
                <div className="p-2 bg-violet-500 rounded-xl shadow-sm">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lemak</p>
                  <p className="text-2xl font-bold text-foreground">
                    {sampleMacroData.fat.current}g
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((sampleMacroData.fat.current / sampleMacroData.fat.target) * 100)}% dari target
                  </p>
                </div>
                <div className="p-2 bg-amber-500 rounded-xl shadow-sm">
                  <Settings className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted border border-border shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Ringkasan
            </TabsTrigger>
            <TabsTrigger 
              value="micronutrients" 
              className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Mikronutrien
            </TabsTrigger>
            <TabsTrigger 
              value="targets" 
              className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Target
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Pengaturan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="text-center p-6 bg-muted/50 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Analisis Makronutrien
                </h2>
                <p className="text-muted-foreground text-sm">
                  Distribusi kalori dan makronutrien dalam menu harian
                </p>
              </div>
              <MacroBreakdown data={sampleMacroData} />
            </div>
          </TabsContent>

          <TabsContent value="micronutrients" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="text-center p-6 bg-muted/50 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Analisis Mikronutrien
                </h2>
                <p className="text-muted-foreground text-sm">
                  Evaluasi vitamin dan mineral dalam menu
                </p>
              </div>
              <Micronutrients vitamins={sampleVitamins} minerals={sampleMinerals} />
            </div>
          </TabsContent>

          <TabsContent value="targets" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="text-center p-6 bg-muted/50 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Pengaturan Target Nutrisi
                </h2>
                <p className="text-muted-foreground text-sm">
                  Atur target nutrisi berdasarkan standar AKG Indonesia
                </p>
              </div>
              <NutritionTargets 
                targets={nutritionTargets} 
                onTargetsChange={setNutritionTargets}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="text-center p-6 bg-muted/50 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Pengaturan Analisis
                </h2>
                <p className="text-muted-foreground text-sm">
                  Kustomisasi tampilan dan standar analisis nutrisi
                </p>
              </div>
              <NutritionSettings 
                settings={nutritionSettings}
                onSettingsChange={setNutritionSettings}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="bg-card border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary rounded-xl shadow-sm">
                  <Activity className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Analisis Berdasarkan AKG Indonesia 2019
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Data nutrisi mengacu pada Angka Kecukupan Gizi yang direkomendasikan untuk anak sekolah
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border hover:bg-muted"
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }