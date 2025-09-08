'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, Package, Calendar, MapPin } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

interface InventoryGridViewProps {
  data: any[]
  isLoading: boolean
  onRefetch: () => void
  getStatusBadge: (status: string) => React.ReactNode
  onDelete: (id: string, name: string) => void
}

export function InventoryGridView({ 
  data, 
  isLoading, 
  onRefetch, 
  getStatusBadge, 
  onDelete 
}: InventoryGridViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Tidak ada data inventory
          </h3>
          <p className="text-muted-foreground mb-4">
            Mulai tambahkan item inventory untuk melihat data di sini.
          </p>
          <Button asChild>
            <Link href="/dashboard/inventory/add">
              <Package className="w-4 h-4 mr-2" />
              Tambah Item
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <Card key={item.id} className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {item.rawMaterial?.name || 'N/A'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.rawMaterial?.unit || 'N/A'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border">
                    <DropdownMenuItem asChild>
                      <Link 
                        href={`/dashboard/inventory/${item.id}`}
                        className="flex items-center text-foreground hover:bg-muted cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href={`/dashboard/inventory/${item.id}/edit`}
                        className="flex items-center text-foreground hover:bg-muted cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(item.id, item.rawMaterial?.name || 'Item')}
                      className="flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Category and Status */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-border bg-muted/30 text-foreground">
                  {item.rawMaterial?.category || 'N/A'}
                </Badge>
                {getStatusBadge(item.status)}
              </div>

              {/* Supplier Info */}
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="w-3 h-3 mr-1" />
                  Supplier
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {item.supplier?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.supplier?.contactName || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-semibold text-foreground">{item.quantity}</p>
                  <p className="text-xs text-muted-foreground">
                    Min: {item.minimumStock}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Harga Unit</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(item.purchasePrice)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total: {formatCurrency(item.purchasePrice * item.quantity)}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Kadaluarsa
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDate(item.expiryDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    Lokasi
                  </span>
                  <span className="font-medium text-foreground">
                    {item.location}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Batch</span>
                  <span className="font-medium text-foreground">
                    {item.batchNumber}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
