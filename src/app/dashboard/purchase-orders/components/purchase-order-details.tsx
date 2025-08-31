"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  ShoppingCart, 
  Calendar, 
  Truck, 
  CheckCircle,
  XCircle,
  Clock,
  Package,
  FileText,
  Building2,
  User,
  Mail,
  Phone
} from "lucide-react"
import { toast } from "sonner"

interface PurchaseOrderItem {
  id: string
  rawMaterial: {
    id: string
    name: string
    category: string
    unit: string
  }
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  notes?: string
}

interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  supplier: {
    id: string
    name: string
    contactName: string
    email: string
    phone: string
    address: string
  }
  orderDate: string
  expectedDelivery?: string
  actualDelivery?: string
  status: string
  totalAmount: number
  notes?: string
  orderedBy: {
    id: string
    name: string
    email: string
  }
  receivedBy?: {
    id: string
    name: string
    email: string
  }
  items: PurchaseOrderItem[]
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: Package },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
  PARTIALLY_RECEIVED: { label: "Partially Received", color: "bg-orange-100 text-orange-800", icon: Package },
}

interface PurchaseOrderDetailsProps {
  id: string
}

export function PurchaseOrderDetails({ id }: PurchaseOrderDetailsProps) {
  const router = useRouter()
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response = await fetch(`/api/purchase-orders/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Purchase order not found')
          }
          throw new Error('Failed to fetch purchase order')
        }

        const result = await response.json()
        if (result.success) {
          setPurchaseOrder(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch purchase order')
        }
      } catch (error) {
        console.error('Error fetching purchase order:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch purchase order')
        toast.error(error instanceof Error ? error.message : 'Failed to fetch purchase order')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPurchaseOrder()
    }
  }, [id])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !purchaseOrder) {
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

  const status = statusConfig[purchaseOrder.status as keyof typeof statusConfig]
  const StatusIcon = status?.icon || Clock

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Purchase Order #{purchaseOrder.poNumber}
            </h1>
            <p className="text-muted-foreground">
              Created on {formatDateTime(purchaseOrder.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={status?.color}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {status?.label}
          </Badge>
          <Button 
            onClick={() => router.push(`/dashboard/purchase-orders/${id}/edit`)}
            disabled={purchaseOrder.status === 'CANCELLED' || purchaseOrder.status === 'DELIVERED'}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(purchaseOrder.orderDate)}</span>
                  </div>
                </div>
                
                {purchaseOrder.expectedDelivery && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expected Delivery</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(purchaseOrder.expectedDelivery)}</span>
                    </div>
                  </div>
                )}

                {purchaseOrder.actualDelivery && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Actual Delivery</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(purchaseOrder.actualDelivery)}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                  <div className="text-2xl font-bold mt-1">
                    {formatCurrency(purchaseOrder.totalAmount)}
                  </div>
                </div>
              </div>

              {purchaseOrder.notes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="mt-1 text-sm">{purchaseOrder.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
              <CardDescription>
                {purchaseOrder.items.length} item(s) in this purchase order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Raw Material</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.rawMaterial.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.rawMaterial.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity.toLocaleString('id-ID')} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.totalPrice)}
                        </TableCell>
                        <TableCell>
                          {item.notes && (
                            <span className="text-sm text-muted-foreground">{item.notes}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Supplier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{purchaseOrder.supplier.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Contact: {purchaseOrder.supplier.contactName}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{purchaseOrder.supplier.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{purchaseOrder.supplier.phone}</span>
                </div>
              </div>

              {purchaseOrder.supplier.address && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-sm mt-1">{purchaseOrder.supplier.address}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Staff Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Staff Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ordered By</label>
                <div className="mt-1">
                  <p className="font-medium">{purchaseOrder.orderedBy.name}</p>
                  <p className="text-sm text-muted-foreground">{purchaseOrder.orderedBy.email}</p>
                </div>
              </div>

              {purchaseOrder.receivedBy && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Received By</label>
                    <div className="mt-1">
                      <p className="font-medium">{purchaseOrder.receivedBy.name}</p>
                      <p className="text-sm text-muted-foreground">{purchaseOrder.receivedBy.email}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Audit Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-muted-foreground">Created</label>
                <p>{formatDateTime(purchaseOrder.createdAt)}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground">Last Updated</label>
                <p>{formatDateTime(purchaseOrder.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
