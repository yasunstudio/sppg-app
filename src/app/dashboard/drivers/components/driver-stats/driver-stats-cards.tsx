import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Activity, 
  Star, 
  AlertTriangle,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import type { DriverStats } from '../utils/driver-types'

interface DriverStatsCardsProps {
  stats: DriverStats
  showStats: boolean
  onToggleStats: () => void
}

export function DriverStatsCards({ stats, showStats, onToggleStats }: DriverStatsCardsProps) {
  const statsData = [
    {
      title: 'Total Driver',
      value: stats.totalDrivers.toString(),
      icon: Users,
      description: 'Total driver terdaftar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Driver Aktif',
      value: stats.activeDrivers.toString(),
      icon: UserCheck,
      description: 'Driver yang sedang aktif',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Driver Tidak Aktif',
      value: stats.inactiveDrivers.toString(),
      icon: UserX,
      description: 'Driver tidak aktif',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Total Pengiriman',
      value: stats.totalDeliveries.toString(),
      icon: Activity,
      description: 'Total pengiriman dilakukan',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Rating Rata-rata',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A',
      icon: Star,
      description: 'Rating rata-rata driver',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'SIM Akan Habis',
      value: stats.expiringSoonCount.toString(),
      icon: AlertTriangle,
      description: 'SIM yang akan habis (30 hari)',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Statistik Driver</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleStats}
          className="flex items-center gap-2"
        >
          {showStats ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Sembunyikan
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Tampilkan
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsData.map((stat) => (
            <Card key={stat.title} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
