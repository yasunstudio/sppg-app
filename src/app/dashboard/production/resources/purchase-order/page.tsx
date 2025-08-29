"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Fetch suppliers for purchase order
async function fetchSuppliers() {
  const response = await fetch("/api/suppliers")
  if (!response.ok) {
    throw new Error("Failed to fetch suppliers")
  }
  const data = await response.json()
  return data.data || []
}

// Fetch low stock materials
async function fetchLowStockMaterials() {
  const response = await fetch("/api/raw-materials?lowStock=true")
  if (!response.ok) {
    throw new Error("Failed to fetch low stock materials")
  }
  const data = await response.json()
  return data.data || []
}

export default function PurchaseOrderPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    supplierId: "",
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: "",
    notes: ""
  })
  const [orderItems, setOrderItems] = useState<any[]>([])

  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  })

  const { data: lowStockMaterials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ["low-stock-materials"],
    queryFn: fetchLowStockMaterials,
  })

  const addOrderItem = () => {
    setOrderItems([...orderItems, {
      materialId: "",
      quantity: "",
      unitPrice: "",
      notes: ""
    }])
  }

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const updateOrderItem = (index: number, field: string, value: string) => {
    const updated = [...orderItems]
    updated[index] = { ...updated[index], [field]: value }
    setOrderItems(updated)
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0
      const unitPrice = parseFloat(item.unitPrice) || 0
      return sum + (quantity * unitPrice)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (orderItems.length === 0) {
      toast.error("Please add at least one item to the order")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: orderItems.map(item => ({
            ...item,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice)
          })),
          totalAmount: calculateTotal()
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create purchase order")
      }

      toast.success("Purchase order created successfully")
      router.push("/dashboard/production/resources")
    } catch (error) {
      console.error("Error creating purchase order:", error)
      toast.error("Failed to create purchase order")
    } finally {
      setIsLoading(false)
    }
  }

  const addLowStockItem = (material: any) => {
    const existing = orderItems.find(item => item.materialId === material.id)
    if (existing) {
      toast.error("This material is already in the order")
      return
    }

    setOrderItems([...orderItems, {
      materialId: material.id,
      materialName: material.name,
      quantity: (material.minimumStock - material.currentStock).toString(),
      unitPrice: material.unitPrice?.toString() || "",
      notes: `Restock for ${material.name}`
    }])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Purchase Order</h1>
          <p className="text-muted-foreground">
            Order raw materials from suppliers
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Details</CardTitle>
              <CardDescription>
                Fill in the purchase order information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select 
                      value={formData.supplierId} 
                      onValueChange={(value) => setFormData(prev => ({...prev, supplierId: value}))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliersLoading ? (
                          <SelectItem value="loading" disabled>Loading suppliers...</SelectItem>
                        ) : (
                          suppliers.map((supplier: any) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderDate">Order Date</Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={formData.orderDate}
                      onChange={(e) => setFormData(prev => ({...prev, orderDate: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Expected Delivery</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData(prev => ({...prev, deliveryDate: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Additional notes for this purchase order..."
                    rows={2}
                  />
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Order Items</Label>
                    <Button type="button" variant="outline" onClick={addOrderItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  {orderItems.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Material</Label>
                          <Input
                            value={item.materialName || ""}
                            placeholder="Enter material name"
                            onChange={(e) => updateOrderItem(index, "materialName", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            placeholder="0"
                            onChange={(e) => updateOrderItem(index, "quantity", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Unit Price (Rp)</Label>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            placeholder="0"
                            onChange={(e) => updateOrderItem(index, "unitPrice", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input
                          value={item.notes}
                          placeholder="Item notes..."
                          onChange={(e) => updateOrderItem(index, "notes", e.target.value)}
                        />
                      </div>

                      <div className="text-right">
                        <span className="font-medium">
                          Subtotal: Rp {((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}

                  {orderItems.length > 0 && (
                    <div className="text-right p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">
                        Total: Rp {calculateTotal().toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || orderItems.length === 0}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Create Order
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Materials</CardTitle>
              <CardDescription>
                Materials that need immediate reordering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {materialsLoading ? (
                  <div className="text-center py-4">Loading materials...</div>
                ) : lowStockMaterials.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No low stock materials
                  </div>
                ) : (
                  lowStockMaterials.map((material: any) => (
                    <div key={material.id} className="p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{material.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Current: {material.currentStock} {material.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Minimum: {material.minimumStock} {material.unit}
                          </div>
                        </div>
                        <Badge variant="destructive">
                          Low Stock
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => addLowStockItem(material)}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add to Order
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
