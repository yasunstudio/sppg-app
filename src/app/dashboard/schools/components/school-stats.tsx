import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { School, Users, GraduationCap, TrendingUp } from 'lucide-react'

interface SchoolStatsData {
  totalSchools: number
  totalStudents: number
  totalClasses: number
  activePrograms: number
  schoolsByType: {
    SD: number
    SMP: number
    SMA: number
    SMK: number
  }
  studentsByGrade: {
    [key: string]: number
  }
  programCoverage: number
}

export function SchoolStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['school-stats'],
    queryFn: async () => {
      const response = await fetch('/api/schools/stats')
      if (!response.ok) throw new Error('Failed to fetch school stats')
      return response.json() as Promise<SchoolStatsData>
    }
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Sekolah',
      value: stats?.totalSchools || 0,
      description: 'Sekolah terdaftar',
      icon: School,
      color: 'text-blue-600'
    },
    {
      title: 'Total Siswa',
      value: stats?.totalStudents || 0,
      description: 'Siswa aktif',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Total Kelas',
      value: stats?.totalClasses || 0,
      description: 'Kelas aktif',
      icon: GraduationCap,
      color: 'text-purple-600'
    },
    {
      title: 'Program Aktif',
      value: stats?.activePrograms || 0,
      description: `${stats?.programCoverage || 0}% cakupan`,
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schools by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Sekolah per Jenis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.schoolsByType && Object.entries(stats.schoolsByType).map(([type, count]) => {
                const percentage = stats.totalSchools > 0 ? (count / stats.totalSchools) * 100 : 0
                const typeLabels = {
                  SD: 'Sekolah Dasar',
                  SMP: 'SMP',
                  SMA: 'SMA',
                  SMK: 'SMK'
                }
                
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                      <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Students by Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Siswa per Tingkat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.studentsByGrade && Object.entries(stats.studentsByGrade)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([grade, count]) => {
                  const percentage = stats.totalStudents > 0 ? (count / stats.totalStudents) * 100 : 0
                  
                  return (
                    <div key={grade} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kelas {grade}</span>
                        <span className="font-medium">{count} siswa ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
