"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Check, 
  X, 
  Truck, 
  Package,
  Clock,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface BulkOperationProps {
  selectedOrders: string[]
  onOperationComplete: () => void
  trigger?: React.ReactNode
}

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: { name: string }
  status: string
  totalAmount: number
}

type BulkAction = 'confirm' | 'ship' | 'deliver' | 'cancel' | 'update-status'

const BULK_ACTIONS = [
  {
    id: 'confirm' as BulkAction,
    label: 'Confirm Orders',
    description: 'Mark selected orders as confirmed',
    icon: Check,
    color: 'blue',
    newStatus: 'CONFIRMED'
  },
  {
    id: 'ship' as BulkAction,
    label: 'Mark as Shipped',
    description: 'Update orders to shipped status',
    icon: Truck,
    color: 'purple',
    newStatus: 'SHIPPED'
  },
  {
    id: 'deliver' as BulkAction,
    label: 'Mark as Delivered',
    description: 'Complete orders as delivered',
    icon: Package,
    color: 'green',
    newStatus: 'DELIVERED'
  },
  {
    id: 'cancel' as BulkAction,
    label: 'Cancel Orders',
    description: 'Cancel selected orders',
    icon: X,
    color: 'red',
    newStatus: 'CANCELLED'
  }
]

const STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  PARTIALLY_RECEIVED: 'Partially Received'
}

export function BulkOperations({ selectedOrders, onOperationComplete, trigger }: BulkOperationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null)
  const [customStatus, setCustomStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [orderSelection, setOrderSelection] = useState<string[]>([])

  const fetchOrderDetails = async () => {
    if (selectedOrders.length === 0) return

    try {
      const orderPromises = selectedOrders.map(id =>
        fetch(`/api/purchase-orders/${id}`).then(res => res.json())
      )
      
      const orderResults = await Promise.all(orderPromises)
      const validOrders = orderResults
        .filter(result => result.success)
        .map(result => result.data)
      
      setOrders(validOrders)
      setOrderSelection(validOrders.map(order => order.id))
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error('Failed to load order details')
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      fetchOrderDetails()
    } else {
      // Reset form
      setSelectedAction(null)
      setCustomStatus('')
      setNotes('')
      setOrders([])
      setOrderSelection([])
    }
  }

  const handleBulkOperation = async () => {
    if (!selectedAction || orderSelection.length === 0) return

    setIsProcessing(true)

    try {
      const action = BULK_ACTIONS.find(a => a.id === selectedAction)
      const targetStatus = selectedAction === 'update-status' ? customStatus : action?.newStatus

      if (!targetStatus) {
        throw new Error('No target status specified')
      }

      // Process orders in batches
      const batchSize = 10
      const batches = []
      for (let i = 0; i < orderSelection.length; i += batchSize) {
        batches.push(orderSelection.slice(i, i + batchSize))
      }

      let successCount = 0
      let errorCount = 0

      for (const batch of batches) {
        const batchPromises = batch.map(async (orderId) => {
          try {
            const response = await fetch(`/api/purchase-orders/${orderId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: targetStatus,
                notes: notes || undefined,
                bulkOperation: true
              }),
            })

            if (!response.ok) {
              throw new Error(`Failed to update order ${orderId}`)
            }

            return { success: true, orderId }
          } catch (error) {
            console.error(`Error updating order ${orderId}:`, error)
            return { success: false, orderId, error }
          }
        })

        const batchResults = await Promise.all(batchPromises)
        successCount += batchResults.filter(r => r.success).length
        errorCount += batchResults.filter(r => !r.success).length
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully updated ${successCount} order(s)`)
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} order(s)`)
      }

      // Close dialog and refresh
      setIsOpen(false)
      onOperationComplete()

    } catch (error) {
      console.error('Bulk operation error:', error)
      toast.error('Failed to perform bulk operation')
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleOrderSelection = (orderId: string) => {
    setOrderSelection(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const toggleSelectAll = () => {
    setOrderSelection(prev => 
      prev.length === orders.length ? [] : orders.map(order => order.id)
    )
  }

  const getValidActionsForOrders = () => {
    if (orders.length === 0) return BULK_ACTIONS

    // Get unique statuses from selected orders
    const selectedOrdersData = orders.filter(order => orderSelection.includes(order.id))
    const statuses = [...new Set(selectedOrdersData.map(order => order.status))]
    
    // Filter actions based on current statuses
    return BULK_ACTIONS.filter(action => {
      switch (action.id) {
        case 'confirm':
          return statuses.some(status => status === 'PENDING')
        case 'ship':
          return statuses.some(status => ['CONFIRMED', 'PENDING'].includes(status))
        case 'deliver':
          return statuses.some(status => ['SHIPPED', 'CONFIRMED'].includes(status))
        case 'cancel':
          return statuses.some(status => !['DELIVERED', 'CANCELLED'].includes(status))
        default:
          return true
      }
    })
  }

  if (selectedOrders.length === 0) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Bulk Actions ({selectedOrders.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Bulk Operations
          </DialogTitle>
          <DialogDescription>
            Perform actions on multiple purchase orders simultaneously
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Selected Orders ({orderSelection.length} of {orders.length})</Label>
              <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
                {orderSelection.length === orders.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center space-x-3 p-3 border-b last:border-b-0">
                  <Checkbox
                    checked={orderSelection.includes(order.id)}
                    onCheckedChange={() => toggleOrderSelection(order.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{order.orderNumber}</span>
                      <Badge variant="secondary" className="text-xs">
                        {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS]}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.supplier.name} • Rp {order.totalAmount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label>Select Action</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getValidActionsForOrders().map((action) => {
                const Icon = action.icon
                return (
                  <Card 
                    key={action.id}
                    className={`cursor-pointer transition-colors ${
                      selectedAction === action.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedAction(action.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 text-${action.color}-600 mt-0.5`} />
                        <div>
                          <div className="font-medium text-sm">{action.label}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Custom Status for Update Action */}
          {selectedAction === 'update-status' && (
            <div className="space-y-2">
              <Label htmlFor="customStatus">Target Status</Label>
              <Select value={customStatus} onValueChange={setCustomStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="PARTIALLY_RECEIVED">Partially Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this bulk operation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Confirmation */}
          {selectedAction && orderSelection.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-amber-800 mb-1">Confirm Bulk Operation</div>
                  <div className="text-amber-700">
                    You are about to {BULK_ACTIONS.find(a => a.id === selectedAction)?.label.toLowerCase()} {orderSelection.length} purchase order(s). 
                    This action cannot be undone.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkOperation}
              disabled={!selectedAction || orderSelection.length === 0 || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Apply to {orderSelection.length} Order(s)
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
