'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Filter, 
  ChefHat, 
  Users, 
  Clock,
  TrendingUp,
  Target,
  BookOpen,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

interface Menu {
  id: string
  name: string
  description: string
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'
  servingSize: number
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED'
  scheduledDate?: Date
  createdAt: Date
}

interface PlanningStats {
  totalMenus: number
  plannedWeeks: number
  totalCalories: number
  avgNutritionScore: number
}

// Sample data for demonstration
const sampleMenus: Menu[] = [
  {
    id: '1',
    name: 'Nasi Gudeg Jogja',
    description: 'Menu tradisional dengan gudeg, ayam, dan sayuran',
    mealType: 'LUNCH',
    servingSize: 150,
    calories: 450,
    protein: 25,
    carbohydrates: 55,
    fat: 18,
    status: 'APPROVED',
    scheduledDate: new Date('2025-08-28'),
    createdAt: new Date('2025-08-25')
  },
  {
    id: '2',
    name: 'Bubur Ayam Sehat',
    description: 'Bubur ayam dengan sayuran dan telur',
    mealType: 'BREAKFAST',
    servingSize: 200,
    calories: 320,
    protein: 18,
    carbohydrates: 45,
    fat: 12,
    status: 'PUBLISHED',
    scheduledDate: new Date('2025-08-29'),
    createdAt: new Date('2025-08-26')
  }
]

const sampleStats: PlanningStats = {
  totalMenus: 24,
  plannedWeeks: 4,
  totalCalories: 8640,
  avgNutritionScore: 87
}

export default function MenuPlanningPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedMealType, setSelectedMealType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      case 'LUNCH':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'DINNER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'SNACK':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const filteredMenus = sampleMenus.filter(menu => {
    const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         menu.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMealType = selectedMealType === 'all' || menu.mealType === selectedMealType
    const matchesStatus = selectedStatus === 'all' || menu.status === selectedStatus
    
    return matchesSearch && matchesMealType && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Perencanaan Menu
            </h1>
            <p className="text-muted-foreground">
              Kelola dan rencanakan menu harian untuk program SPPG
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="bg-card/80 dark:bg-card/80 border-border hover:bg-muted backdrop-blur-sm transition-all duration-200"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Lihat Kalender
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Buat Menu Baru
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Menu</p>
                  <p className="text-2xl font-bold text-foreground">
                    {sampleStats.totalMenus}
                  </p>
                </div>
                <div className="p-3 bg-primary rounded-xl">
                  <ChefHat className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Minggu Terencana</p>
                  <p className="text-2xl font-bold text-foreground">
                    {sampleStats.plannedWeeks}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Kalori</p>
                  <p className="text-2xl font-bold text-foreground">
                    {sampleStats.totalCalories.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skor Nutrisi</p>
                  <p className="text-2xl font-bold text-foreground">
                    {sampleStats.avgNutritionScore}%
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
            <TabsTrigger 
              value="calendar" 
              className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Kalender
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Daftar Menu
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Analitik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Kalender Menu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-8 bg-muted/30 rounded-lg border border-border text-center">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-medium text-foreground mb-2">Kalender Menu</h3>
                    <p className="text-sm text-muted-foreground">
                      Kalender interaktif akan ditampilkan di sini untuk mengelola jadwal menu harian
                    </p>
                    <Button variant="outline" className="mt-4 border-border hover:bg-muted">
                      Lihat Detail Kalender
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Menu Preview */}
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Menu Hari Ini
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleMenus.slice(0, 2).map((menu) => (
                    <div key={menu.id} className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{menu.name}</h4>
                        <Badge className={getMealTypeColor(menu.mealType)}>
                          {menu.mealType}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{menu.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{menu.calories} kal</span>
                        <Badge className={getStatusColor(menu.status)}>
                          {menu.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-6 mt-6">
            {/* Filters */}
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Cari menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-background border-border"
                  />
                  <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                    <SelectTrigger className="w-full md:w-48 bg-background border-border">
                      <SelectValue placeholder="Jenis Makanan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenis</SelectItem>
                      <SelectItem value="BREAKFAST">Sarapan</SelectItem>
                      <SelectItem value="LUNCH">Makan Siang</SelectItem>
                      <SelectItem value="DINNER">Makan Malam</SelectItem>
                      <SelectItem value="SNACK">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-48 bg-background border-border">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="APPROVED">Disetujui</SelectItem>
                      <SelectItem value="PUBLISHED">Dipublikasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Menu List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenus.map((menu) => (
                <Card key={menu.id} className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-foreground">{menu.name}</CardTitle>
                      <Badge className={getStatusColor(menu.status)}>
                        {menu.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{menu.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getMealTypeColor(menu.mealType)}>
                        {menu.mealType}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">{menu.calories} kal</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Protein:</span> {menu.protein}g
                      </div>
                      <div>
                        <span className="font-medium">Karbo:</span> {menu.carbohydrates}g
                      </div>
                      <div>
                        <span className="font-medium">Lemak:</span> {menu.fat}g
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 border-border hover:bg-muted">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-border hover:bg-muted">
                        Jadwalkan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Distribusi Jenis Makanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center text-muted-foreground">
                      Chart akan ditampilkan di sini
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Target Nutrisi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center text-muted-foreground">
                      Analisis nutrisi akan ditampilkan di sini
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
