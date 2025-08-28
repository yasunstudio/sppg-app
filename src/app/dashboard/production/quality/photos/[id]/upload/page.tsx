"use client"

import { use } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { PhotoUpload } from "@/components/forms/photo-upload"
import { useRouter } from "next/navigation"

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

async function fetchQualityCheckpoint(id: string): Promise<Checkpoint> {
  const response = await fetch(`/api/quality/checkpoints/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch quality checkpoint")
  }
  return response.json()
}

async function uploadPhotos(id: string, photos: File[]): Promise<void> {
  // Create FormData for multipart upload
  const formData = new FormData();
  
  // Add files to FormData
  photos.forEach((file) => {
    formData.append('files', file);
  });
  
  // Optional: Add metadata
  formData.append('description', 'Quality checkpoint photos');
  formData.append('tags', 'quality-control,checkpoint');
  
  const response = await fetch(`/api/quality/checkpoints/${id}/photos`, {
    method: 'POST',
    body: formData // Send FormData instead of JSON
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to upload photos");
  }
  
  return response.json();
}

export default function PhotoUploadPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const { data: checkpoint, isLoading, error } = useQuery({
    queryKey: ["quality-checkpoint", id],
    queryFn: () => fetchQualityCheckpoint(id)
  })

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => uploadPhotos(id, files),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["quality-checkpoint-photos", id] })
      
      const { uploadedCount, errors } = data;
      
      if (errors && errors.length > 0) {
        toast.warning(`${uploadedCount} photos uploaded successfully. ${errors.length} failed: ${errors.join(', ')}`)
      } else {
        toast.success(`${uploadedCount} photos uploaded successfully`)
      }
      
      router.push(`/dashboard/production/quality/photos/${id}`)
    },
    onError: (error: any) => {
      console.error('Upload error:', error)
      toast.error(`Upload failed: ${error.message}`)
    }
  })

  const handleUpload = (files: File[]) => {
    uploadMutation.mutate(files)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/production/quality/photos/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Photos
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upload Photos</h1>
          </div>
        </div>
        <div className="text-center py-8">Loading checkpoint information...</div>
      </div>
    )
  }

  if (error || !checkpoint) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/production/quality/photos/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Photos
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upload Photos</h1>
          </div>
        </div>
        <div className="text-center py-8 text-destructive">
          Error loading checkpoint: {error?.message || "Checkpoint not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/production/quality/photos/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Photos
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Upload Photos</h1>
          <p className="text-muted-foreground">
            {checkpoint.checkpointType?.replace(/_/g, ' ')} - {checkpoint.productionPlan?.menu?.name}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Photo Upload Guidelines</h3>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• Take clear, well-lit photos showing the quality aspects</li>
                <li>• Include different angles and close-up details</li>
                <li>• Maximum file size: 10MB per image</li>
                <li>• Supported formats: JPG, PNG, GIF</li>
                <li>• Multiple photos can be uploaded at once</li>
              </ul>
            </div>
          </div>
        </div>

        <PhotoUpload
          onUpload={handleUpload}
          isUploading={uploadMutation.isPending}
          disabled={uploadMutation.isPending}
        />

        {uploadMutation.isPending && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Uploading photos...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
