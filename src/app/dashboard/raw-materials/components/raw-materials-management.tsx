"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Package, 
  Search,
  RefreshCw,
  MoreHorizontal,
  Edit,
  Eye,
  Plus,
  Trash2,
  Wheat,
  Beef,
  Apple,
  Droplet,
  Milk,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

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
  inventoryCount: number
  createdAt: string
  updatedAt: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface RawMaterialsResponse {
  success: boolean
  data: RawMaterial[]
  pagination: PaginationData
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

export function RawMaterialsManagement() {
  const router = useRouter()
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pagination, setPagination] = useState<PaginationData | null>(null)

  const fetchRawMaterials = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        category: categoryFilter === "all" ? "" : categoryFilter,
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/raw-materials?${params}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: RawMaterialsResponse = await response.json()
      
      if (data.success) {
        setRawMaterials(data.data)
        setPagination(data.pagination)
      } else {
        throw new Error('Failed to fetch raw materials')
      }
    } catch (error) {
      console.error('Error fetching raw materials:', error)
      toast.error('Failed to fetch raw materials')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [currentPage, itemsPerPage, searchTerm, categoryFilter, sortBy, sortOrder])

  useEffect(() => {
    setLoading(true)
    fetchRawMaterials()
  }, [fetchRawMaterials])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchRawMaterials()
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete raw material "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/raw-materials/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete raw material')
      }

      toast.success(`Raw material "${name}" deleted successfully`)
      fetchRawMaterials() // Refresh the list
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

  const getNutritionSummary = (material: RawMaterial) => {
    const values = [
      material.caloriesPer100g,
      material.proteinPer100g,
      material.fatPer100g,
      material.carbsPer100g,
      material.fiberPer100g
    ]
    const filledValues = values.filter(v => v !== null && v !== undefined).length
    return `${filledValues}/5 nutrition values`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Raw Materials</h1>
            <p className="text-muted-foreground">Loading raw materials...</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Loading...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raw Materials</h1>
          <p className="text-muted-foreground">
            Manage raw materials and their nutritional information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/dashboard/raw-materials/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Raw Material
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search raw materials..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-full sm:w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Raw Materials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Raw Materials
            {pagination && (
              <Badge variant="secondary">
                {pagination.total} total
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Nutrition Info</TableHead>
                  <TableHead>Inventory Items</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('updatedAt')}
                  >
                    Last Updated {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rawMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No raw materials found
                    </TableCell>
                  </TableRow>
                ) : (
                  rawMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{material.name}</div>
                          {material.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {material.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(material.category)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{material.unit}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-muted-foreground">
                            {getNutritionSummary(material)}
                          </div>
                          {material.caloriesPer100g && (
                            <div className="font-medium">
                              {material.caloriesPer100g} cal/100g
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {material.inventoryCount || 0} items
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(material.updatedAt).toLocaleDateString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/raw-materials/${material.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/raw-materials/${material.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(material.id, material.name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
