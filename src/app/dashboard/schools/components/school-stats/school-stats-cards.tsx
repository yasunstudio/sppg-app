'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { School, Users, GraduationCap, TrendingUp, Loader2 } from 'lucide-react'
import type { SchoolStats } from '../utils/school-types'

interface SchoolStatsCardsProps {
  stats: SchoolStats | null
  loading: boolean
}

export function SchoolStatsCards({ stats, loading }: SchoolStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <div className="h-4 w-20 bg-muted dark:bg-muted animate-pulse rounded" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted dark:bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted dark:bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-24 bg-muted dark:bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card dark:bg-card border-border dark:border-border">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Memuat statistik...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Total Sekolah",
      value: stats.totalSchools.toLocaleString('id-ID'),
      description: "Sekolah terdaftar",
      icon: School,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Siswa",
      value: stats.totalStudents.toLocaleString('id-ID'),
      description: "Siswa terdaftar",
      icon: Users,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Total Kelas",
      value: stats.totalClasses.toLocaleString('id-ID'),
      description: "Kelas tersedia",
      icon: GraduationCap,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Rata-rata Siswa",
      value: Math.round(stats.averageStudentsPerSchool).toLocaleString('id-ID'),
      description: "Siswa per sekolah",
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground dark:text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
