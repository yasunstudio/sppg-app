"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, X, Loader2, Plus, Upload, Camera } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import Image from "next/image"

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
  productionPlan: {
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

async function updatePhoto(
  checkpointId: string, 
  photoId: string, 
  data: { description: string; tags: string[] }
): Promise<void> {
  const response = await fetch(`/api/quality/checkpoints/${checkpointId}/photos/${photoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    throw new Error("Failed to update photo")
  }
}

async function replacePhoto(
  checkpointId: string,
  photoId: string,
  file: File
): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('photoId', photoId)

  const response = await fetch(`/api/quality/checkpoints/${checkpointId}/photos/${photoId}/replace`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error("Failed to replace photo")
  }
}

export default function EditPhotoPage({
  params
}: {
  params: Promise<{ id: string; photoId: string }>
}) {
  const { id, photoId } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  
  // Form state
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Load photo data
  useEffect(() => {
    const loadPhotoData = async () => {
      setIsLoading(true)
      await loadPhoto()
      setIsLoading(false)
    }

    loadPhotoData()
  }, [id, photoId, router])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { description: string; tags: string[] }) => 
      updatePhoto(id, photoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality-checkpoint-photos", id] })
      toast.success("Photo updated successfully")
      router.push(`/dashboard/production/quality/photos/${id}`)
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`)
    }
  })

  // Replace photo mutation
  const replaceMutation = useMutation({
    mutationFn: (file: File) => replacePhoto(id, photoId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality-checkpoint-photos", id] })
      toast.success("Photo replaced successfully")
      setSelectedFile(null)
      setPreviewUrl(null)
      // Reload photo data
      loadPhoto()
    },
    onError: (error) => {
      toast.error(`Replace failed: ${error.message}`)
    }
  })

  const loadPhoto = async () => {
    try {
      const data = await fetchQualityCheckpointPhotos(id)
      const foundPhoto = data.photos.find(p => p.id === photoId)
      
      if (foundPhoto) {
        setPhoto(foundPhoto)
        setCheckpoint(data.checkpoint)
        setDescription(foundPhoto.description || "")
        setTags(foundPhoto.tags || [])
      } else {
        toast.error("Photo not found")
        router.push(`/dashboard/production/quality/photos/${id}`)
      }
    } catch (error) {
      console.error("Error loading photo:", error)
      toast.error("Failed to load photo data")
      router.push(`/dashboard/production/quality/photos/${id}`)
    }
  }

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Form submission
  const handleSave = () => {
    updateMutation.mutate({
      description: description.trim(),
      tags: tags
    })
  }

  const handleCancel = () => {
    router.push(`/dashboard/production/quality/photos/${id}`)
  }

  // File handling
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file")
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }

      setSelectedFile(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleReplacePhoto = () => {
    if (selectedFile) {
      replaceMutation.mutate(selectedFile)
    }
  }

  const handleCancelReplace = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 bg-background text-foreground min-h-screen">
        <div className="flex items-center space-x-4 p-6 bg-card border-b border-border">
          <Link href={`/dashboard/production/quality/photos/${id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Photos
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Photo</h1>
            <p className="text-muted-foreground">Loading photo data...</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!photo || !checkpoint) {
    return (
      <div className="space-y-6 bg-background text-foreground min-h-screen">
        <div className="flex items-center space-x-4 p-6 bg-card border-b border-border">
          <Link href={`/dashboard/production/quality/photos/${id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Photos
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Photo</h1>
            <p className="text-muted-foreground">Photo not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-4 p-6 bg-card border-b border-border">
        <Link href={`/dashboard/production/quality/photos/${id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Photos
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Photo</h1>
          <p className="text-muted-foreground">
            Quality checkpoint for {checkpoint.productionPlan.menu.name} • {checkpoint.productionPlan.menu.mealType}
          </p>
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Photo Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Photo Preview
              {!selectedFile && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <span>
                        <Camera className="h-4 w-4" />
                        Replace Photo
                      </span>
                    </Button>
                  </label>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={previewUrl || photo.url}
                alt={photo.description || photo.filename}
                fill
                className="object-cover"
                priority
              />
              {selectedFile && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium text-center">Replace with new photo?</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleReplacePhoto}
                        disabled={replaceMutation.isPending}
                        className="gap-1"
                      >
                        {replaceMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Upload className="h-3 w-3" />
                        )}
                        Replace
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelReplace}
                        disabled={replaceMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p><strong>Filename:</strong> {selectedFile ? selectedFile.name : photo.filename}</p>
              <p><strong>Size:</strong> {selectedFile ? (selectedFile.size / 1024).toFixed(1) : (photo.size / 1024).toFixed(1)} KB</p>
              <p><strong>Uploaded:</strong> {new Date(photo.uploadedAt).toLocaleString()}</p>
              <p><strong>By:</strong> {photo.uploadedBy.name}</p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Photo Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter photo description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              
              {/* Existing tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add new tag */}
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  disabled={!newTag.trim() || tags.includes(newTag.trim())}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="gap-2"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
