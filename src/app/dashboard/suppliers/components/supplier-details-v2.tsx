"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail,
  MapPin,
  Calendar,
  Package,
  ShoppingCart,
  Building2,
  User,
  Loader2,
  TrendingUp,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"
import { formatSupplierStatus, formatDate, formatPhone } from './utils/supplier-formatters'

interface Supplier {
  id: string
  name: string
  contactName: string
  phone: string
  email: string | null
  address: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    purchaseOrders: number
    inventory: number
  }
  inventory?: Array<{
    id: string
    quantity: number
    unitPrice: number
    rawMaterial: {
      name: string
      unit: string
    }
    expiryDate: string | null
    batchNumber: string | null
  }>
  purchaseOrders?: Array<{
    id: string
    poNumber: string
    orderDate: string
    status: string
    totalAmount: number | null
  }>
}

interface SupplierDetailsProps {
  supplierId?: string
}

export function SupplierDetails({ supplierId }: SupplierDetailsProps) {
  const router = useRouter()
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get ID from props or URL
  const id = supplierId || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null)

  useEffect(() => {
    if (!id) return

    const fetchSupplier = async () => {
      try {
        const response = await fetch(`/api/suppliers/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Supplier not found')
          }
          throw new Error('Failed to fetch supplier')
        }
        
        const data = await response.json()
        if (data.success) {
          setSupplier(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch supplier')
        }
      } catch (error) {
        console.error('Error fetching supplier:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch supplier')
      } finally {
        setLoading(false)
      }
    }

    fetchSupplier()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-muted dark:bg-muted animate-pulse rounded-full" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted dark:bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted dark:bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="h-10 w-24 bg-muted dark:bg-muted animate-pulse rounded" />
        </div>

        {/* Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardHeader>
                <div className="h-6 w-40 bg-muted dark:bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-muted dark:bg-muted animate-pulse rounded" />
                    <div className="h-4 w-32 bg-muted dark:bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardHeader>
                <div className="h-6 w-32 bg-muted dark:bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted dark:bg-muted animate-pulse rounded" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !supplier) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {error === 'Supplier not found' ? 'Supplier Tidak Ditemukan' : 'Terjadi Kesalahan'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {error === 'Supplier not found' 
              ? 'Supplier yang Anda cari tidak ditemukan atau telah dihapus.'
              : 'Gagal memuat detail supplier. Silakan coba lagi.'
            }
          </p>
          <Button onClick={() => router.push('/dashboard/suppliers')}>
            Kembali ke Daftar Supplier
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.push('/dashboard/suppliers')}
            className="h-10 w-10 rounded-full bg-background dark:bg-background border-border dark:border-border hover:bg-accent dark:hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary dark:text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
                {supplier.name}
              </h1>
              <p className="text-muted-foreground">
                Detail informasi dan riwayat transaksi supplier
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {formatSupplierStatus(supplier.isActive)}
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/suppliers/${supplier.id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-foreground">Informasi Dasar</CardTitle>
              <CardDescription className="text-muted-foreground">
                Detail kontak dan informasi supplier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Kontak</p>
                    <p className="font-medium text-foreground dark:text-foreground">{supplier.contactName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telepon</p>
                    <p className="font-medium text-foreground dark:text-foreground">{formatPhone(supplier.phone)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground dark:text-foreground">
                      {supplier.email || <span className="italic">Tidak ada</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Terdaftar</p>
                    <p className="font-medium text-foreground dark:text-foreground">{formatDate(supplier.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-border dark:bg-border" />
              
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Alamat</p>
                  <p className="font-medium text-foreground dark:text-foreground">{supplier.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Statistics Cards */}
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-foreground">Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-muted-foreground">Pesanan</span>
                </div>
                <span className="font-semibold text-foreground dark:text-foreground">
                  {supplier._count.purchaseOrders}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-muted-foreground">Item Inventori</span>
                </div>
                <span className="font-semibold text-foreground dark:text-foreground">
                  {supplier._count.inventory}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-foreground">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => router.push(`/dashboard/purchase-orders/create?supplier=${supplier.id}`)}
              >
                <ShoppingCart className="h-4 w-4" />
                Buat Pesanan Baru
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => router.push(`/dashboard/inventory?supplier=${supplier.id}`)}
              >
                <Package className="h-4 w-4" />
                Lihat Inventori
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
