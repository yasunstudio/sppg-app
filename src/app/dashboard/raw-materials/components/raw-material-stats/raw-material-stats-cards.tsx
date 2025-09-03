'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Loader2 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatNumber } from '../utils/raw-material-formatters'
import { RESPONSIVE_SPACING, LAYOUT_PATTERNS } from '../utils/raw-material-spacing'
import type { RawMaterialStats } from '../utils/raw-material-types'

interface RawMaterialStatsCardsProps {
  stats: RawMaterialStats | null
  loading: boolean
}

export function RawMaterialStatsCards({ stats, loading }: RawMaterialStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-gray-700" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-8 w-16 mb-2 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="flex items-center justify-center h-24">
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Memuat data...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statsData = [
    {
      title: 'Total Bahan Baku',
      value: formatNumber(stats.total),
      description: 'Item terdaftar',
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: stats.total > 0 ? '+' + stats.total : '0'
    },
    {
      title: 'Stok Rendah',
      value: formatNumber(stats.lowStock),
      description: 'Perlu restok',
      icon: AlertTriangle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      trend: stats.lowStock > 0 ? '!' : '✓'
    },
    {
      title: 'Kategori',
      value: formatNumber(stats.categories),
      description: 'Jenis kategori',
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: stats.categories + ' jenis'
    },
    {
      title: 'Total Nilai',
      value: formatCurrency(stats.totalValue),
      description: 'Nilai inventori',
      icon: DollarSign,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: 'IDR'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card 
            key={index} 
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                {stat.title === 'Stok Rendah' && stats.lowStock > 0 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700"
                  >
                    Perlu Perhatian
                  </Badge>
                )}
              </div>
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200",
                stat.bgColor
              )}>
                <IconComponent className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
