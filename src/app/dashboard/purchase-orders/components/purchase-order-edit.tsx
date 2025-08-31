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
import { Badge } from "@/components/ui/badge"
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
import { ArrowLeft, Save, ShoppingCart, Plus, Trash2, Calendar, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

const purchaseOrderItemSchema = z.object({
  id: z.string().optional(),
  rawMaterialId: z.string().min(1, "Raw material is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
  notes: z.string().optional(),
})

const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  expectedDelivery: z.string().optional(),
  actualDelivery: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "PARTIALLY_RECEIVED"]),
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

interface PurchaseOrderEditProps {
  id: string
}

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "SHIPPED", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "DELIVERED", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "PARTIALLY_RECEIVED", label: "Partially Received", color: "bg-orange-100 text-orange-800" },
]

export function PurchaseOrderEdit({ id }: PurchaseOrderEditProps) {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalData, setOriginalData] = useState<any>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  })

  const watchedItems = watch("items")
  const watchedStatus = watch("status")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseOrderRes, suppliersRes, rawMaterialsRes] = await Promise.all([
          fetch(`/api/purchase-orders/${id}`),
          fetch('/api/suppliers?limit=100&status=active'),
          fetch('/api/raw-materials?limit=100')
        ])

        if (!purchaseOrderRes.ok) {
          if (purchaseOrderRes.status === 404) {
            throw new Error('Purchase order not found')
          }
          throw new Error('Failed to fetch purchase order')
        }

        const [purchaseOrderData, suppliersData, rawMaterialsData] = await Promise.all([
          purchaseOrderRes.json(),
          suppliersRes.json(),
          rawMaterialsRes.json()
        ])

        if (!purchaseOrderData.success) {
          throw new Error(purchaseOrderData.error || 'Failed to fetch purchase order')
        }

        const purchaseOrder = purchaseOrderData.data
        setOriginalData(purchaseOrder)

        // Reset form with existing data
        reset({
          supplierId: purchaseOrder.supplierId,
          expectedDelivery: purchaseOrder.expectedDelivery ? 
            new Date(purchaseOrder.expectedDelivery).toISOString().split('T')[0] : '',
          actualDelivery: purchaseOrder.actualDelivery ? 
            new Date(purchaseOrder.actualDelivery).toISOString().split('T')[0] : '',
          status: purchaseOrder.status,
          notes: purchaseOrder.notes || '',
          items: purchaseOrder.items.map((item: any) => ({
            id: item.id,
            rawMaterialId: item.rawMaterialId,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            notes: item.notes || '',
          }))
        })

        if (suppliersData.success) setSuppliers(suppliersData.data)
        if (rawMaterialsData.success) setRawMaterials(rawMaterialsData.data)
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load data')
        toast.error(error instanceof Error ? error.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, reset])

  const calculateTotalAmount = () => {
    return watchedItems?.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice)
    }, 0) || 0
  }

  const onSubmit = async (data: PurchaseOrderFormData) => {
    setIsSubmitting(true)
    
    try {
      const submitData = {
        ...data,
        expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery).toISOString() : null,
        actualDelivery: data.actualDelivery ? new Date(data.actualDelivery).toISOString() : null,
        totalAmount: calculateTotalAmount(),
        items: data.items.map(item => ({
          ...item,
          totalPrice: item.quantity * item.unitPrice
        }))
      }

      const response = await fetch(`/api/purchase-orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update purchase order')
      }

      const result = await response.json()
      toast.success('Purchase order updated successfully!')
      router.push(`/dashboard/purchase-orders/${result.data.id}`)
    } catch (error) {
      console.error('Error updating purchase order:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update purchase order')
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

  if (error || !originalData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Purchase Order Not Found</h1>
            <p className="text-muted-foreground">
              {error || 'The requested purchase order could not be found.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isDelivered = watchedStatus === 'DELIVERED'
  const isCancelled = watchedStatus === 'CANCELLED'
  const currentStatus = statusOptions.find(s => s.value === watchedStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Purchase Order #{originalData.poNumber}
          </h1>
          <p className="text-muted-foreground">
            Modify purchase order details and status
          </p>
        </div>
      </div>

      {(isDelivered || isCancelled) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isDelivered 
              ? "This purchase order has been delivered. Some fields may be restricted from editing."
              : "This purchase order has been cancelled. Changes may not be advisable."
            }
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Information
            </CardTitle>
            <CardDescription>
              Update purchase order details and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplierId">
                  Supplier <span className="text-red-500">*</span>
                </Label>
                <Select 
                  onValueChange={(value) => setValue('supplierId', value)}
                  defaultValue={originalData.supplierId}
                  disabled={isDelivered}
                >
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
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('status', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
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
                    disabled={isDelivered}
                  />
                </div>
                {errors.expectedDelivery && (
                  <p className="text-sm text-red-500">{errors.expectedDelivery.message}</p>
                )}
              </div>

              {(watchedStatus === 'DELIVERED' || watchedStatus === 'PARTIALLY_RECEIVED') && (
                <div className="space-y-2">
                  <Label htmlFor="actualDelivery">Actual Delivery</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="actualDelivery"
                      type="date"
                      {...register('actualDelivery')}
                      className="pl-10"
                    />
                  </div>
                  {errors.actualDelivery && (
                    <p className="text-sm text-red-500">{errors.actualDelivery.message}</p>
                  )}
                </div>
              )}
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
              {!isDelivered && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ rawMaterialId: "", quantity: 0, unit: "", unitPrice: 0, notes: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Modify raw materials and quantities for this purchase order
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
                          defaultValue={field.rawMaterialId}
                          disabled={isDelivered}
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
                          disabled={isDelivered}
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
                          disabled={isDelivered}
                        />
                        {errors.items?.[index]?.unitPrice && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.items[index]?.unitPrice?.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          Rp {((watchedItems?.[index]?.quantity || 0) * (watchedItems?.[index]?.unitPrice || 0)).toLocaleString('id-ID')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Input
                          {...register(`items.${index}.notes`)}
                          placeholder="Optional notes"
                          className="w-32"
                          disabled={isDelivered}
                        />
                      </TableCell>
                      <TableCell>
                        {fields.length > 1 && !isDelivered && (
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
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Purchase Order
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
