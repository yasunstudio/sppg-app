'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react'

export function InventoryStats() {
  const { data: stats } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: async () => {
      const response = await fetch('/api/inventory/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    }
  })

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.totalItems || 0}</div>
          <p className="text-xs text-muted-foreground">
            Total item dalam inventory
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Low Stock Alert</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.lowStockItems || 0}</div>
          <p className="text-xs text-muted-foreground">
            Item dengan stok rendah
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Expired Items</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expiredItems || 0}</div>
          <p className="text-xs text-muted-foreground">
            Item yang sudah kadaluarsa
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            Rp {(stats.totalValue || 0).toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-muted-foreground">
            Total nilai inventory
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
