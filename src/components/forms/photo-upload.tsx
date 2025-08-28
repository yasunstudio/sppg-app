import { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, FileImage } from "lucide-react"

interface PhotoUploadProps {
  onUpload: (files: File[]) => void
  isUploading: boolean
  disabled?: boolean
}

export function PhotoUpload({ onUpload, isUploading, disabled = false }: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          return false;
        }
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          return false;
        }
        return true;
      })
      setSelectedFiles(files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          return false;
        }
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          return false;
        }
        return true;
      });
      
      if (files.length !== e.target.files.length) {
        // Some files were filtered out
        const invalidCount = e.target.files.length - files.length;
        console.warn(`${invalidCount} file(s) were excluded (invalid type or too large)`);
      }
      
      setSelectedFiles(files);
    }
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles)
      setSelectedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          
          <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          
          <div className="space-y-2">
            <p className="text-lg font-medium">Drop images here or click to upload</p>
            <p className="text-sm text-muted-foreground">
              Supports: JPG, PNG, GIF, WebP up to 10MB each
            </p>
          </div>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="mt-4"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Images
          </Button>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleUpload}
                disabled={disabled || isUploading || selectedFiles.length === 0}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedFiles([])}
                disabled={disabled || isUploading}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
