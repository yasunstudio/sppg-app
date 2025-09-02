'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Clock, Package } from 'lucide-react'

export function InventoryAlerts() {
  const { data: alerts } = useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: async () => {
      const response = await fetch('/api/inventory/alerts')
      if (!response.ok) throw new Error('Failed to fetch alerts')
      return response.json()
    }
  })

  if (!alerts || (!alerts.lowStock?.length && !alerts.nearExpiry?.length && !alerts.expired?.length)) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600 dark:text-green-400">
            <Package className="w-5 h-5 mr-2" />
            Inventory Status: All Good!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tidak ada alert inventory saat ini. Semua bahan baku dalam kondisi baik.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Low Stock Alerts */}
      {alerts.lowStock?.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-300">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Low Stock Alert ({alerts.lowStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.lowStock.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">
                      {item.rawMaterial.category}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{item.rawMaterial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stok: {item.quantity} {item.rawMaterial.unit} (Min: {item.minimumStock})
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted">
                    Restock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Near Expiry Alerts */}
      {alerts.nearExpiry?.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
              <Clock className="w-5 h-5 mr-2" />
              Near Expiry Alert ({alerts.nearExpiry.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.nearExpiry.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 dark:border-orange-700">
                      {item.rawMaterial.category}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{item.rawMaterial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Kadaluarsa: {new Date(item.expiryDate).toLocaleDateString('id-ID')} - Batch: {item.batchNumber}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted">
                    Prioritas Pakai
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expired Alerts */}
      {alerts.expired?.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700 dark:text-red-300">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Expired Items ({alerts.expired.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.expired.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700">
                      {item.rawMaterial.category}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{item.rawMaterial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Kadaluarsa: {new Date(item.expiryDate).toLocaleDateString('id-ID')} - Batch: {item.batchNumber}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                    Buang
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
