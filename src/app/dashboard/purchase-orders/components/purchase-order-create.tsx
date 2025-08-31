"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Save, ShoppingCart, Plus, Trash2, Calendar } from "lucide-react"
import { toast } from "sonner"

const purchaseOrderItemSchema = z.object({
  rawMaterialId: z.string().min(1, "Raw material is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
  notes: z.string().optional(),
})

const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  expectedDelivery: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(purchaseOrderItemSchema).min(1, "At least one item is required"),
})

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>

interface Supplier {
  id: string
  name: string
  contactName: string
}

interface RawMaterial {
  id: string
  name: string
  unit: string
  category: string
}

export function PurchaseOrderCreate() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      items: [{ rawMaterialId: "", quantity: 0, unit: "", unitPrice: 0, notes: "" }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  })

  const watchedItems = watch("items")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, rawMaterialsRes] = await Promise.all([
          fetch('/api/suppliers?limit=100&status=active'),
          fetch('/api/raw-materials?limit=100')
        ])

        if (suppliersRes.ok && rawMaterialsRes.ok) {
          const suppliersData = await suppliersRes.json()
          const rawMaterialsData = await rawMaterialsRes.json()
          
          if (suppliersData.success) setSuppliers(suppliersData.data)
          if (rawMaterialsData.success) setRawMaterials(rawMaterialsData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load suppliers and raw materials')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateTotalAmount = () => {
    return watchedItems.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice)
    }, 0)
  }

  const onSubmit = async (data: PurchaseOrderFormData) => {
    setIsSubmitting(true)
    
    try {
      const submitData = {
        ...data,
        expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery).toISOString() : null,
        totalAmount: calculateTotalAmount(),
        items: data.items.map(item => ({
          ...item,
          totalPrice: item.quantity * item.unitPrice
        }))
      }

      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create purchase order')
      }

      const result = await response.json()
      toast.success('Purchase order created successfully!')
      router.push(`/dashboard/purchase-orders/${result.data.id}`)
    } catch (error) {
      console.error('Error creating purchase order:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create purchase order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRawMaterialChange = (index: number, rawMaterialId: string) => {
    const rawMaterial = rawMaterials.find(rm => rm.id === rawMaterialId)
    if (rawMaterial) {
      setValue(`items.${index}.unit`, rawMaterial.unit)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Purchase Order</h1>
          <p className="text-muted-foreground">
            Create a new purchase order for procurement management
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Information
            </CardTitle>
            <CardDescription>
              Basic purchase order details and supplier information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplierId">
                  Supplier <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('supplierId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name} - {supplier.contactName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.supplierId && (
                  <p className="text-sm text-red-500">{errors.supplierId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">Expected Delivery</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="expectedDelivery"
                    type="date"
                    {...register('expectedDelivery')}
                    className="pl-10"
                  />
                </div>
                {errors.expectedDelivery && (
                  <p className="text-sm text-red-500">{errors.expectedDelivery.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes or special instructions"
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Order Items
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ rawMaterialId: "", quantity: 0, unit: "", unitPrice: 0, notes: "" })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardTitle>
            <CardDescription>
              Add raw materials and specify quantities for this purchase order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Raw Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Select 
                          onValueChange={(value) => {
                            setValue(`items.${index}.rawMaterialId`, value)
                            handleRawMaterialChange(index, value)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {rawMaterials.map((material) => (
                              <SelectItem key={material.id} value={material.id}>
                                {material.name} ({material.category})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.items?.[index]?.rawMaterialId && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.items[index]?.rawMaterialId?.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          className="w-24"
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.items[index]?.quantity?.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          {...register(`items.${index}.unit`)}
                          className="w-20"
                          readOnly
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                          className="w-24"
                        />
                        {errors.items?.[index]?.unitPrice && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.items[index]?.unitPrice?.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          Rp {((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)).toLocaleString('id-ID')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Input
                          {...register(`items.${index}.notes`)}
                          placeholder="Optional notes"
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {errors.items && (
              <p className="text-sm text-red-500 mt-2">{errors.items.message}</p>
            )}

            {/* Total Amount */}
            <div className="flex justify-end mt-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-bold">
                  Rp {calculateTotalAmount().toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Purchase Order
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
