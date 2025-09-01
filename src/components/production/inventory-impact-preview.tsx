"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Package, 
  Clock,
  TrendingDown,
  Eye,
  Calculator
} from "lucide-react"

interface InventoryImpactPreviewProps {
  recipeId: string
  targetPortions: number
  onConfirm?: (impactData: any) => void
  onCancel?: () => void
  showActions?: boolean
}

interface ImpactData {
  canProduce: boolean
  batchInfo: {
    recipeName: string
    originalServingSize: number
    targetPortions: number
    scalingFactor: number
    estimatedProductionTime: number
    estimatedTotalCost: number
    costPerPortion: number
  }
  inventoryImpact: Array<{
    materialId: string
    materialName: string
    category: string
    unit: string
    required: number
    currentStock: number
    afterProduction: number
    isAvailable: boolean
    shortfall: number
    estimatedCost: number
    averagePrice: number
    inventoryItems: Array<{
      id: string
      quantity: number
      unitPrice: number
      batchNumber: string | null
      expiryDate: string | null
      supplier: string | null
      qualityStatus: string
    }>
  }>
  insufficientItems: Array<{
    materialName: string
    required: number
    available: number
    unit: string
  }>
  summary: {
    totalMaterials: number
    availableMaterials: number
    insufficientMaterials: number
    totalEstimatedCost: number
    worstCaseShortfall: number
  }
}

export function InventoryImpactPreview({ 
  recipeId, 
  targetPortions, 
  onConfirm, 
  onCancel,
  showActions = true 
}: InventoryImpactPreviewProps) {
  const [loading, setLoading] = useState(false)
  const [impactData, setImpactData] = useState<ImpactData | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const fetchImpactPreview = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/production/batches/preview-impact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId,
          targetPortions,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setImpactData(data)
      } else {
        const error = await response.json()
        console.error('Error fetching impact preview:', error)
      }
    } catch (error) {
      console.error('Error fetching impact preview:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (impactData && onConfirm) {
      onConfirm(impactData)
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

  const getQualityStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      GOOD: 'bg-green-100 text-green-800',
      FAIR: 'bg-yellow-100 text-yellow-800',
      POOR: 'bg-orange-100 text-orange-800',
      REJECTED: 'bg-red-100 text-red-800',
      PENDING: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || colors.PENDING
  }

  if (!impactData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Inventory Impact Analysis
          </CardTitle>
          <CardDescription>
            Preview how this production batch will affect your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchImpactPreview} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Inventory Impact'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      <Alert className={impactData.canProduce ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        <div className="flex items-center gap-2">
          {impactData.canProduce ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
          <AlertDescription className={impactData.canProduce ? 'text-green-800' : 'text-red-800'}>
            {impactData.canProduce 
              ? 'Production can proceed - all materials available'
              : `Cannot produce - ${impactData.summary.insufficientMaterials} materials insufficient`
            }
          </AlertDescription>
        </div>
      </Alert>

      {/* Batch Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{impactData.batchInfo.recipeName}</CardTitle>
          <CardDescription>Production batch overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{impactData.batchInfo.targetPortions}</div>
              <div className="text-sm text-muted-foreground">Target Portions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{impactData.batchInfo.scalingFactor.toFixed(1)}x</div>
              <div className="text-sm text-muted-foreground">Scaling Factor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{impactData.batchInfo.estimatedProductionTime}m</div>
              <div className="text-sm text-muted-foreground">Est. Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Rp {impactData.batchInfo.estimatedTotalCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Est. Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Impact Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{impactData.summary.availableMaterials}</div>
              <div className="text-sm text-muted-foreground">Available Materials</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{impactData.summary.insufficientMaterials}</div>
              <div className="text-sm text-muted-foreground">Insufficient Materials</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">Rp {(impactData.batchInfo.costPerPortion).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Cost per Portion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insufficient Items Alert */}
      {impactData.insufficientItems.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-semibold mb-2">Insufficient Materials:</div>
            <ul className="space-y-1">
              {impactData.insufficientItems.map((item, index) => (
                <li key={index} className="text-sm">
                  <strong>{item.materialName}</strong>: Need {item.required} {item.unit}, 
                  only {item.available} {item.unit} available
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Material Impact Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Material Consumption Details
              </CardTitle>
              <CardDescription>
                How each material will be affected by this production
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactData.inventoryImpact.map((material, index) => (
              <div key={`${material.materialId}-${index}`} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{material.materialName}</h4>
                    <Badge className={getCategoryColor(material.category)}>
                      {material.category}
                    </Badge>
                    {!material.isAvailable && (
                      <Badge variant="destructive">
                        Insufficient
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Rp {material.estimatedCost.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Required</div>
                    <div className="font-medium">{material.required} {material.unit}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current Stock</div>
                    <div className="font-medium">{material.currentStock} {material.unit}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">After Production</div>
                    <div className={`font-medium ${material.afterProduction < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {material.afterProduction} {material.unit}
                    </div>
                  </div>
                </div>

                {material.isAvailable && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Stock Usage</span>
                      <span>{((material.required / material.currentStock) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(material.required / material.currentStock) * 100} className="h-2" />
                  </div>
                )}

                {!material.isAvailable && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                    Shortfall: {material.shortfall} {material.unit}
                  </div>
                )}

                {showDetails && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Available Inventory Items:</div>
                    <div className="space-y-2">
                      {material.inventoryItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{item.quantity} {material.unit}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.batchNumber && `Batch: ${item.batchNumber} • `}
                              {item.supplier && `Supplier: ${item.supplier} • `}
                              Rp {item.unitPrice.toLocaleString()}/{material.unit}
                            </div>
                          </div>
                          <Badge className={getQualityStatusColor(item.qualityStatus)}>
                            {item.qualityStatus}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3">
          <Button 
            onClick={handleConfirm}
            disabled={!impactData.canProduce}
            className="flex-1"
          >
            {impactData.canProduce ? 'Proceed with Production' : 'Cannot Proceed'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
