"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  History, 
  TrendingDown, 
  RotateCcw,
  Package,
  DollarSign,
  Clock,
  User,
  Info
} from "lucide-react"
import { format } from 'date-fns'

interface InventoryConsumptionHistoryProps {
  batchId: string
}

interface ConsumptionData {
  batch: {
    id: string
    batchNumber: string
    status: string
    plannedQuantity: number
    actualQuantity: number | null
    startedAt: string | null
    completedAt: string | null
    recipe: {
      id: string
      name: string
      servingSize: number
    } | null
    productionPlan: {
      id: string
      planDate: string
      targetPortions: number
    }
  }
  consumption: {
    deductions: Array<{
      materialId: string
      materialName: string
      category: string
      unit: string
      deductions: Array<{
        inventoryItemId: string
        batchNumber: string | null
        supplier: string | null
        deductedAmount: number
        unitPrice: number
        itemValue: number
        deductedAt: string
        deductedBy: string
        originalQuantity: number
        newQuantity: number
      }>
      totalDeducted: number
      totalValue: number
    }>
    rollbacks: Array<{
      materialId: string
      materialName: string
      rollbacks: Array<{
        inventoryItemId: string
        restoredAmount: number
        unitPrice: number
        itemValue: number
        rolledBackAt: string
        rolledBackBy: string
      }>
      totalRestored: number
      totalValue: number
    }>
    summary: {
      totalDeductions: number
      totalRollbacks: number
      totalDeductionValue: number
      totalRollbackValue: number
      netConsumptionValue: number
      hasActiveConsumption: boolean
    }
  }
}

export function InventoryConsumptionHistory({ batchId }: InventoryConsumptionHistoryProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ConsumptionData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConsumptionHistory()
  }, [batchId])

  const fetchConsumptionHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/production/batches/${batchId}/inventory-consumption`)
      
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch consumption history')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      PROTEIN: 'bg-red-100 text-red-800',
      VEGETABLE: 'bg-green-100 text-green-800',
      FRUIT: 'bg-orange-100 text-orange-800',
      GRAIN: 'bg-yellow-100 text-yellow-800',
      DAIRY: 'bg-blue-100 text-blue-800',
      SPICE: 'bg-purple-100 text-purple-800',
      OIL: 'bg-amber-100 text-amber-800',
      BEVERAGE: 'bg-cyan-100 text-cyan-800',
      OTHER: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || colors.OTHER
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      QUALITY_CHECK: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      REWORK_REQUIRED: 'bg-orange-100 text-orange-800',
    }
    return colors[status] || colors.PENDING
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading consumption history...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          Error: {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">No consumption data found</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Batch Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Production Batch: {data.batch.batchNumber}
          </CardTitle>
          <CardDescription>
            {data.batch.recipe?.name} • {data.batch.productionPlan.targetPortions} portions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge className={getStatusColor(data.batch.status)}>
                {data.batch.status.replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Plan Date</div>
              <div className="font-medium">
                {format(new Date(data.batch.productionPlan.planDate), 'MMM dd, yyyy')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Planned Quantity</div>
              <div className="font-medium">{data.batch.plannedQuantity} portions</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Actual Quantity</div>
              <div className="font-medium">
                {data.batch.actualQuantity || 'Not completed'} 
                {data.batch.actualQuantity && ' portions'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consumption Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Inventory Consumption Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.consumption.summary.totalDeductions === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <div>No inventory has been consumed yet</div>
              <div className="text-sm">Inventory will be deducted when production starts</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  Rp {data.consumption.summary.totalDeductionValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Consumed</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {data.consumption.summary.totalDeductions} transactions
                </div>
              </div>
              {data.consumption.summary.totalRollbacks > 0 && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    Rp {data.consumption.summary.totalRollbackValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Rolled Back</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {data.consumption.summary.totalRollbacks} transactions
                  </div>
                </div>
              )}
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  Rp {data.consumption.summary.netConsumptionValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Net Consumption</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Current impact
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material Deductions */}
      {data.consumption.deductions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Material Consumption Details
            </CardTitle>
            <CardDescription>
              Inventory items that were consumed for this production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.consumption.deductions.map((material) => (
                <div key={material.materialId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{material.materialName}</h4>
                      <Badge className={getCategoryColor(material.category)}>
                        {material.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {material.totalDeducted} {material.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rp {material.totalValue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {material.deductions.map((deduction, index) => (
                      <div key={index} className="bg-gray-50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span className="font-medium">
                              {deduction.deductedAmount} {material.unit}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              @ Rp {deduction.unitPrice.toLocaleString()}/{material.unit}
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            Rp {deduction.itemValue.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                          <div>
                            <div className="font-medium">Batch</div>
                            <div>{deduction.batchNumber || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="font-medium">Supplier</div>
                            <div>{deduction.supplier || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="font-medium">Deducted By</div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {deduction.deductedBy}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Deducted At</div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(deduction.deductedAt), 'MMM dd, HH:mm')}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          Stock: {deduction.originalQuantity} → {deduction.newQuantity} {material.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rollbacks */}
      {data.consumption.rollbacks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Inventory Rollbacks
            </CardTitle>
            <CardDescription>
              Inventory that was restored due to batch cancellation or errors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.consumption.rollbacks.map((material) => (
                <div key={material.materialId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{material.materialName}</h4>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        +{material.totalRestored}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rp {material.totalValue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {material.rollbacks.map((rollback, index) => (
                      <div key={index} className="bg-green-50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <RotateCcw className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-green-700">
                              +{rollback.restoredAmount}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              @ Rp {rollback.unitPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-green-700">
                            Rp {rollback.itemValue.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                          <div>
                            <div className="font-medium">Rolled Back By</div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {rollback.rolledBackBy}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Rolled Back At</div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(rollback.rolledBackAt), 'MMM dd, HH:mm')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={fetchConsumptionHistory}>
          <History className="h-4 w-4 mr-2" />
          Refresh History
        </Button>
      </div>
    </div>
  )
}
