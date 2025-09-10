'use client'

import { useState } from 'react'
import { PermissionGuard } from '@/components/guards/permission-guard'
import { PageContainer } from '@/components/layout'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '../../../components/ui/badge'
import { Plus, Search, Filter, Package, AlertTriangle, CheckCircle, XCircle, Bot, TrendingUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  InventoryTableView,
  InventoryGridView,
  InventoryStats, 
  InventoryAlerts,
  AIInventoryPredictor
} from './components'
import { useResponsive } from './hooks/use-responsive'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Link from 'next/link'

type InventoryStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED'
type MaterialCategory = 'PROTEIN' | 'VEGETABLE' | 'GRAIN' | 'SPICE' | 'OIL'

interface InventoryItem {
  id: string
  rawMaterial: {
    id: string
    name: string
    category: MaterialCategory
    unit: string
  }
  supplier: {
    id: string
    name: string
    contactName: string
  }
  quantity: number
  minimumStock: number
  purchasePrice: number
  expiryDate: Date
  batchNumber: string
  status: InventoryStatus
  location: string
  receivedDate: Date
  createdAt: Date
  updatedAt: Date
}

export default function InventoryPage() {
  return (
    <PermissionGuard permission="inventory.view">
      <InventoryContent />
    </PermissionGuard>
  )
}

function InventoryContent() {
  const { isMobile } = useResponsive()
  const queryClient = useQueryClient()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | 'ALL'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | 'ALL'>('ALL')
  const [isAIPredictorOpen, setIsAIPredictorOpen] = useState(false)

  // Fetch inventory data
  const { data: inventoryItems = [], isLoading, refetch } = useQuery({
    queryKey: ['inventory', searchTerm, statusFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter)
      
      const response = await fetch(`/api/inventory?${params}`)
      if (!response.ok) throw new Error('Failed to fetch inventory')
      return response.json()
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete inventory item')
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success('Item inventory berhasil dihapus!')
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      refetch()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus item inventory')
    }
  })

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus item "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const getStatusIcon = (status: InventoryStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
      case 'LOW_STOCK':
        return <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
      case 'OUT_OF_STOCK':
        return <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
      case 'EXPIRED':
        return <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      LOW_STOCK: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      OUT_OF_STOCK: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      EXPIRED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    }
    
    const statusKey = status as InventoryStatus
    
    return (
      <Badge className={variants[statusKey] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}>
        {getStatusIcon(statusKey)}
        <span className="ml-1">
          {status.replace('_', ' ')}
        </span>
      </Badge>
    )
  }

  return (
    <PageContainer
      title="Inventory Management"
      description="Kelola stok bahan baku dan pantau ketersediaan untuk produksi makanan"
      showBreadcrumb={true}
      actions={
        <div className="flex gap-2">
          <Dialog open={isAIPredictorOpen} onOpenChange={setIsAIPredictorOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 border-border transition-all duration-200"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Inventory Predictor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">🤖 AI Inventory Predictor</DialogTitle>
              </DialogHeader>
              <AIInventoryPredictor
                onSuccess={() => {
                  setIsAIPredictorOpen(false)
                  refetch()
                }}
              />
            </DialogContent>
          </Dialog>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/dashboard/inventory/add">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Stok
            </Link>
          </Button>
        </div>
      }
    >
      {/* Stats Cards */}
      <InventoryStats />

      {/* Alerts */}
      <InventoryAlerts />

      {/* Filters */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Package className="w-5 h-5 mr-2 text-primary" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cari bahan baku, supplier, atau batch number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: InventoryStatus | 'ALL') => setStatusFilter(value)}>
              <SelectTrigger className="w-48 bg-background border-border text-foreground">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="ALL" className="text-foreground hover:bg-muted">Semua Status</SelectItem>
                <SelectItem value="AVAILABLE" className="text-foreground hover:bg-muted">Available</SelectItem>
                <SelectItem value="LOW_STOCK" className="text-foreground hover:bg-muted">Low Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK" className="text-foreground hover:bg-muted">Out of Stock</SelectItem>
                <SelectItem value="EXPIRED" className="text-foreground hover:bg-muted">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(value: MaterialCategory | 'ALL') => setCategoryFilter(value)}>
              <SelectTrigger className="w-48 bg-background border-border text-foreground">
                <SelectValue placeholder="Filter Kategori" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="ALL" className="text-foreground hover:bg-muted">Semua Kategori</SelectItem>
                <SelectItem value="PROTEIN" className="text-foreground hover:bg-muted">Protein</SelectItem>
                <SelectItem value="VEGETABLE" className="text-foreground hover:bg-muted">Sayuran</SelectItem>
                <SelectItem value="GRAIN" className="text-foreground hover:bg-muted">Karbohidrat</SelectItem>
                <SelectItem value="SPICE" className="text-foreground hover:bg-muted">Bumbu</SelectItem>
                <SelectItem value="OIL" className="text-foreground hover:bg-muted">Minyak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data View - Auto Responsive */}
      {isMobile ? (
        // Mobile: Grid view
        <InventoryGridView
          data={inventoryItems}
          isLoading={isLoading}
          onRefetch={refetch}
          getStatusBadge={getStatusBadge}
          onDelete={handleDelete}
        />
      ) : (
        // Tablet & Desktop: Table view
        <InventoryTableView
          data={inventoryItems}
          isLoading={isLoading}
          onRefetch={refetch}
          getStatusBadge={getStatusBadge}
          onDelete={handleDelete}
        />
      )}
    </PageContainer>
  )
}
