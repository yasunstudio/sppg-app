'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, UserX, TrendingUp, School, MessageCircle, Loader2 } from 'lucide-react'
import type { StudentStats } from '../utils/student-types'

interface StudentStatsCardsProps {
  stats: StudentStats | null
  loading: boolean
}

export function StudentStatsCards({ stats, loading }: StudentStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(6)].map((_, i) => (
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
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Memuat statistik...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Siswa',
      value: stats.totalStudents.toLocaleString('id-ID'),
      description: 'Siswa terdaftar',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Siswa Laki-laki',
      value: stats.totalMaleStudents.toLocaleString('id-ID'),
      description: `${stats.totalStudents > 0 ? Math.round((stats.totalMaleStudents / stats.totalStudents) * 100) : 0}% dari total`,
      icon: UserCheck,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Siswa Perempuan',
      value: stats.totalFemaleStudents.toLocaleString('id-ID'),
      description: `${stats.totalStudents > 0 ? Math.round((stats.totalFemaleStudents / stats.totalStudents) * 100) : 0}% dari total`,
      icon: UserX,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
    },
    {
      title: 'Rata-rata Usia',
      value: `${stats.averageAge.toFixed(1)} tahun`,
      description: 'Usia rata-rata siswa',
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      title: 'Total Sekolah',
      value: stats.totalSchools.toLocaleString('id-ID'),
      description: 'Sekolah terdaftar',
      icon: School,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Konsultasi Gizi',
      value: stats.studentsWithConsultations.toLocaleString('id-ID'),
      description: `${stats.recentConsultations} konsultasi baru`,
      icon: MessageCircle,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground dark:text-card-foreground">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
              {index === 5 && stats.recentConsultations > 0 && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  +{stats.recentConsultations} baru
                </Badge>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
