"use client"

import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Camera, Download, Upload, ZoomIn, Trash2, Edit, Calendar, User, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

async function fetchQualityCheckpointPhotos(id: string) {
  // Mock data structure - replace with real API call
  return {
    checkpoint: {
      id: id,
      checkpointType: "FINAL_INSPECTION",
      status: "PASS",
      checkedAt: new Date().toISOString(),
      checker: { name: "Chef Maria" },
      productionPlan: {
        id: "1",
        menu: { name: "Nasi Gudeg Ayam" }
      }
    },
    photos: [
      {
        id: "1",
        filename: "final_inspection_001.jpg",
        url: "/api/placeholder/400/300",
        mimeType: "image/jpeg",
        size: 245760,
        uploadedAt: new Date(Date.now() - 3600000).toISOString(),
        uploadedBy: { name: "Chef Maria" },
        description: "Final plating inspection - all portions checked",
        tags: ["final_inspection", "plating", "portion_control"]
      },
      {
        id: "2", 
        filename: "temperature_check_002.jpg",
        url: "/api/placeholder/400/300",
        mimeType: "image/jpeg",
        size: 189432,
        uploadedAt: new Date(Date.now() - 2400000).toISOString(),
        uploadedBy: { name: "Chef Maria" },
        description: "Temperature probe reading during cooking",
        tags: ["temperature", "cooking", "monitoring"]
      },
      {
        id: "3",
        filename: "ingredient_prep_003.jpg", 
        url: "/api/placeholder/400/300",
        mimeType: "image/jpeg",
        size: 432156,
        uploadedAt: new Date(Date.now() - 7200000).toISOString(),
        uploadedBy: { name: "Staff Andi" },
        description: "Fresh ingredients prepared for cooking",
        tags: ["ingredients", "preparation", "freshness"]
      },
      {
        id: "4",
        filename: "hygiene_check_004.jpg",
        url: "/api/placeholder/400/300", 
        mimeType: "image/jpeg",
        size: 356789,
        uploadedAt: new Date(Date.now() - 5400000).toISOString(),
        uploadedBy: { name: "QC Inspector" },
        description: "Kitchen hygiene and cleanliness verification",
        tags: ["hygiene", "cleanliness", "safety"]
      },
      {
        id: "5",
        filename: "packaging_005.jpg",
        url: "/api/placeholder/400/300",
        mimeType: "image/jpeg", 
        size: 198765,
        uploadedAt: new Date(Date.now() - 1800000).toISOString(),
        uploadedBy: { name: "Packaging Team" },
        description: "Final packaging and labeling check",
        tags: ["packaging", "labeling", "final_check"]
      },
      {
        id: "6",
        filename: "delivery_prep_006.jpg",
        url: "/api/placeholder/400/300",
        mimeType: "image/jpeg",
        size: 287543,
        uploadedAt: new Date(Date.now() - 900000).toISOString(), 
        uploadedBy: { name: "Logistics Team" },
        description: "Food containers ready for delivery",
        tags: ["delivery", "containers", "logistics"]
      }
    ]
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function QualityPhotosPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["quality-checkpoint-photos", id],
    queryFn: () => fetchQualityCheckpointPhotos(id)
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkpoint
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quality Photos</h1>
          </div>
        </div>
        <div className="text-center py-8">Loading photos...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkpoint
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quality Photos</h1>
          </div>
        </div>
        <div className="text-center py-8 text-red-600">
          Error loading photos
        </div>
      </div>
    )
  }

  const { checkpoint, photos } = data

  // Get all unique tags
  const allTags = Array.from(new Set(photos.flatMap(photo => photo.tags)))

  // Filter photos based on search and tag
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = searchQuery === "" || 
      photo.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = selectedTag === null || photo.tags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkpoint
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Quality Photos</h1>
          <p className="text-muted-foreground">
            {checkpoint.checkpointType?.replace(/_/g, ' ')} - {checkpoint.productionPlan?.menu?.name}
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Photos
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Photos</label>
                <Input
                  placeholder="Search by filename or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Tag</label>
                <div className="space-y-2">
                  <Button
                    variant={selectedTag === null ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedTag(null)}
                  >
                    All Photos ({photos.length})
                  </Button>
                  {allTags.map(tag => {
                    const count = photos.filter(p => p.tags.includes(tag)).length
                    return (
                      <Button
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag.replace(/_/g, ' ')} ({count})
                      </Button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photo Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Photos</span>
                <span className="font-medium">{photos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Size</span>
                <span className="font-medium">
                  {formatFileSize(photos.reduce((sum, photo) => sum + photo.size, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Latest Upload</span>
                <span className="font-medium text-xs">
                  {new Date(Math.max(...photos.map(p => new Date(p.uploadedAt).getTime()))).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photos Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPhotos.length} of {photos.length} photos
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>

          {filteredPhotos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No photos found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={photo.url}
                      alt={photo.description || photo.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedPhoto(photo.id)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm truncate">{photo.filename}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {photo.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {photo.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {photo.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{photo.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{photo.uploadedBy.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(photo.uploadedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{formatFileSize(photo.size)}</span>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Modal - You can implement a proper modal here */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">
                {filteredPhotos.find(p => p.id === selectedPhoto)?.filename}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhoto(null)}
              >
                ×
              </Button>
            </div>
            <div className="p-4">
              <img
                src={filteredPhotos.find(p => p.id === selectedPhoto)?.url}
                alt="Full size"
                className="max-w-full max-h-[70vh] mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
