"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, Utensils, Settings, AlertTriangle, CheckCircle, Clock, Plus, RefreshCw } from "lucide-react"

// Fetch production resources from API
async function fetchProductionResources() {
  const response = await fetch("/api/production/resources?limit=20")
  if (!response.ok) {
    throw new Error("Failed to fetch production resources")
  }
  const data = await response.json()
  return data.data || []
}

// Fetch raw materials for stock information
async function fetchRawMaterials() {
  const response = await fetch("/api/raw-materials?limit=50")
  if (!response.ok) {
    throw new Error("Failed to fetch raw materials")
  }
  const data = await response.json()
  return data.data || []
}

const getResourceStatusColor = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-800"
    case "IN_USE":
      return "bg-blue-100 text-blue-800"
    case "MAINTENANCE":
      return "bg-yellow-100 text-yellow-800"
    case "OUT_OF_ORDER":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getResourceStatusIcon = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return <CheckCircle className="h-4 w-4" />
    case "IN_USE":
      return <Clock className="h-4 w-4" />
    case "MAINTENANCE":
    case "OUT_OF_ORDER":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function ProductionResourcesPage() {
  const router = useRouter()
  
  const { data: resources = [], isLoading: resourcesLoading, error: resourcesError, refetch: refetchResources } = useQuery({
    queryKey: ["production-resources"],
    queryFn: fetchProductionResources,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const { data: rawMaterials = [], isLoading: materialsLoading, error: materialsError, refetch: refetchMaterials } = useQuery({
    queryKey: ["raw-materials"],
    queryFn: fetchRawMaterials,
    refetchInterval: 60000, // Refresh every minute
  })

  const handleRefresh = () => {
    refetchResources()
    refetchMaterials()
  }

  if (resourcesLoading || materialsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Production Resources</h1>
        </div>
        <div className="text-center py-8">Loading production resources...</div>
      </div>
    )
  }

  if (resourcesError || materialsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Production Resources</h1>
        </div>
        <div className="text-center py-8 text-red-600">
          Error loading resources: {(resourcesError || materialsError)?.message}
        </div>
      </div>
    )
  }

  // Calculate resource statistics
  const availableResources = resources.filter((r: any) => r.status === "AVAILABLE")
  const inUseResources = resources.filter((r: any) => r.status === "IN_USE")
  const maintenanceResources = resources.filter((r: any) => r.status === "MAINTENANCE")
  
  // Calculate material statistics
  const lowStockMaterials = rawMaterials.filter((m: any) => 
    m.currentStock <= (m.minimumStock || 0)
  )
  const totalValue = rawMaterials.reduce((sum: number, m: any) => 
    sum + (m.currentStock * (m.unitPrice || 0)), 0
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Resources</h1>
          <p className="text-muted-foreground">
            Manage equipment, staff, and raw materials for production operations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
          <Button onClick={() => router.push('/dashboard/production/resources/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </div>

      {/* Resource Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">equipment & staff</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableResources.length}</div>
            <p className="text-xs text-muted-foreground">ready for use</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inUseResources.length}</div>
            <p className="text-xs text-muted-foreground">currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceResources.length}</div>
            <p className="text-xs text-muted-foreground">require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Equipment & Staff Resources */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Equipment & Staff</CardTitle>
              <CardDescription>
                Current status of production equipment and staff assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No production resources found
                  </div>
                ) : (
                  resources.map((resource: any) => (
                    <div key={resource.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {resource.resourceType === "EQUIPMENT" ? (
                            <Utensils className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Users className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <h3 className="font-semibold">{resource.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {resource.resourceType} • {resource.location || 'No location'}
                            </p>
                          </div>
                        </div>
                        <Badge className={getResourceStatusColor(resource.status)}>
                          <span className="flex items-center space-x-1">
                            {getResourceStatusIcon(resource.status)}
                            <span>{resource.status.replace('_', ' ')}</span>
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-3">
                        {resource.capacity && (
                          <div>
                            <p className="text-sm font-medium">Capacity</p>
                            <p className="text-sm text-muted-foreground">
                              {resource.capacity} {resource.unit || 'units'}
                            </p>
                          </div>
                        )}
                        {resource.currentUsage && (
                          <div>
                            <p className="text-sm font-medium">Current Usage</p>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={(resource.currentUsage / (resource.capacity || 1)) * 100} 
                                className="h-2 flex-1" 
                              />
                              <span className="text-sm text-muted-foreground">
                                {((resource.currentUsage / (resource.capacity || 1)) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        )}
                        {resource.batch && (
                          <div>
                            <p className="text-sm font-medium">Assigned to Batch</p>
                            <p className="text-sm text-muted-foreground">
                              {resource.batch.batchNumber}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">Last Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(resource.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {resource.notes && (
                        <div className="mt-3">
                          <p className="text-sm font-medium">Notes</p>
                          <p className="text-sm text-muted-foreground">
                            {resource.notes}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/production/resources/${resource.id}/edit-status`)}
                        >
                          Edit Status
                        </Button>
                        {resource.status === "IN_USE" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/production/resources/${resource.id}/edit-status`)}
                          >
                            Mark Available
                          </Button>
                        )}
                        {resource.status === "AVAILABLE" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/production/resources/${resource.id}/assign`)}
                          >
                            Assign to Batch
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Raw Materials Inventory */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Raw Materials</CardTitle>
              <CardDescription>
                Current inventory levels and stock alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stock Summary */}
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">Inventory Value</h4>
                    <span className="text-lg font-bold">
                      Rp {totalValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Items:</span>
                      <span className="ml-1 font-medium">{rawMaterials.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Low Stock:</span>
                      <span className="ml-1 font-medium text-red-600">{lowStockMaterials.length}</span>
                    </div>
                  </div>
                </div>

                {/* Low Stock Alerts */}
                {lowStockMaterials.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-red-600">Low Stock Alerts</h4>
                    <div className="space-y-2">
                      {lowStockMaterials.slice(0, 5).map((material: any) => (
                        <div key={material.id} className="p-2 bg-red-50 border border-red-200 rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{material.name}</span>
                            <Badge variant="destructive">
                              {material.currentStock} {material.unit}
                            </Badge>
                          </div>
                          <p className="text-xs text-red-600">
                            Below minimum: {material.minimumStock} {material.unit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Materials */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Recent Materials</h4>
                  <div className="space-y-2">
                    {rawMaterials.slice(0, 5).map((material: any) => (
                      <div key={material.id} className="p-2 border rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{material.name}</span>
                          <Badge variant={material.currentStock > (material.minimumStock || 0) ? "default" : "destructive"}>
                            {material.currentStock} {material.unit}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Supplier: {material.supplier?.name || 'N/A'}</span>
                          <span>Rp {(material.unitPrice || 0).toLocaleString()}/{material.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/dashboard/production/resources/inventory')}
                >
                  View Full Inventory
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/dashboard/production/resources/purchase-order')}
                >
                  Create Purchase Order
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/dashboard/production/resources/maintenance')}
                >
                  Schedule Maintenance
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/dashboard/production/resources/stock-report')}
                >
                  Stock Movement Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
