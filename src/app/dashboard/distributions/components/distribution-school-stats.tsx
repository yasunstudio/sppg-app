'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock
} from 'lucide-react'

interface DistributionSchool {
  id: string
  plannedPortions: number
  actualPortions: number | null
  distribution: {
    distributionDate: string
    status: string
  }
}

interface DistributionSchoolStatsProps {
  distributionSchools: DistributionSchool[]
}

export function DistributionSchoolStats({ distributionSchools }: DistributionSchoolStatsProps) {
  const stats = {
    total: distributionSchools.length,
    completed: distributionSchools.filter(ds => ds.actualPortions !== null).length,
    pending: distributionSchools.filter(ds => ds.actualPortions === null).length,
    totalPlanned: distributionSchools.reduce((sum, ds) => sum + ds.plannedPortions, 0),
    totalActual: distributionSchools.reduce((sum, ds) => sum + (ds.actualPortions || 0), 0),
    overDelivered: distributionSchools.filter(ds => 
      ds.actualPortions !== null && ds.actualPortions > ds.plannedPortions
    ).length,
    underDelivered: distributionSchools.filter(ds => 
      ds.actualPortions !== null && ds.actualPortions < ds.plannedPortions
    ).length,
    perfectDeliveries: distributionSchools.filter(ds => 
      ds.actualPortions !== null && ds.actualPortions === ds.plannedPortions
    ).length
  }

  const completionRate = stats.total > 0 ? (stats.completed / stats.total * 100) : 0
  const accuracyRate = stats.completed > 0 ? (stats.perfectDeliveries / stats.completed * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Schools */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {stats.completed} completed
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stats.pending} pending
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.completed} of {stats.total} schools delivered
          </p>
        </CardContent>
      </Card>

      {/* Total Portions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portions</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalActual.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            of {stats.totalPlanned.toLocaleString()} planned
          </p>
        </CardContent>
      </Card>

      {/* Delivery Accuracy */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accuracyRate.toFixed(1)}%</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span className="text-green-600">{stats.perfectDeliveries} perfect</span>
            <span>•</span>
            <span className="text-blue-600">{stats.overDelivered} over</span>
            <span>•</span>
            <span className="text-red-600">{stats.underDelivered} under</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
