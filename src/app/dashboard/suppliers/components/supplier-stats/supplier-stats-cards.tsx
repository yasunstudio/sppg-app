'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react'
import type { SupplierStats } from '../utils/supplier-types'

interface SupplierStatsCardsProps {
  stats: SupplierStats | null
  loading: boolean
}

export function SupplierStatsCards({ stats, loading }: SupplierStatsCardsProps) {
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
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Supplier',
      value: stats.totalSuppliers.toLocaleString('id-ID'),
      description: `${stats.activeSuppliers} aktif, ${stats.inactiveSuppliers} tidak aktif`,
      icon: Building2,
      variant: 'default' as const,
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Supplier Aktif',
      value: stats.activeSuppliers.toLocaleString('id-ID'),
      description: `${Math.round((stats.activeSuppliers / stats.totalSuppliers) * 100)}% dari total`,
      icon: Users,
      variant: 'default' as const,
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Total Pesanan',
      value: stats.totalPurchaseOrders.toLocaleString('id-ID'),
      description: `${stats.averageOrdersPerSupplier.toFixed(1)} rata-rata per supplier`,
      icon: ShoppingCart,
      variant: 'default' as const,
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Rata-rata Pesanan',
      value: stats.averageOrdersPerSupplier.toFixed(1),
      description: 'Pesanan per supplier',
      icon: TrendingUp,
      variant: 'default' as const,
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="bg-card dark:bg-card border-border dark:border-border hover:shadow-md dark:hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground dark:text-foreground mb-1">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
