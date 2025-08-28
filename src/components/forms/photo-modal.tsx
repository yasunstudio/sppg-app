import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

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

interface PhotoModalProps {
  photo: Photo | null
  onClose: () => void
}

export function PhotoModal({ photo, onClose }: PhotoModalProps) {
  if (!photo) return null

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background border border-border rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <h3 className="font-medium text-foreground">
            {photo.filename}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 bg-background">
          <img
            src={photo.url}
            alt={photo.description}
            className="max-w-full max-h-[70vh] mx-auto rounded-lg"
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">{photo.description}</p>
            <div className="flex flex-wrap gap-1">
              {photo.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Uploaded by {photo.uploadedBy.name}</span>
              <span>{new Date(photo.uploadedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
