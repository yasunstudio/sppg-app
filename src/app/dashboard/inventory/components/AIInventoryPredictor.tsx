'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Bot, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Calendar,
  BarChart3,
  CheckCircle,
  Loader2,
  RefreshCw,
  ShoppingCart
} from 'lucide-react'

interface AIInventoryPredictorProps {
  onSuccess: () => void
}

interface PredictionResult {
  predictions: any[]
  alerts: any[]
  recommendations: any[]
  analytics: any
  summary: any
}

export function AIInventoryPredictor({ onSuccess }: AIInventoryPredictorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [formData, setFormData] = useState({
    forecastPeriod: 30,
    includeSeasonality: true,
    confidenceLevel: 0.85,
    alertThresholds: {
      lowStock: 0.2,
      criticalStock: 0.1,
      overstock: 1.5
    },
    analysisScope: 'all', // 'all', 'critical', 'popular'
    optimizeReorderPoints: true
  })

  const runPrediction = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/inventory-predictor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          forecastPeriod: formData.forecastPeriod,
          includeSeasonality: formData.includeSeasonality,
          confidenceLevel: formData.confidenceLevel,
          alertThresholds: formData.alertThresholds,
          analysisScope: formData.analysisScope,
          optimizeReorderPoints: formData.optimizeReorderPoints
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate inventory predictions')
      }

      const result = await response.json()
      
      if (result.success) {
        setPredictionResult(result.data)
        console.log("✅ Inventory prediction completed successfully")
      } else {
        throw new Error(result.error || 'Failed to generate predictions')
      }
    } catch (error) {
      console.error('Inventory Prediction Error:', error)
      console.log("❌ Failed to generate inventory predictions")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600'
      case 'low': return 'text-orange-600'
      case 'optimal': return 'text-green-600'
      case 'overstock': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  if (predictionResult) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Inventory Predictions Generated!</h3>
          <p className="text-muted-foreground">
            Analyzed {predictionResult.summary.totalItems} items with {predictionResult.predictions.length} predictions over {formData.forecastPeriod} days
          </p>
        </div>

        <Tabs defaultValue="predictions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-4">
            <div className="grid gap-4">
              {predictionResult.predictions.slice(0, 8).map((prediction, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{prediction.itemName}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Category: {prediction.category} • Current: {prediction.currentStock} {prediction.unit}
                        </p>
                      </div>
                      <Badge className={getStockStatusColor(prediction.stockStatus)}>
                        {prediction.stockStatus.charAt(0).toUpperCase() + prediction.stockStatus.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Demand Forecast */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Predicted Demand ({formData.forecastPeriod} days)</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(prediction.predictedDemand)} {prediction.unit}
                          </span>
                        </div>
                        <Progress value={Math.min((prediction.predictedDemand / prediction.currentStock) * 100, 100)} />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Current Stock</span>
                          <span>Confidence: {Math.round(prediction.confidence * 100)}%</span>
                        </div>
                      </div>

                      {/* Reorder Information */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Reorder Point</div>
                          <div className="font-medium">{prediction.reorderPoint} {prediction.unit}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Reorder Quantity</div>
                          <div className="font-medium">{prediction.reorderQuantity} {prediction.unit}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Days Until Reorder</div>
                          <div className={`font-medium ${prediction.daysUntilReorder <= 7 ? 'text-red-600' : 'text-green-600'}`}>
                            {prediction.daysUntilReorder} days
                          </div>
                        </div>
                      </div>

                      {/* Cost Information */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground">Estimated Reorder Cost</div>
                            <div className="font-medium">{formatCurrency(prediction.estimatedReorderCost)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Monthly Carrying Cost</div>
                            <div className="font-medium">{formatCurrency(prediction.monthlyCarryingCost)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="space-y-3">
              {predictionResult.alerts.map((alert, index) => (
                <Card key={index} className={`border-l-4 ${getAlertColor(alert.severity)}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        alert.severity === 'critical' ? 'bg-red-100' :
                        alert.severity === 'high' ? 'bg-orange-100' :
                        alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {alert.type === 'stockout' ? <AlertTriangle className="w-4 h-4" /> : 
                         alert.type === 'reorder' ? <RefreshCw className="w-4 h-4" /> : 
                         <Package className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <div className="mt-2 text-xs">
                          <span className="font-medium">Item:</span> {alert.itemName} • 
                          <span className="font-medium">Current Stock:</span> {alert.currentStock} {alert.unit} • 
                          <span className="font-medium">Action Required:</span> {alert.actionRequired}
                        </div>
                      </div>
                      <Badge variant={
                        alert.severity === 'critical' ? 'destructive' :
                        alert.severity === 'high' ? 'default' : 'secondary'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-3">
              {predictionResult.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100' :
                        rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {rec.type === 'cost_optimization' ? <TrendingUp className="w-4 h-4" /> : 
                         rec.type === 'reorder_optimization' ? <RefreshCw className="w-4 h-4" /> : 
                         <ShoppingCart className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        {rec.potentialSavings && (
                          <div className="mt-2 text-sm font-medium text-green-600">
                            Potential Savings: {formatCurrency(rec.potentialSavings)} per month
                          </div>
                        )}
                        {rec.actionItems && (
                          <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside">
                            {rec.actionItems.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {rec.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                    Inventory Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(predictionResult.analytics.overallAccuracy * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(predictionResult.analytics.potentialSavings)}
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly Savings</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Critical Items</span>
                        <Badge variant="destructive">{predictionResult.analytics.criticalItems}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Items Need Reorder</span>
                        <Badge variant="default">{predictionResult.analytics.itemsNeedReorder}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Overstocked Items</span>
                        <Badge variant="secondary">{predictionResult.analytics.overstockedItems}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(predictionResult.analytics.totalInventoryValue)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Inventory Value</div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Carrying Costs</span>
                          <span>{formatCurrency(predictionResult.analytics.monthlyCarryingCosts)}/month</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Stockout Risk</span>
                          <span>{Math.round(predictionResult.analytics.stockoutRisk * 100)}%</span>
                        </div>
                        <Progress 
                          value={predictionResult.analytics.stockoutRisk * 100} 
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Turnover Rate</span>
                          <span>{predictionResult.analytics.inventoryTurnover.toFixed(1)}x</span>
                        </div>
                        <Progress value={Math.min(predictionResult.analytics.inventoryTurnover * 20, 100)} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setPredictionResult(null)}>
            Run New Prediction
          </Button>
          <Button onClick={onSuccess}>
            Apply Recommendations
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <Package className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">AI Inventory Predictor</h3>
        <p className="text-muted-foreground">
          Predict inventory needs, optimize reorder points, and prevent stockouts
        </p>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prediction Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prediction Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="forecastPeriod">Forecast Period (days)</Label>
              <Input
                id="forecastPeriod"
                type="number"
                min="7"
                max="90"
                value={formData.forecastPeriod}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  forecastPeriod: parseInt(e.target.value) || 30
                }))}
              />
            </div>

            <div>
              <Label htmlFor="confidenceLevel">Confidence Level</Label>
              <Select
                value={formData.confidenceLevel.toString()}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  confidenceLevel: parseFloat(value)
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.95">95% (Very High)</SelectItem>
                  <SelectItem value="0.90">90% (High)</SelectItem>
                  <SelectItem value="0.85">85% (Medium)</SelectItem>
                  <SelectItem value="0.80">80% (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="analysisScope">Analysis Scope</Label>
              <Select
                value={formData.analysisScope}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  analysisScope: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="critical">Critical Items Only</SelectItem>
                  <SelectItem value="popular">Popular Items Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lowStock">Low Stock Alert (%)</Label>
              <Input
                id="lowStock"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={formData.alertThresholds.lowStock}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  alertThresholds: {
                    ...prev.alertThresholds,
                    lowStock: parseFloat(e.target.value) || 0.2
                  }
                }))}
              />
            </div>

            <div>
              <Label htmlFor="criticalStock">Critical Stock Alert (%)</Label>
              <Input
                id="criticalStock"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={formData.alertThresholds.criticalStock}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  alertThresholds: {
                    ...prev.alertThresholds,
                    criticalStock: parseFloat(e.target.value) || 0.1
                  }
                }))}
              />
            </div>

            <div>
              <Label htmlFor="overstock">Overstock Alert (multiplier)</Label>
              <Input
                id="overstock"
                type="number"
                min="1"
                max="3"
                step="0.1"
                value={formData.alertThresholds.overstock}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  alertThresholds: {
                    ...prev.alertThresholds,
                    overstock: parseFloat(e.target.value) || 1.5
                  }
                }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prediction Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeSeasonality"
                checked={formData.includeSeasonality}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  includeSeasonality: e.target.checked
                }))}
              />
              <Label htmlFor="includeSeasonality">Include seasonal patterns</Label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="optimizeReorderPoints"
                checked={formData.optimizeReorderPoints}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  optimizeReorderPoints: e.target.checked
                }))}
              />
              <Label htmlFor="optimizeReorderPoints">Optimize reorder points</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predict Button */}
      <div className="flex justify-center">
        <Button
          onClick={runPrediction}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Predictions...
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5 mr-2" />
              Generate AI Predictions
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
