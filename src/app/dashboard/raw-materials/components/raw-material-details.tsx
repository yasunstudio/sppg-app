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
  Package, 
  Zap, 
  Calendar,
  Beef,
  Apple,
  Wheat,
  Droplet,
  Milk,
  Target,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

type MaterialCategory = 'PROTEIN' | 'VEGETABLE' | 'FRUIT' | 'GRAIN' | 'DAIRY' | 'SPICE' | 'OIL' | 'BEVERAGE' | 'OTHER'

interface RawMaterial {
  id: string
  name: string
  category: MaterialCategory
  unit: string
  description: string | null
  caloriesPer100g: number | null
  proteinPer100g: number | null
  fatPer100g: number | null
  carbsPer100g: number | null
  fiberPer100g: number | null
  createdAt: string
  updatedAt: string
  inventory: Array<{
    id: string
    quantity: number
    unitPrice: number
    supplier: {
      name: string
    }
    expiryDate: string | null
    batchNumber: string | null
  }>
  menuItems: Array<{
    id: string
    quantity: number
    menuItem: {
      name: string
    }
  }>
  purchaseOrderItems: Array<{
    id: string
    quantity: number
    unitPrice: number
    purchaseOrder: {
      poNumber: string
      orderDate: string
    }
  }>
}

const categoryIcons = {
  PROTEIN: Beef,
  VEGETABLE: Package,
  FRUIT: Apple,
  GRAIN: Wheat,
  DAIRY: Milk,
  SPICE: Zap,
  OIL: Droplet,
  BEVERAGE: Droplet,
  OTHER: Package
}

const categoryLabels = {
  PROTEIN: 'Protein',
  VEGETABLE: 'Sayuran',
  FRUIT: 'Buah',
  GRAIN: 'Biji-bijian',
  DAIRY: 'Susu',
  SPICE: 'Bumbu',
  OIL: 'Minyak',
  BEVERAGE: 'Minuman',
  OTHER: 'Lainnya'
}

const categoryColors = {
  PROTEIN: 'bg-red-100 text-red-700 border-red-200',
  VEGETABLE: 'bg-green-100 text-green-700 border-green-200',
  FRUIT: 'bg-orange-100 text-orange-700 border-orange-200',
  GRAIN: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  DAIRY: 'bg-blue-100 text-blue-700 border-blue-200',
  SPICE: 'bg-purple-100 text-purple-700 border-purple-200',
  OIL: 'bg-amber-100 text-amber-700 border-amber-200',
  BEVERAGE: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  OTHER: 'bg-gray-100 text-gray-700 border-gray-200'
}

export function RawMaterialDetails() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [rawMaterial, setRawMaterial] = useState<RawMaterial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchRawMaterial = async () => {
      try {
        const response = await fetch(`/api/raw-materials/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Raw material not found')
          }
          throw new Error('Failed to fetch raw material')
        }
        
        const data = await response.json()
        if (data.success) {
          setRawMaterial(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch raw material')
        }
      } catch (error) {
        console.error('Error fetching raw material:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch raw material')
      } finally {
        setLoading(false)
      }
    }

    fetchRawMaterial()
  }, [id])

  const handleDelete = async () => {
    if (!rawMaterial) return
    
    if (!confirm(`Are you sure you want to delete raw material "${rawMaterial.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/raw-materials/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete raw material')
      }

      toast.success(`Raw material "${rawMaterial.name}" deleted successfully`)
      router.push('/dashboard/raw-materials')
    } catch (error) {
      console.error('Error deleting raw material:', error)
      toast.error('Failed to delete raw material')
    }
  }

  const getCategoryBadge = (category: MaterialCategory) => {
    const Icon = categoryIcons[category]
    return (
      <Badge variant="outline" className={`${categoryColors[category]} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {categoryLabels[category]}
      </Badge>
    )
  }

  const getNutritionData = () => {
    if (!rawMaterial) return []
    
    return [
      { label: 'Calories', value: rawMaterial.caloriesPer100g, unit: 'cal' },
      { label: 'Protein', value: rawMaterial.proteinPer100g, unit: 'g' },
      { label: 'Fat', value: rawMaterial.fatPer100g, unit: 'g' },
      { label: 'Carbohydrates', value: rawMaterial.carbsPer100g, unit: 'g' },
      { label: 'Fiber', value: rawMaterial.fiberPer100g, unit: 'g' },
    ]
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

  if (error || !rawMaterial) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Raw Material Not Found</h3>
          <p className="text-muted-foreground">
            {error || "The raw material you're looking for doesn't exist."}
          </p>
          <Button className="mt-4" onClick={() => router.push('/dashboard/raw-materials')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Raw Materials
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
          <h1 className="text-3xl font-bold tracking-tight">{rawMaterial.name}</h1>
          <p className="text-muted-foreground">
            Raw material details and nutritional information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/raw-materials/${id}/edit`}>
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
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg font-semibold">{rawMaterial.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="mt-1">
                    {getCategoryBadge(rawMaterial.category)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Unit</label>
                  <div className="mt-1">
                    <Badge variant="outline">{rawMaterial.unit}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">
                    {new Date(rawMaterial.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              {rawMaterial.description && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm mt-1">{rawMaterial.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Nutritional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Nutritional Information
                <Badge variant="secondary">per 100g</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {getNutritionData().map((nutrition) => (
                  <div key={nutrition.label} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {nutrition.value !== null ? nutrition.value : '--'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {nutrition.label}
                    </div>
                    {nutrition.value !== null && (
                      <div className="text-xs text-muted-foreground">
                        {nutrition.unit}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {getNutritionData().every(n => n.value === null) && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="mx-auto h-8 w-8 mb-2" />
                  <p>No nutritional information available</p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href={`/dashboard/raw-materials/${id}/edit`}>
                      Add Nutritional Data
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Related Information */}
        <div className="space-y-6">
          {/* Inventory Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Inventory Items</span>
                  <Badge variant="secondary">{rawMaterial.inventory.length}</Badge>
                </div>
                {rawMaterial.inventory.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Quantity</span>
                      <span className="text-sm font-medium">
                        {rawMaterial.inventory.reduce((sum, item) => sum + item.quantity, 0)} {rawMaterial.unit}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/dashboard/inventory?material=${rawMaterial.id}`}>
                        View Inventory
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Used in Menu Items</span>
                  <Badge variant="secondary">{rawMaterial.menuItems.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Purchase Orders</span>
                  <Badge variant="secondary">{rawMaterial.purchaseOrderItems.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Last updated: {new Date(rawMaterial.updatedAt).toLocaleDateString('id-ID')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Inventory Items */}
      {rawMaterial.inventory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Inventory Items</CardTitle>
            <CardDescription>
              Latest inventory items for this raw material
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawMaterial.inventory.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.quantity} {rawMaterial.unit}
                      </TableCell>
                      <TableCell>
                        Rp {item.unitPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>{item.supplier.name}</TableCell>
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
            {rawMaterial.inventory.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/inventory?material=${rawMaterial.id}`}>
                    View All Inventory Items ({rawMaterial.inventory.length})
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
