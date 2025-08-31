"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
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
  Truck, 
  Phone, 
  Mail,
  MapPin,
  Calendar,
  Package,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Trash2,
  Activity
} from "lucide-react"
import { toast } from "sonner"

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
  inventory: Array<{
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
  purchaseOrders: Array<{
    id: string
    poNumber: string
    orderDate: string
    status: string
    totalAmount: number | null
  }>
  items: Array<{
    id: string
    name: string
    unitPrice: number
  }>
}

export function SupplierDetails() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const handleToggleStatus = async () => {
    if (!supplier) return
    
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !supplier.isActive }),
      })

      if (!response.ok) {
        throw new Error('Failed to update supplier status')
      }

      const result = await response.json()
      setSupplier(result.data)
      toast.success(`Supplier ${!supplier.isActive ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      console.error('Error updating supplier status:', error)
      toast.error('Failed to update supplier status')
    }
  }

  const handleDelete = async () => {
    if (!supplier) return
    
    if (!confirm(`Are you sure you want to delete supplier "${supplier.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete supplier')
      }

      toast.success(`Supplier "${supplier.name}" deleted successfully`)
      router.push('/dashboard/suppliers')
    } catch (error) {
      console.error('Error deleting supplier:', error)
      toast.error('Failed to delete supplier')
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"} className={`flex items-center gap-1 ${
        isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
      }`}>
        {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    )
  }

  const getTotalInventoryValue = () => {
    if (!supplier?.inventory) return 0
    return supplier.inventory.reduce((total, item) => total + (item.quantity * item.unitPrice), 0)
  }

  const getTotalPurchaseOrdersValue = () => {
    if (!supplier?.purchaseOrders) return 0
    return supplier.purchaseOrders.reduce((total, order) => total + (order.totalAmount || 0), 0)
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

  if (error || !supplier) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Supplier Not Found</h3>
          <p className="text-muted-foreground">
            {error || "The supplier you're looking for doesn't exist."}
          </p>
          <Button className="mt-4" onClick={() => router.push('/dashboard/suppliers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Button>
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
          <p className="text-muted-foreground">
            Supplier details and transaction history
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleToggleStatus}
            className={supplier.isActive ? "text-orange-600" : "text-green-600"}
          >
            {supplier.isActive ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/suppliers/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Supplier Name</label>
                  <p className="text-lg font-semibold">{supplier.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                  <p className="text-lg font-semibold">{supplier.contactName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(supplier.isActive)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">
                    {new Date(supplier.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.phone}</span>
                  </div>
                  {supplier.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">
                        {supplier.email}
                      </a>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{supplier.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Business Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {supplier.inventory.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Inventory Items</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {supplier.purchaseOrders.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Purchase Orders</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    Rp {getTotalInventoryValue().toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Inventory Value</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    Rp {getTotalPurchaseOrdersValue().toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/purchase-orders/create?supplier=${supplier.id}`}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Create Purchase Order
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/inventory?supplier=${supplier.id}`}>
                  <Package className="mr-2 h-4 w-4" />
                  View Inventory Items
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>{new Date(supplier.updatedAt).toLocaleDateString('id-ID')}</p>
                <p className="text-xs mt-1">
                  {new Date(supplier.updatedAt).toLocaleTimeString('id-ID')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Purchase Orders */}
      {supplier.purchaseOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
            <CardDescription>
              Latest purchase orders from this supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplier.purchaseOrders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.poNumber}
                      </TableCell>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.totalAmount 
                          ? `Rp ${order.totalAmount.toLocaleString()}`
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {supplier.purchaseOrders.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/purchase-orders?supplier=${supplier.id}`}>
                    View All Purchase Orders ({supplier.purchaseOrders.length})
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Inventory Items */}
      {supplier.inventory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Inventory Items</CardTitle>
            <CardDescription>
              Latest inventory items supplied by this supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Raw Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplier.inventory.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.rawMaterial.name}
                      </TableCell>
                      <TableCell>
                        {item.quantity} {item.rawMaterial.unit}
                      </TableCell>
                      <TableCell>
                        Rp {item.unitPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {item.batchNumber || '-'}
                      </TableCell>
                      <TableCell>
                        {item.expiryDate 
                          ? new Date(item.expiryDate).toLocaleDateString('id-ID')
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {supplier.inventory.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/inventory?supplier=${supplier.id}`}>
                    View All Inventory Items ({supplier.inventory.length})
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
