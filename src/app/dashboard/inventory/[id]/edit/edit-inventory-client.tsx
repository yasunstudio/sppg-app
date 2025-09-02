'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Loader2, Package } from 'lucide-react'
import { toast } from 'sonner'

const inventorySchema = z.object({
  rawMaterialId: z.string().min(1, 'Pilih bahan baku'),
  supplierId: z.string().optional(),
  quantity: z.string().min(1, 'Quantity tidak boleh kosong'),
  unitPrice: z.string().min(1, 'Harga tidak boleh kosong'),
  expiryDate: z.string().optional(),
  batchNumber: z.string().optional(),
  qualityStatus: z.enum(['GOOD', 'FAIR', 'POOR', 'REJECTED', 'PENDING'])
})

type InventoryFormData = z.infer<typeof inventorySchema>

interface EditInventoryClientProps {
  id: string
}

export default function EditInventoryClient({ id }: EditInventoryClientProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      qualityStatus: 'GOOD'
    }
  })

  // Fetch inventory item
  const { data: inventoryItem, isLoading: loadingItem } = useQuery({
    queryKey: ['inventory', id],
    queryFn: async () => {
      const response = await fetch(`/api/inventory/${id}`)
      if (!response.ok) throw new Error('Failed to fetch inventory item')
      return response.json()
    }
  })

  // Fetch raw materials
  const { data: rawMaterials = [], isLoading: loadingMaterials } = useQuery({
    queryKey: ['raw-materials'],
    queryFn: async () => {
      const response = await fetch('/api/raw-materials')
      if (!response.ok) throw new Error('Failed to fetch raw materials')
      return response.json()
    }
  })

  // Fetch suppliers
  const { data: suppliers = [], isLoading: loadingSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await fetch('/api/suppliers')
      if (!response.ok) throw new Error('Failed to fetch suppliers')
      return response.json()
    }
  })

  // Set form values when data loads
  useEffect(() => {
    if (inventoryItem) {
      reset({
        rawMaterialId: inventoryItem.rawMaterialId,
        supplierId: inventoryItem.supplierId || '',
        quantity: inventoryItem.quantity.toString(),
        unitPrice: inventoryItem.unitPrice.toString(),
        expiryDate: inventoryItem.expiryDate ? inventoryItem.expiryDate.split('T')[0] : '',
        batchNumber: inventoryItem.batchNumber || '',
        qualityStatus: inventoryItem.qualityStatus
      })
    }
  }, [inventoryItem, reset])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: InventoryFormData) => {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          quantity: Number(data.quantity),
          unitPrice: Number(data.unitPrice),
          expiryDate: data.expiryDate || null,
          supplierId: data.supplierId || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update inventory item')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Item inventory berhasil diupdate!')
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['inventory', id] })
      router.push(`/dashboard/inventory/${id}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengupdate item inventory')
    }
  })

  const onSubmit = (data: InventoryFormData) => {
    updateMutation.mutate(data)
  }

  const handleCancel = () => {
    router.push(`/dashboard/inventory/${id}`)
  }

  if (loadingItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" disabled className="border-border text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <div className="h-8 bg-muted animate-pulse rounded w-64"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-96 mt-2"></div>
          </div>
        </div>
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <div className="h-6 bg-muted animate-pulse rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                  <div className="h-10 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!inventoryItem) {
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
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCancel}
          className="flex items-center gap-2 border-border text-foreground hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Item Inventory</h1>
          <p className="text-muted-foreground">
            Edit informasi item {inventoryItem.rawMaterial?.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Package className="w-5 h-5" />
            Informasi Item Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Raw Material */}
              <div className="space-y-2">
                <Label htmlFor="rawMaterialId" className="text-foreground">
                  Bahan Baku <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <Select 
                  onValueChange={(value) => setValue('rawMaterialId', value)}
                  disabled={loadingMaterials}
                  defaultValue={inventoryItem.rawMaterialId}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder={loadingMaterials ? "Loading..." : "Pilih bahan baku"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {rawMaterials.map((material: any) => (
                      <SelectItem key={material.id} value={material.id} className="text-foreground hover:bg-muted">
                        {material.name} - {material.category} ({material.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.rawMaterialId && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.rawMaterialId.message}</p>
                )}
              </div>

              {/* Supplier */}
              <div className="space-y-2">
                <Label htmlFor="supplierId" className="text-foreground">Supplier</Label>
                <Select 
                  onValueChange={(value) => setValue('supplierId', value === 'none' ? undefined : value)}
                  disabled={loadingSuppliers}
                  defaultValue={inventoryItem.supplierId || 'none'}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder={loadingSuppliers ? "Loading..." : "Pilih supplier (opsional)"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="none" className="text-foreground hover:bg-muted">Tidak ada supplier</SelectItem>
                    {suppliers.map((supplier: any) => (
                      <SelectItem key={supplier.id} value={supplier.id} className="text-foreground hover:bg-muted">
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-foreground">
                  Quantity <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Masukkan jumlah"
                  {...register('quantity')}
                  className="bg-background border-border text-foreground focus:ring-ring"
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.quantity.message}</p>
                )}
              </div>

              {/* Unit Price */}
              <div className="space-y-2">
                <Label htmlFor="unitPrice" className="text-foreground">
                  Harga per Unit <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Masukkan harga per unit"
                  {...register('unitPrice')}
                  className="bg-background border-border text-foreground focus:ring-ring"
                />
                {errors.unitPrice && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.unitPrice.message}</p>
                )}
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-foreground">Tanggal Kadaluarsa</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register('expiryDate')}
                  className="bg-background border-border text-foreground focus:ring-ring"
                />
              </div>

              {/* Batch Number */}
              <div className="space-y-2">
                <Label htmlFor="batchNumber" className="text-foreground">Batch Number</Label>
                <Input
                  id="batchNumber"
                  placeholder="Masukkan batch number"
                  {...register('batchNumber')}
                  className="bg-background border-border text-foreground focus:ring-ring"
                />
              </div>

              {/* Quality Status */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="qualityStatus" className="text-foreground">Status Kualitas</Label>
                <Select 
                  onValueChange={(value) => setValue('qualityStatus', value as any)}
                  defaultValue={inventoryItem.qualityStatus}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Pilih status kualitas" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="GOOD" className="text-foreground hover:bg-muted">Baik</SelectItem>
                    <SelectItem value="FAIR" className="text-foreground hover:bg-muted">Cukup</SelectItem>
                    <SelectItem value="POOR" className="text-foreground hover:bg-muted">Buruk</SelectItem>
                    <SelectItem value="REJECTED" className="text-foreground hover:bg-muted">Ditolak</SelectItem>
                    <SelectItem value="PENDING" className="text-foreground hover:bg-muted">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={updateMutation.isPending}
                className="border-border text-foreground hover:bg-muted"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
