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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
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
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Low Stock Alert ({alerts.lowStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.lowStock.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {item.rawMaterial.category}
                    </Badge>
                    <div>
                      <p className="font-medium">{item.rawMaterial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stok: {item.quantity} {item.rawMaterial.unit} (Min: {item.minimumStock})
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
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
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Clock className="w-5 h-5 mr-2" />
              Near Expiry Alert ({alerts.nearExpiry.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.nearExpiry.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      {item.rawMaterial.category}
                    </Badge>
                    <div>
                      <p className="font-medium">{item.rawMaterial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Kadaluarsa: {new Date(item.expiryDate).toLocaleDateString('id-ID')} - Batch: {item.batchNumber}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
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
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Expired Items ({alerts.expired.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.expired.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      {item.rawMaterial.category}
                    </Badge>
                    <div>
                      <p className="font-medium">{item.rawMaterial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Kadaluarsa: {new Date(item.expiryDate).toLocaleDateString('id-ID')} - Batch: {item.batchNumber}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive">
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
