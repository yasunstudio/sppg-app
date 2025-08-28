"use client"

import { use } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Download, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { PhotoFilters } from "@/components/forms/photo-filters"
import { PhotoCard } from "@/components/forms/photo-card"
import { PhotoModal } from "@/components/forms/photo-modal"
import {
  ThemeAwareAlertDialog as AlertDialog,
  ThemeAwareAlertDialogAction as AlertDialogAction,
  ThemeAwareAlertDialogCancel as AlertDialogCancel,
  ThemeAwareAlertDialogContent as AlertDialogContent,
  ThemeAwareAlertDialogDescription as AlertDialogDescription,
  ThemeAwareAlertDialogFooter as AlertDialogFooter,
  ThemeAwareAlertDialogHeader as AlertDialogHeader,
  ThemeAwareAlertDialogTitle as AlertDialogTitle,
} from "@/components/ui/theme-aware-alert-dialog"

interface Photo {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  uploadedAt: string
  uploadedBy: {
    id: string
    name: string
    email: string
  }
  description: string
  tags: string[]
  checkpointId: string
  checkpointType: string
}

interface Checkpoint {
  id: string
  checkpointType: string
  status: string
  checkedAt: string
  checker: {
    id: string
    name: string
    email: string
  }
  productionPlan?: {
    id: string
    planDate: string
    targetPortions: number
    menu: {
      id: string
      name: string
      mealType: string
    }
  }
  batch?: {
    id: string
    batchNumber: string
    status: string
  }
  temperature?: number
  notes?: string
}

interface PhotosResponse {
  checkpoint: Checkpoint
  photos: Photo[]
}

async function fetchQualityCheckpointPhotos(id: string): Promise<PhotosResponse> {
  const response = await fetch(`/api/quality/checkpoints/${id}/photos`)
  if (!response.ok) {
    throw new Error("Failed to fetch quality checkpoint photos")
  }
  return response.json()
}

async function deletePhoto(id: string, photoUrl: string): Promise<void> {
  const response = await fetch(`/api/quality/checkpoints/${id}/photos`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoUrl })
  })
  
  if (!response.ok) {
    throw new Error("Failed to delete photo")
  }
}

export default function QualityPhotosPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const queryClient = useQueryClient()
  
  // State management
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null)
  
  // Data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ["quality-checkpoint-photos", id],
    queryFn: () => fetchQualityCheckpointPhotos(id)
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (photoUrl: string) => deletePhoto(id, photoUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality-checkpoint-photos", id] })
      toast.success("Photo deleted successfully")
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`)
    }
  })

  // Handle photo deletion
  const handleDeletePhoto = (photo: Photo) => {
    setPhotoToDelete(photo)
    setDeleteDialogOpen(true)
  }

  const confirmDeletePhoto = () => {
    if (photoToDelete) {
      deleteMutation.mutate(photoToDelete.url)
      setDeleteDialogOpen(false)
      setPhotoToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 bg-background text-foreground min-h-screen p-6">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Checkpoint
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Quality Photos</h1>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading photos from database...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6 bg-background text-foreground min-h-screen p-6">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Checkpoint
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Quality Photos</h1>
          </div>
        </div>
        <div className="text-center py-8 text-destructive">
          Error loading photos from database: {error?.message || "Photos not found"}
        </div>
      </div>
    )
  }

  const { checkpoint, photos } = data

  // Filter photos based on search and tag with proper typing
  const filteredPhotos = photos.filter((photo: Photo) => {
    const matchesSearch = searchQuery === "" || 
      photo.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = selectedTag === null || 
      (selectedTag === 'final_product' && photo.tags.some(tag => tag.includes('final_product'))) ||
      (selectedTag === 'raw_materials' && photo.tags.some(tag => tag.includes('raw_material'))) ||
      (selectedTag === 'cooking' && photo.tags.some(tag => tag.includes('cooking'))) ||
      (selectedTag === 'packaging' && photo.tags.some(tag => tag.includes('packaging'))) ||
      (selectedTag === 'hygiene' && photo.tags.some(tag => tag.includes('hygiene'))) ||
      (selectedTag === 'inspection' && photo.tags.some(tag => tag.includes('inspection'))) ||
      photo.tags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  return (
    <div className="space-y-6 bg-background text-foreground min-h-screen">
      <div className="flex items-center space-x-4 p-6 bg-card border-b border-border">
        <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Checkpoint
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Quality Photos</h1>
          <p className="text-muted-foreground">
            {checkpoint.checkpointType?.replace(/_/g, ' ')} - {checkpoint.productionPlan?.menu?.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/production/quality/photos/${id}/upload`}>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Photos
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <PhotoFilters
            photos={photos}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />

          {/* Photos Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPhotos.length} of {photos.length} photos
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              </div>
            </div>

            {filteredPhotos.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="py-8 text-center">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {photos.length === 0 
                      ? "No photos have been uploaded for this quality checkpoint yet" 
                      : "No photos found matching your search criteria"
                    }
                  </p>
                  <Link href={`/dashboard/production/quality/photos/${id}/upload`}>
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Photos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPhotos.map((photo: Photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    checkpointId={id}
                    onView={setSelectedPhoto}
                    onDelete={handleDeletePhoto}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      <PhotoModal 
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader>
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 border-2 border-destructive/20">
                <svg
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <AlertDialogTitle>
                  Delete Quality Photo
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to permanently delete this quality control photo?
            </p>
            
            {/* Photo Information Card */}
            {photoToDelete && (
              <div className="rounded-lg p-4 border border-border bg-muted/50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-primary" 
                      fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold mb-1 break-words text-foreground">
                      {photoToDelete.filename}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Uploaded {new Date(photoToDelete.uploadedAt).toLocaleDateString()} by {photoToDelete.uploadedBy.name}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Warning Section */}
            <div className="rounded-lg p-4 border border-destructive/20 bg-destructive/5">
              <div className="flex items-start space-x-3">
                <svg className="h-5 w-5 mt-0.5 flex-shrink-0 text-destructive" 
                  fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <div className="font-semibold mb-1 text-destructive">
                    Warning
                  </div>
                  <div className="text-muted-foreground">
                    The photo will be permanently removed from this quality checkpoint and cannot be recovered.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPhotoToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeletePhoto}
              disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Photo"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
