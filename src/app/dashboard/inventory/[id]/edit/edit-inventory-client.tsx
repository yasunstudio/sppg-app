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
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <div className="h-8 bg-muted animate-pulse rounded w-64"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-96 mt-2"></div>
          </div>
        </div>
        <Card>
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
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Item Tidak Ditemukan</h1>
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
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Item Inventory</h1>
          <p className="text-muted-foreground">
            Edit informasi item {inventoryItem.rawMaterial?.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Informasi Item Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Raw Material */}
              <div className="space-y-2">
                <Label htmlFor="rawMaterialId">
                  Bahan Baku <span className="text-red-500">*</span>
                </Label>
                <Select 
                  onValueChange={(value) => setValue('rawMaterialId', value)}
                  disabled={loadingMaterials}
                  defaultValue={inventoryItem.rawMaterialId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingMaterials ? "Loading..." : "Pilih bahan baku"} />
                  </SelectTrigger>
                  <SelectContent>
                    {rawMaterials.map((material: any) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} - {material.category} ({material.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.rawMaterialId && (
                  <p className="text-sm text-red-500">{errors.rawMaterialId.message}</p>
                )}
              </div>

              {/* Supplier */}
              <div className="space-y-2">
                <Label htmlFor="supplierId">Supplier</Label>
                <Select 
                  onValueChange={(value) => setValue('supplierId', value === 'none' ? undefined : value)}
                  disabled={loadingSuppliers}
                  defaultValue={inventoryItem.supplierId || 'none'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingSuppliers ? "Loading..." : "Pilih supplier (opsional)"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada supplier</SelectItem>
                    {suppliers.map((supplier: any) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Masukkan jumlah"
                  {...register('quantity')}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
              </div>

              {/* Unit Price */}
              <div className="space-y-2">
                <Label htmlFor="unitPrice">
                  Harga per Unit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Masukkan harga per unit"
                  {...register('unitPrice')}
                />
                {errors.unitPrice && (
                  <p className="text-sm text-red-500">{errors.unitPrice.message}</p>
                )}
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Tanggal Kadaluarsa</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register('expiryDate')}
                />
              </div>

              {/* Batch Number */}
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  placeholder="Masukkan batch number"
                  {...register('batchNumber')}
                />
              </div>

              {/* Quality Status */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="qualityStatus">Status Kualitas</Label>
                <Select 
                  onValueChange={(value) => setValue('qualityStatus', value as any)}
                  defaultValue={inventoryItem.qualityStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status kualitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOOD">Baik</SelectItem>
                    <SelectItem value="FAIR">Cukup</SelectItem>
                    <SelectItem value="POOR">Buruk</SelectItem>
                    <SelectItem value="REJECTED">Ditolak</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={updateMutation.isPending}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="flex items-center gap-2"
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
