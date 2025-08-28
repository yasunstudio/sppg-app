import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Save, Loader2 } from "lucide-react"

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

interface PhotoEditModalProps {
  photo: Photo | null
  isOpen: boolean
  onClose: () => void
  onSave: (photoId: string, data: { description: string; tags: string[] }) => void
  isSaving?: boolean
}

export function PhotoEditModal({ 
  photo, 
  isOpen, 
  onClose, 
  onSave, 
  isSaving = false 
}: PhotoEditModalProps) {
  const [description, setDescription] = useState(photo?.description || "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(photo?.tags || [])

  // Update state when photo changes
  useEffect(() => {
    if (photo) {
      setDescription(photo.description || "")
      setTags(photo.tags || [])
      setTagInput("")
    }
  }, [photo])

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase()
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setTagInput("")
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

  const handleSave = () => {
    if (photo) {
      onSave(photo.id, { description, tags })
    }
  }

  if (!photo) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Photo Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Photo Preview */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={photo.url}
              alt={photo.filename}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Photo Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Filename</Label>
              <p className="font-medium">{photo.filename}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Size</Label>
              <p className="font-medium">{formatFileSize(photo.size)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Uploaded By</Label>
              <p className="font-medium">{photo.uploadedBy.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Upload Date</Label>
              <p className="font-medium">{new Date(photo.uploadedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter photo description..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
