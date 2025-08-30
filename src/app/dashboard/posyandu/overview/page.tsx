"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Heart, 
  Baby, 
  UserCheck, 
  Activity, 
  Utensils,
  Calendar,
  TrendingUp
} from "lucide-react"

interface OverviewStats {
  totalParticipants: number
  totalHealthRecords: number
  totalPregnantWomen: number
  totalLactatingMothers: number
  totalToddlers: number
  totalNutritionPlans: number
  totalActivities: number
  recentActivities: Array<{
    id: string
    title: string
    date: string
    status: string
    activityType: string
  }>
  healthSummary: {
    normalNutrition: number
    underweight: number
    overweight: number
  }
}

export default function PosyanduOverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOverviewData = async () => {
    try {
      setLoading(true)
      
      // Fetch data from multiple APIs
      const [
        participantsRes,
        healthRecordsRes,
        pregnantWomenRes,
        lactatingMothersRes,
        toddlersRes,
        nutritionPlansRes,
        activitiesRes
      ] = await Promise.all([
        fetch('/api/participants?page=1&limit=1'),
        fetch('/api/health-records?page=1&limit=1'),
        fetch('/api/pregnant-women?page=1&limit=1'),
        fetch('/api/lactating-mothers?page=1&limit=1'),
        fetch('/api/toddlers?page=1&limit=1'),
        fetch('/api/nutrition-plans?page=1&limit=1'),
        fetch('/api/posyandu-activities?page=1&limit=5')
      ])

      const [
        participantsData,
        healthRecordsData,
        pregnantWomenData,
        lactatingMothersData,
        toddlersData,
        nutritionPlansData,
        activitiesData
      ] = await Promise.all([
        participantsRes.json(),
        healthRecordsRes.json(),
        pregnantWomenRes.json(),
        lactatingMothersRes.json(),
        toddlersRes.json(),
        nutritionPlansRes.json(),
        activitiesRes.json()
      ])

      setStats({
        totalParticipants: participantsData.summary?.totalParticipants || 0,
        totalHealthRecords: healthRecordsData.summary?.totalRecords || 0,
        totalPregnantWomen: pregnantWomenData.summary?.totalPregnantWomen || 0,
        totalLactatingMothers: lactatingMothersData.summary?.totalLactatingMothers || 0,
        totalToddlers: toddlersData.summary?.totalToddlers || 0,
        totalNutritionPlans: nutritionPlansData.summary?.totalPlans || 0,
        totalActivities: activitiesData.summary?.totalActivities || 0,
        recentActivities: activitiesData.data || [],
        healthSummary: {
          normalNutrition: healthRecordsData.summary?.nutritionalStatusDistribution?.normal || 0,
          underweight: healthRecordsData.summary?.nutritionalStatusDistribution?.underweight || 0,
          overweight: healthRecordsData.summary?.nutritionalStatusDistribution?.overweight || 0,
        }
      })
    } catch (error) {
      console.error("Error fetching overview data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverviewData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview Posyandu</h1>
          <p className="text-muted-foreground">
            Ringkasan data dan aktivitas posyandu
          </p>
        </div>
        <Button onClick={fetchOverviewData}>
          <TrendingUp className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalParticipants || 0}</div>
            <p className="text-xs text-muted-foreground">
              Peserta terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rekam Kesehatan</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalHealthRecords || 0}</div>
            <p className="text-xs text-muted-foreground">
              Record kesehatan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ibu Hamil</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPregnantWomen || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ibu hamil terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balita</CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalToddlers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Balita terdaftar
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Status Gizi</CardTitle>
            <CardDescription>
              Distribusi status gizi berdasarkan rekam kesehatan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Gizi Normal</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{stats?.healthSummary.normalNutrition || 0}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Gizi Kurang</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{stats?.healthSummary.underweight || 0}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Gizi Lebih</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{stats?.healthSummary.overweight || 0}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              5 aktivitas posyandu terbaru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivities.length ? (
                stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <Badge 
                      variant={activity.status === "COMPLETED" ? "default" : 
                               activity.status === "ONGOING" ? "secondary" : "outline"}
                    >
                      {activity.status === "COMPLETED" ? "Selesai" :
                       activity.status === "ONGOING" ? "Berlangsung" :
                       activity.status === "PLANNED" ? "Direncanakan" : activity.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada aktivitas terbaru
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik Cepat</CardTitle>
            <CardDescription>
              Ringkasan data program posyandu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Ibu Menyusui</span>
                </div>
                <span className="font-medium">{stats?.totalLactatingMothers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Rencana Nutrisi</span>
                </div>
                <span className="font-medium">{stats?.totalNutritionPlans || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Aktivitas</span>
                </div>
                <span className="font-medium">{stats?.totalActivities || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Akses Cepat</CardTitle>
            <CardDescription>
              Navigasi ke modul-modul utama
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/dashboard/posyandu/participants">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Data Peserta
                </Button>
              </Link>
              <Link href="/dashboard/posyandu/health-records">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Rekam Kesehatan
                </Button>
              </Link>
              <Link href="/dashboard/posyandu/pregnant-women">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Ibu Hamil
                </Button>
              </Link>
              <Link href="/dashboard/posyandu/toddlers">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Baby className="mr-2 h-4 w-4" />
                  Balita
                </Button>
              </Link>
              <Link href="/dashboard/posyandu/nutrition-plans">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Utensils className="mr-2 h-4 w-4" />
                  Rencana Nutrisi
                </Button>
              </Link>
              <Link href="/dashboard/posyandu/activities">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Aktivitas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
