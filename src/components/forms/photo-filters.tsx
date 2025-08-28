import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

interface PhotoFiltersProps {
  photos: Photo[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedTag: string | null
  setSelectedTag: (tag: string | null) => void
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function PhotoFilters({ 
  photos, 
  searchQuery, 
  setSearchQuery, 
  selectedTag, 
  setSelectedTag 
}: PhotoFiltersProps) {
  // Group tags into main categories to reduce filter clutter
  const getMainCategories = () => {
    const allTags = photos.flatMap((photo: Photo) => photo.tags)
    const categories = new Set<string>()
    
    allTags.forEach(tag => {
      if (tag.includes('final_product')) categories.add('final_product')
      else if (tag.includes('raw_material')) categories.add('raw_materials')
      else if (tag.includes('cooking')) categories.add('cooking')
      else if (tag.includes('packaging')) categories.add('packaging')
      else if (tag.includes('hygiene')) categories.add('hygiene')
      else if (tag.includes('inspection')) categories.add('inspection')
      else categories.add(tag)
    })
    
    return Array.from(categories)
  }
  
  const mainCategories = getMainCategories()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">
              Search Photos
            </label>
            <Input
              placeholder="Search by filename or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">
              Filter by Tag
            </label>
            <div className="space-y-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedTag(null)}
              >
                All Photos ({photos.length})
              </Button>
              {mainCategories.map((category: string) => {
                const count = photos.filter((p: Photo) => 
                  category === 'final_product' ? p.tags.some(tag => tag.includes('final_product')) :
                  category === 'raw_materials' ? p.tags.some(tag => tag.includes('raw_material')) :
                  category === 'cooking' ? p.tags.some(tag => tag.includes('cooking')) :
                  category === 'packaging' ? p.tags.some(tag => tag.includes('packaging')) :
                  category === 'hygiene' ? p.tags.some(tag => tag.includes('hygiene')) :
                  category === 'inspection' ? p.tags.some(tag => tag.includes('inspection')) :
                  p.tags.includes(category)
                ).length
                return (
                  <Button
                    key={category}
                    variant={selectedTag === category ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedTag(category)}
                  >
                    {category.replace(/_/g, ' ')} ({count})
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
            <span className="text-sm text-muted-foreground">Total Photos</span>
            <span className="font-medium">{photos.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Size</span>
            <span className="font-medium">
              {formatFileSize(photos.reduce((sum: number, photo: Photo) => sum + photo.size, 0))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Latest Upload</span>
            <span className="font-medium text-xs">
              {photos.length > 0 
                ? new Date(Math.max(...photos.map((p: Photo) => new Date(p.uploadedAt).getTime()))).toLocaleDateString()
                : 'None'
              }
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
