'use client'

import { GraduationCap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClasses } from '../hooks/use-classes'

interface ClassStatsCardsProps {
  className?: string
}

export function ClassStatsCards({ className }: ClassStatsCardsProps) {
  const { stats, isLoading } = useClasses()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statsData = [
    {
      title: "Total Kelas",
      value: stats.totalClasses,
      description: "Semua kelas terdaftar",
      icon: GraduationCap,
    },
    {
      title: "Total Siswa",
      value: stats.totalStudents,
      description: "Jumlah siswa terdaftar",
      icon: GraduationCap,
    },
    {
      title: "Rata-rata Kapasitas",
      value: `${stats.averageCapacity.toFixed(1)}%`,
      description: "Tingkat pengisian kelas",
      icon: GraduationCap,
    },
    {
      title: "Tingkat Hunian",
      value: `${stats.occupancyRate.toFixed(1)}%`,
      description: "Persentase okupansi",
      icon: GraduationCap,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
