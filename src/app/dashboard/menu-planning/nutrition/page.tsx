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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-start md:items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 backdrop-blur-sm transition-all duration-200 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-500 rounded-xl shadow-lg ring-1 ring-white/20 dark:ring-slate-800/50">
                  <Activity className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-sm" />
                </div>
                Analisis Nutrisi
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm md:text-base">
                Evaluasi mendalam kandungan nutrisi menu SPPG
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 backdrop-blur-sm transition-all duration-200"
            >
              <Target className="w-4 h-4" />
              <span>Export PDF</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 shadow-lg shadow-green-500/25 dark:shadow-green-400/20 transition-all duration-200">
              <Settings className="w-4 h-4" />
              <span>Pengaturan</span>
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/50 to-cyan-50 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-cyan-950/40 border-blue-200/60 dark:border-blue-800/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-400/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 dark:from-blue-400/5 dark:to-cyan-400/5"></div>
            <CardContent className="relative p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Kalori</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {sampleMacroData.calories.current.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {Math.round((sampleMacroData.calories.current / sampleMacroData.calories.target) * 100)}% dari target
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-400 dark:to-cyan-500 rounded-xl shadow-md">
                  <TrendingUp className="w-8 h-8 text-white drop-shadow-sm" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-100/50 to-teal-50 dark:from-emerald-950/40 dark:via-green-900/30 dark:to-teal-950/40 border-emerald-200/60 dark:border-emerald-800/50 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-400/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-400/5 dark:to-teal-400/5"></div>
            <CardContent className="relative p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Protein</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {sampleMacroData.protein.current}g
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {Math.round((sampleMacroData.protein.current / sampleMacroData.protein.target) * 100)}% dari target
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-xl shadow-md">
                  <Activity className="w-8 h-8 text-white drop-shadow-sm" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-100/50 to-indigo-50 dark:from-violet-950/40 dark:via-purple-900/30 dark:to-indigo-950/40 border-violet-200/60 dark:border-violet-800/50 shadow-lg shadow-violet-500/10 dark:shadow-violet-400/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/20 dark:hover:shadow-violet-400/10">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 dark:from-violet-400/5 dark:to-indigo-400/5"></div>
            <CardContent className="relative p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-700 dark:text-violet-300">Karbohidrat</p>
                  <p className="text-2xl font-bold text-violet-900 dark:text-violet-100">
                    {sampleMacroData.carbs.current}g
                  </p>
                  <p className="text-xs text-violet-600 dark:text-violet-400">
                    {Math.round((sampleMacroData.carbs.current / sampleMacroData.carbs.target) * 100)}% dari target
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-violet-500 to-indigo-600 dark:from-violet-400 dark:to-indigo-500 rounded-xl shadow-md">
                  <Target className="w-8 h-8 text-white drop-shadow-sm" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-100/50 to-red-50 dark:from-amber-950/40 dark:via-orange-900/30 dark:to-red-950/40 border-amber-200/60 dark:border-amber-800/50 shadow-lg shadow-amber-500/10 dark:shadow-amber-400/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 dark:hover:shadow-amber-400/10">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-red-500/5 dark:from-amber-400/5 dark:to-red-400/5"></div>
            <CardContent className="relative p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Lemak</p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    {sampleMacroData.fat.current}g
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {Math.round((sampleMacroData.fat.current / sampleMacroData.fat.target) * 100)}% dari target
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-amber-500 to-red-600 dark:from-amber-400 dark:to-red-500 rounded-xl shadow-md">
                  <Settings className="w-8 h-8 text-white drop-shadow-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-500/10 dark:shadow-slate-400/5 transition-all duration-300">
            <TabsTrigger 
              value="overview" 
              className="font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Ringkasan
            </TabsTrigger>
            <TabsTrigger 
              value="micronutrients" 
              className="font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Mikronutrien
            </TabsTrigger>
            <TabsTrigger 
              value="targets" 
              className="font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Target
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Pengaturan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/50">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent mb-2">
                  Analisis Makronutrien
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Distribusi kalori dan makronutrien dalam menu harian
                </p>
              </div>
              <MacroBreakdown data={sampleMacroData} />
            </div>
          </TabsContent>

          <TabsContent value="micronutrients" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl border border-violet-200/60 dark:border-violet-800/50">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-300 dark:to-indigo-300 bg-clip-text text-transparent mb-2">
                  Analisis Mikronutrien
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Evaluasi vitamin dan mineral dalam menu
                </p>
              </div>
              <Micronutrients vitamins={sampleVitamins} minerals={sampleMinerals} />
            </div>
          </TabsContent>

          <TabsContent value="targets" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200/60 dark:border-blue-800/50">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-300 dark:to-cyan-300 bg-clip-text text-transparent mb-2">
                  Pengaturan Target Nutrisi
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
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
              <div className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/50">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-300 dark:to-orange-300 bg-clip-text text-transparent mb-2">
                  Pengaturan Analisis
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
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
        <Card className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-blue-200/60 dark:border-blue-800/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-400/5 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-400/5 dark:via-indigo-400/5 dark:to-purple-400/5"></div>
          <CardContent className="relative p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500 rounded-xl shadow-md ring-1 ring-white/20 dark:ring-slate-800/50">
                  <Activity className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Analisis Berdasarkan AKG Indonesia 2019
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Data nutrisi mengacu pada Angka Kecukupan Gizi yang direkomendasikan untuk anak sekolah
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 backdrop-blur-sm transition-all duration-200 shrink-0"
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}