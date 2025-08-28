import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, Download, Edit, Trash2, User, Clock } from "lucide-react"
import Link from "next/link"

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

interface PhotoCardProps {
  photo: Photo
  checkpointId: string
  onView: (photo: Photo) => void
  onDelete: (photo: Photo) => void
  isDeleting?: boolean
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function PhotoCard({ photo, checkpointId, onView, onDelete, isDeleting = false }: PhotoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-muted">
        <img
          src={photo.url}
          alt={photo.description || photo.filename}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
            onClick={() => onView(photo)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
            onClick={() => window.open(photo.url, '_blank')}
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
            {photo.tags.slice(0, 2).map((tag: string) => (
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
                <Link href={`/dashboard/production/quality/photos/${checkpointId}/edit/${photo.id}`}>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  onClick={() => onDelete(photo)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
