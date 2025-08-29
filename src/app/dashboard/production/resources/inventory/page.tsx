"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

// Fetch all raw materials for inventory view
async function fetchAllRawMaterials(searchTerm = "") {
  const response = await fetch(`/api/raw-materials?search=${searchTerm}&limit=100`)
  if (!response.ok) {
    throw new Error("Failed to fetch raw materials")
  }
  const data = await response.json()
  return data.data || []
}

export default function InventoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const { data: materials = [], isLoading, error } = useQuery({
    queryKey: ["all-raw-materials", searchTerm],
    queryFn: () => fetchAllRawMaterials(searchTerm),
    refetchInterval: 60000, // Refresh every minute
  })

  const filteredMaterials = materials.filter((material: any) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate statistics
  const totalValue = materials.reduce((sum: number, m: any) => 
    sum + (m.currentStock * (m.unitPrice || 0)), 0
  )
  const lowStockItems = materials.filter((m: any) => 
    m.currentStock <= (m.minimumStock || 0)
  )
  const outOfStockItems = materials.filter((m: any) => m.currentStock === 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading inventory...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-red-600">
          Error loading inventory: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Full Inventory</h1>
          <p className="text-muted-foreground">
            Complete list of all raw materials and stock levels
          </p>
        </div>
      </div>

      {/* Inventory Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">raw materials</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">inventory value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">need reorder</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
            <p className="text-xs text-muted-foreground">urgent reorder</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Inventory</CardTitle>
          <CardDescription>
            Find materials by name or category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>Materials ({filteredMaterials.length})</CardTitle>
          <CardDescription>
            Complete inventory with stock levels and values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No materials found matching your search
              </div>
            ) : (
              filteredMaterials.map((material: any) => {
                const stockLevel = material.currentStock
                const minStock = material.minimumStock || 0
                const stockStatus = stockLevel === 0 ? 'out' : stockLevel <= minStock ? 'low' : 'good'
                const totalValue = stockLevel * (material.unitPrice || 0)

                return (
                  <div key={material.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{material.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            Category: {material.category || 'N/A'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Supplier: {material.supplier?.name || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        variant={stockStatus === 'out' ? 'destructive' : stockStatus === 'low' ? 'secondary' : 'default'}
                        className={stockStatus === 'low' ? 'bg-yellow-100 text-yellow-800' : ''}
                      >
                        {stockLevel} {material.unit}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Stock:</span>
                        <div className="font-medium">{stockLevel} {material.unit}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Minimum Stock:</span>
                        <div className="font-medium">{minStock} {material.unit}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unit Price:</span>
                        <div className="font-medium">Rp {(material.unitPrice || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Value:</span>
                        <div className="font-medium">Rp {totalValue.toLocaleString()}</div>
                      </div>
                    </div>

                    {stockStatus !== 'good' && (
                      <div className="mt-3 p-2 rounded" style={{
                        backgroundColor: stockStatus === 'out' ? '#fef2f2' : '#fffbeb',
                        color: stockStatus === 'out' ? '#dc2626' : '#d97706'
                      }}>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {stockStatus === 'out' ? 'Out of Stock' : 'Low Stock Alert'}
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          {stockStatus === 'out' 
                            ? 'This item is completely out of stock and needs immediate reordering.'
                            : `Stock level is below minimum threshold of ${minStock} ${material.unit}.`
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
