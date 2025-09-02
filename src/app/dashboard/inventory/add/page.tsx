'use client'

import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
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

export default function AddInventoryPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      qualityStatus: 'GOOD'
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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: InventoryFormData) => {
      const response = await fetch('/api/inventory', {
        method: 'POST',
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
        throw new Error(errorData.error || 'Failed to create inventory item')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Item inventory berhasil ditambahkan!')
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      router.push('/dashboard/inventory')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menambahkan item inventory')
    }
  })

  const onSubmit = (data: InventoryFormData) => {
    createMutation.mutate(data)
  }

  const handleCancel = () => {
    router.push('/dashboard/inventory')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCancel}
          className="flex items-center gap-2 border-border hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tambah Item Inventory</h1>
          <p className="text-muted-foreground">
            Tambahkan item baru ke dalam inventory stok bahan baku
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Package className="w-5 h-5 text-primary" />
            Informasi Item Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Raw Material */}
              <div className="space-y-2">
                <Label htmlFor="rawMaterialId" className="text-foreground">
                  Bahan Baku <span className="text-red-500">*</span>
                </Label>
                <Select 
                  onValueChange={(value) => setValue('rawMaterialId', value)}
                  disabled={loadingMaterials}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder={loadingMaterials ? "Loading..." : "Pilih bahan baku"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {rawMaterials.map((material: any) => (
                      <SelectItem 
                        key={material.id} 
                        value={material.id}
                        className="text-foreground hover:bg-muted focus:bg-muted"
                      >
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
                <Label htmlFor="supplierId" className="text-foreground">Supplier</Label>
                <Select 
                  onValueChange={(value) => setValue('supplierId', value === 'none' ? undefined : value)}
                  disabled={loadingSuppliers}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder={loadingSuppliers ? "Loading..." : "Pilih supplier (opsional)"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="none" className="text-foreground hover:bg-muted focus:bg-muted">Tidak ada supplier</SelectItem>
                    {suppliers.map((supplier: any) => (
                      <SelectItem 
                        key={supplier.id} 
                        value={supplier.id}
                        className="text-foreground hover:bg-muted focus:bg-muted"
                      >
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-foreground">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Masukkan jumlah"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  {...register('quantity')}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
              </div>

              {/* Unit Price */}
              <div className="space-y-2">
                <Label htmlFor="unitPrice" className="text-foreground">
                  Harga per Unit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Masukkan harga per unit"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  {...register('unitPrice')}
                />
                {errors.unitPrice && (
                  <p className="text-sm text-red-500">{errors.unitPrice.message}</p>
                )}
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-foreground">Tanggal Kadaluarsa</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  className="bg-background border-border text-foreground"
                  {...register('expiryDate')}
                />
              </div>

              {/* Batch Number */}
              <div className="space-y-2">
                <Label htmlFor="batchNumber" className="text-foreground">Batch Number</Label>
                <Input
                  id="batchNumber"
                  placeholder="Masukkan batch number"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  {...register('batchNumber')}
                />
              </div>

              {/* Quality Status */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="qualityStatus" className="text-foreground">Status Kualitas</Label>
                <Select 
                  onValueChange={(value) => setValue('qualityStatus', value as any)}
                  defaultValue="GOOD"
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Pilih status kualitas" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="GOOD" className="text-foreground hover:bg-muted focus:bg-muted">Baik</SelectItem>
                    <SelectItem value="FAIR" className="text-foreground hover:bg-muted focus:bg-muted">Cukup</SelectItem>
                    <SelectItem value="POOR" className="text-foreground hover:bg-muted focus:bg-muted">Buruk</SelectItem>
                    <SelectItem value="REJECTED" className="text-foreground hover:bg-muted focus:bg-muted">Ditolak</SelectItem>
                    <SelectItem value="PENDING" className="text-foreground hover:bg-muted focus:bg-muted">Pending</SelectItem>
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
                disabled={createMutation.isPending}
                className="border-border hover:bg-muted text-foreground"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
