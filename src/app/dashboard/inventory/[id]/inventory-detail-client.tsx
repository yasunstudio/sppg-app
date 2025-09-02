'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Package, Calendar, DollarSign, User, Building } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

interface InventoryDetailClientProps {
  id: string
}

export default function InventoryDetailClient({ id }: InventoryDetailClientProps) {
  const router = useRouter()

  const { data: inventoryItem, isLoading, error } = useQuery({
    queryKey: ['inventory', id],
    queryFn: async () => {
      const response = await fetch(`/api/inventory/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Item inventory tidak ditemukan')
        }
        throw new Error('Failed to fetch inventory item')
      }
      return response.json()
    }
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      GOOD: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      FAIR: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800', 
      POOR: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
      PENDING: 'bg-muted/50 text-muted-foreground border-border'
    }
    
    const statusLabels = {
      GOOD: 'Baik',
      FAIR: 'Cukup',
      POOR: 'Buruk', 
      REJECTED: 'Ditolak',
      PENDING: 'Pending'
    }

    const statusKey = status as keyof typeof variants
    
    return (
      <Badge className={`${variants[statusKey] || 'bg-muted/50 text-muted-foreground border-border'} border`}>
        {statusLabels[statusKey] || status}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      PROTEIN: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
      VEGETABLE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      GRAIN: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      SPICE: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      OIL: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    }

    const categoryLabels = {
      PROTEIN: 'Protein',
      VEGETABLE: 'Sayuran',
      GRAIN: 'Karbohidrat',
      SPICE: 'Bumbu',
      OIL: 'Minyak'
    }

    const categoryKey = category as keyof typeof variants
    
    return (
      <Badge variant="outline" className={`${variants[categoryKey] || 'bg-muted/50 text-muted-foreground border-border'} border`}>
        {categoryLabels[categoryKey] || category}
      </Badge>
    )
  }

  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="border-border text-foreground hover:bg-muted">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <div className="h-8 bg-muted animate-pulse rounded w-64"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-96 mt-2"></div>
          </div>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-muted animate-pulse rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !inventoryItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="border-border text-foreground hover:bg-muted">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Item Tidak Ditemukan</h1>
            <p className="text-muted-foreground">
              Item inventory yang Anda cari tidak ditemukan atau telah dihapus.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="border-border text-foreground hover:bg-muted">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {inventoryItem.rawMaterial?.name || 'Detail Item Inventory'}
            </h1>
            <p className="text-muted-foreground">
              Informasi lengkap tentang item inventory
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={`/dashboard/inventory/${id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="w-5 h-5" />
              Informasi Dasar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nama Bahan Baku</label>
              <p className="text-lg font-semibold text-foreground">{inventoryItem.rawMaterial?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Kategori</label>
              <div className="mt-1">
                {getCategoryBadge(inventoryItem.rawMaterial?.category)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Deskripsi</label>
              <p className="text-sm text-foreground">{inventoryItem.rawMaterial?.description || 'Tidak ada deskripsi'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status Kualitas</label>
              <div className="mt-1">
                {getStatusBadge(inventoryItem.qualityStatus)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quantity & Pricing */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <DollarSign className="w-5 h-5" />
              Quantity & Harga
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Quantity</label>
              <p className="text-lg font-semibold text-foreground">
                {inventoryItem.quantity} {inventoryItem.rawMaterial?.unit}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Harga per Unit</label>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(inventoryItem.unitPrice)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Harga</label>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(inventoryItem.totalPrice)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Information */}
        {inventoryItem.supplier && (
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Building className="w-5 h-5" />
                Informasi Supplier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nama Supplier</label>
                <p className="text-lg font-semibold text-foreground">{inventoryItem.supplier.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                <p className="text-sm text-foreground">{inventoryItem.supplier.contactName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm text-foreground">{inventoryItem.supplier.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Telepon</label>
                <p className="text-sm text-foreground">{inventoryItem.supplier.phone}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Batch & Expiry Information */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5" />
              Informasi Batch & Kadaluarsa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Batch Number</label>
              <p className="text-lg font-semibold">
                {inventoryItem.batchNumber ? (
                  <code className="text-sm bg-muted/50 dark:bg-muted/20 px-2 py-1 rounded border border-border text-foreground">
                    {inventoryItem.batchNumber}
                  </code>
                ) : (
                  <span className="text-muted-foreground">Tidak ada batch number</span>
                )}
              </p>
            </div>
            {inventoryItem.expiryDate && (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tanggal Kadaluarsa</label>
                  <p className="text-lg font-semibold text-foreground">{formatDate(inventoryItem.expiryDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sisa Hari</label>
                  <p className={`text-lg font-semibold ${
                    calculateDaysUntilExpiry(inventoryItem.expiryDate) <= 7 
                      ? 'text-red-600 dark:text-red-400' 
                      : calculateDaysUntilExpiry(inventoryItem.expiryDate) <= 30
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-green-600 dark:text-green-400'
                  }`}>
                    {calculateDaysUntilExpiry(inventoryItem.expiryDate)} hari
                  </p>
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dibuat</label>
              <p className="text-sm text-foreground">{formatDate(inventoryItem.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Terakhir Diupdate</label>
              <p className="text-sm text-foreground">{formatDate(inventoryItem.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
