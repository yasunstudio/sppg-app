'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Database, 
  Globe, 
  Bell, 
  DollarSign, 
  Shield, 
  Wrench,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { CONFIG_CATEGORIES } from '../utils/system-config-schemas'

interface SystemConfig {
  id: string
  key: string
  value: string
  description: string | null
  dataType: string
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SystemConfigStatsCardsProps {
  configs: SystemConfig[]
  groupedConfigs: { [category: string]: SystemConfig[] }
}

export function SystemConfigStatsCards({ configs, groupedConfigs }: SystemConfigStatsCardsProps) {
  const totalConfigs = configs.length
  const activeConfigs = configs.filter(config => config.isActive).length
  const inactiveConfigs = totalConfigs - activeConfigs
  const totalCategories = Object.keys(groupedConfigs).length

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      GENERAL: Settings,
      DATABASE: Database,
      EMAIL: Globe,
      NOTIFICATIONS: Bell,
      PAYMENT: DollarSign,
      SECURITY: Shield,
      API: Wrench,
      UI: Settings
    }
    
    const IconComponent = icons[category] || Settings
    return IconComponent
  }

  const categoryStats = Object.entries(groupedConfigs).map(([category, categoryConfigs]) => {
    const activeCount = categoryConfigs.filter(config => config.isActive).length
    const Icon = getCategoryIcon(category)
    
    return {
      category,
      name: CONFIG_CATEGORIES[category as keyof typeof CONFIG_CATEGORIES] || category,
      icon: Icon,
      total: categoryConfigs.length,
      active: activeCount,
      inactive: categoryConfigs.length - activeCount
    }
  })

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">
              Total Konfigurasi
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{totalConfigs}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {totalCategories} kategori
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">
              Konfigurasi Aktif
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeConfigs}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {totalConfigs > 0 ? Math.round((activeConfigs / totalConfigs) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">
              Konfigurasi Nonaktif
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{inactiveConfigs}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {totalConfigs > 0 ? Math.round((inactiveConfigs / totalConfigs) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">
              Kategori
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{totalCategories}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              kelompok konfigurasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Breakdown per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.category}
                  className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
                    <div>
                      <p className="text-sm font-medium dark:text-white">{stat.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        {stat.total} konfigurasi
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Badge 
                      variant="default" 
                      className="text-xs dark:bg-green-600 dark:text-white"
                    >
                      {stat.active}
                    </Badge>
                    {stat.inactive > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs dark:bg-gray-600 dark:text-gray-300"
                      >
                        {stat.inactive}
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
