"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Camera, Upload, Download, Eye, Search, Filter } from "lucide-react"
import Link from "next/link"

async function fetchQualityCheckpoints() {
  const response = await fetch("/api/production/quality-checkpoints?limit=50")
  if (!response.ok) throw new Error("Failed to fetch quality checkpoints")
  const result = await response.json()
  return result.data || []
}

const photoCategories = [
  { value: "raw_materials", label: "Raw Materials" },
  { value: "cooking_process", label: "Cooking Process" },
  { value: "final_product", label: "Final Product" },
  { value: "hygiene_check", label: "Hygiene Check" },
  { value: "temperature_monitoring", label: "Temperature Monitoring" },
  { value: "packaging", label: "Packaging" },
  { value: "storage", label: "Storage" },
  { value: "issue_documentation", label: "Issue Documentation" }
]

export default function PhotoDocumentationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")

  const { data: qualityCheckpoints = [], isLoading } = useQuery({
    queryKey: ["quality-checkpoints"],
    queryFn: fetchQualityCheckpoints
  })

  // Mock photo data - in real app this would come from API
  const photos = [
    {
      id: "1",
      checkpointId: qualityCheckpoints[0]?.id,
      category: "raw_materials",
      title: "Fresh Vegetables Inspection",
      description: "Quality check of incoming vegetables",
      url: "/api/placeholder/400/300",
      timestamp: "2025-08-28T08:30:00Z",
      uploadedBy: "Dra. Fatimah Ahmad, S.Gz"
    },
    {
      id: "2", 
      checkpointId: qualityCheckpoints[1]?.id,
      category: "cooking_process",
      title: "Cooking Temperature Check",
      description: "Temperature monitoring during cooking process",
      url: "/api/placeholder/400/300",
      timestamp: "2025-08-28T10:15:00Z",
      uploadedBy: "Chef Ahmad Subhan"
    },
    {
      id: "3",
      checkpointId: qualityCheckpoints[2]?.id,
      category: "final_product",
      title: "Final Meal Presentation",
      description: "Final quality check before serving",
      url: "/api/placeholder/400/300",
      timestamp: "2025-08-28T11:45:00Z",
      uploadedBy: "Nutritionist Sari"
    },
    {
      id: "4",
      checkpointId: qualityCheckpoints[3]?.id,
      category: "hygiene_check",
      title: "Kitchen Sanitation",
      description: "Post-cleaning kitchen area inspection",
      url: "/api/placeholder/400/300",
      timestamp: "2025-08-28T14:20:00Z",
      uploadedBy: "Supervisor Budi"
    },
    {
      id: "5",
      checkpointId: qualityCheckpoints[4]?.id,
      category: "packaging",
      title: "Meal Packaging Quality",
      description: "Packaging integrity and labeling check",
      url: "/api/placeholder/400/300",
      timestamp: "2025-08-28T12:30:00Z",
      uploadedBy: "QC Team Lead"
    },
    {
      id: "6",
      checkpointId: qualityCheckpoints[5]?.id,
      category: "issue_documentation",
      title: "Temperature Deviation Issue",
      description: "Documentation of temperature control issue",
      url: "/api/placeholder/400/300",
      timestamp: "2025-08-27T16:45:00Z",
      uploadedBy: "Production Manager"
    }
  ]

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || photo.category === categoryFilter
    const matchesDate = !dateFilter || photo.timestamp.startsWith(dateFilter)
    
    return matchesSearch && matchesCategory && matchesDate
  })

  const getCategoryLabel = (category: string) => {
    return photoCategories.find(cat => cat.value === category)?.label || category
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      raw_materials: "bg-green-100 text-green-800",
      cooking_process: "bg-blue-100 text-blue-800",
      final_product: "bg-purple-100 text-purple-800",
      hygiene_check: "bg-yellow-100 text-yellow-800",
      temperature_monitoring: "bg-red-100 text-red-800",
      packaging: "bg-indigo-100 text-indigo-800",
      storage: "bg-gray-100 text-gray-800",
      issue_documentation: "bg-orange-100 text-orange-800"
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/production/quality">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quality Control
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Photo Documentation</h1>
          <p className="text-muted-foreground">
            Visual documentation of quality control checkpoints and procedures
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Photo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search Photos</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {photoCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredPhotos.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Photos Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter !== "all" || dateFilter
                      ? "Try adjusting your search or filter criteria."
                      : "Start by uploading your first quality control photo."}
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload First Photo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={`https://picsum.photos/400/300?random=${photo.id}`}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getCategoryColor(photo.category)}>
                    {getCategoryLabel(photo.category)}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{photo.title}</h3>
                  <p className="text-sm text-muted-foreground">{photo.description}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      <div>By: {photo.uploadedBy}</div>
                      <div>{new Date(photo.timestamp).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Link href={`/dashboard/production/quality/photos/${photo.checkpointId || '1'}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{photos.length}</div>
              <div className="text-sm text-muted-foreground">Total Photos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{new Set(photos.map(p => p.category)).size}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{new Set(photos.map(p => p.uploadedBy)).size}</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {photos.filter(p => p.timestamp.startsWith(new Date().toISOString().split('T')[0])).length}
              </div>
              <div className="text-sm text-muted-foreground">Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
