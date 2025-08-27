'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '../../../components/ui/badge'
import { Plus, Calendar, Filter, ChefHat, Users, Calculator, BookOpen, CheckCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { toast } from 'sonner'
import { 
  MenuCalendar,
  MenuList,
  NutritionAnalysis,
  MenuStats
} from './components'
import { getMealTypeColor, getMealTypeLabel, MEAL_TYPES, type MealType } from '@/lib/constants/meal-types'

type MenuStatus = 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED'

interface Menu {
  id: string
  name: string
  description: string
  mealType: MealType
  servingSize: number
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  vitamin: string
  mineral: string
  status: MenuStatus
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
  recipes: MenuRecipe[]
  nutritionalInfo: any
}

interface MenuRecipe {
  id: string
  rawMaterial: {
    id: string
    name: string
    category: string
    unit: string
  }
  quantity: number
  calories: number
  protein: number
  carbohydrates: number
  fat: number
}

export default function MenuPlanningPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'ALL'>('ALL')

  // Handle success messages from redirects
  useEffect(() => {
    const success = searchParams.get('success')
    if (success === 'ai-planner') {
      toast.success('Menu AI berhasil dibuat!')
      // Remove the success param from URL
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('success')
      router.replace('/dashboard/menu-planning?' + newSearchParams.toString())
    } else if (success === 'menu-created') {
      toast.success('Menu baru berhasil dibuat!')
      // Remove the success param from URL
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('success')
      router.replace('/dashboard/menu-planning?' + newSearchParams.toString())
    }
  }, [searchParams, router])

  // Fetch menus data
  const { data: menus = [], isLoading, refetch } = useQuery({
    queryKey: ['menus', selectedMealType],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedMealType !== 'ALL') params.append('mealType', selectedMealType)
      
      const response = await fetch(`/api/menus?${params}`)
      if (!response.ok) throw new Error('Failed to fetch menus')
      return response.json()
    }
  })

  const getMealTypeColorFromConstants = getMealTypeColor

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Perencanaan Menu</h1>
          <p className="text-muted-foreground">
            Kelola dan rencanakan menu makanan untuk sekolah
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={() => router.push('/dashboard/menu-planning/ai-planner')}
          >
            <Calculator className="w-4 h-4 mr-2" />
            AI Menu Planner
          </Button>
          <Button 
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={() => router.push('/dashboard/menu-planning/create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Menu Baru
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <MenuStats />

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Menu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedMealType} onValueChange={(value: MealType | 'ALL') => setSelectedMealType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Jenis Makanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jenis</SelectItem>
                {Object.entries(MEAL_TYPES).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {getMealTypeLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Kalender Menu
          </TabsTrigger>
          <TabsTrigger value="menus" className="flex items-center">
            <ChefHat className="w-4 h-4 mr-2" />
            Daftar Menu
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Analisis Nutrisi
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Laporan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <MenuCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            menus={menus}
            onRefetch={refetch}
            getMealTypeColor={getMealTypeColorFromConstants}
          />
        </TabsContent>

        <TabsContent value="menus" className="space-y-4">
          <MenuList
            menus={menus}
            isLoading={isLoading}
            onRefetch={refetch}
            getMealTypeColor={getMealTypeColorFromConstants}
          />
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <NutritionAnalysis
            menus={menus}
            selectedDate={selectedDate}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laporan Menu & Nutrisi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Laporan akan segera tersedia</h3>
                <p className="text-muted-foreground">
                  Fitur laporan menu dan analisis nutrisi akan diimplementasikan pada update berikutnya.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
