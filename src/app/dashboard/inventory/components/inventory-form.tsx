'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

const inventorySchema = z.object({
  rawMaterialId: z.string().min(1, 'Pilih bahan baku'),
  supplierId: z.string().optional(),
  quantity: z.number().min(1, 'Quantity minimal 1'),
  unitPrice: z.number().min(0, 'Harga tidak boleh negatif'),
  expiryDate: z.string().optional(),
  batchNumber: z.string().optional()
})

type InventoryFormData = z.infer<typeof inventorySchema>

interface InventoryFormProps {
  onSuccess: () => void
}

export function InventoryForm({ onSuccess }: InventoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema)
  })

  // Fetch raw materials
  const { data: rawMaterials = [] } = useQuery({
    queryKey: ['raw-materials'],
    queryFn: async () => {
      const response = await fetch('/api/raw-materials')
      if (!response.ok) throw new Error('Failed to fetch raw materials')
      return response.json()
    }
  })

  // Fetch suppliers
  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await fetch('/api/suppliers')
      if (!response.ok) throw new Error('Failed to fetch suppliers')
      return response.json()
    }
  })

  const onSubmit = async (data: InventoryFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to create inventory item')
      }

      onSuccess()
    } catch (error) {
      console.error('Error creating inventory item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rawMaterialId" className="text-foreground">Bahan Baku</Label>
          <Select onValueChange={(value) => setValue('rawMaterialId', value)}>
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue placeholder="Pilih bahan baku" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {rawMaterials.map((material: any) => (
                <SelectItem key={material.id} value={material.id} className="text-foreground hover:bg-muted">
                  {material.name} ({material.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.rawMaterialId && (
            <p className="text-sm text-red-500 dark:text-red-400">{errors.rawMaterialId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierId" className="text-foreground">Supplier (Opsional)</Label>
          <Select onValueChange={(value) => setValue('supplierId', value)}>
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue placeholder="Pilih supplier" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {suppliers.map((supplier: any) => (
                <SelectItem key={supplier.id} value={supplier.id} className="text-foreground hover:bg-muted">
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.supplierId && (
            <p className="text-sm text-red-500 dark:text-red-400">{errors.supplierId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-foreground">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            placeholder="Masukkan quantity"
            className="bg-background border-border text-foreground focus:ring-ring"
          />
          {errors.quantity && (
            <p className="text-sm text-red-500 dark:text-red-400">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitPrice" className="text-foreground">Harga per Unit (Rp)</Label>
          <Input
            id="unitPrice"
            type="number"
            {...register('unitPrice', { valueAsNumber: true })}
            placeholder="Harga per unit"
            className="bg-background border-border text-foreground focus:ring-ring"
          />
          {errors.unitPrice && (
            <p className="text-sm text-red-500 dark:text-red-400">{errors.unitPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate" className="text-foreground">Tanggal Kadaluarsa (Opsional)</Label>
          <Input
            id="expiryDate"
            type="date"
            {...register('expiryDate')}
            className="bg-background border-border text-foreground focus:ring-ring"
          />
          {errors.expiryDate && (
            <p className="text-sm text-red-500 dark:text-red-400">{errors.expiryDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchNumber" className="text-foreground">Batch Number (Opsional)</Label>
          <Input
            id="batchNumber"
            {...register('batchNumber')}
            placeholder="Nomor batch produksi"
            className="bg-background border-border text-foreground focus:ring-ring"
          />
          {errors.batchNumber && (
            <p className="text-sm text-red-500 dark:text-red-400">{errors.batchNumber.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}
