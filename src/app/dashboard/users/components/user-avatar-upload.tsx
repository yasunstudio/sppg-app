"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X, User } from "lucide-react"
import { validateFileClient } from "@/lib/upload-client"
import { toast } from "sonner"

interface UserAvatarUploadProps {
  value?: string | null
  onChange?: (url: string | null) => void
  userName?: string
  userEmail?: string
  disabled?: boolean
  userId?: string // For update operations
}

export function UserAvatarUpload({ 
  value, 
  onChange, 
  userName = "", 
  userEmail = "", 
  disabled = false,
  userId
}: UserAvatarUploadProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(value || null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when value prop changes
  useEffect(() => {
    setAvatarPreview(value || null)
  }, [value])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file on client-side first
    const validation = validateFileClient(file)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    try {
      setUploadingAvatar(true)

      // Create preview immediately
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)

      // Upload to server
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      const data = await response.json()
      
      // Update with server URL
      URL.revokeObjectURL(previewUrl)
      setAvatarPreview(data.url)
      onChange?.(data.url)

      // If this is for an existing user, update their avatar in the database immediately
      if (userId) {
        const updateFormData = new FormData()
        updateFormData.append('avatar', data.url)
        
        const updateResponse = await fetch(`/api/users/${userId}/avatar`, {
          method: 'PATCH',
          body: updateFormData,
        })

        if (!updateResponse.ok) {
          throw new Error('Failed to update user avatar')
        }
      }

      toast.success("Avatar uploaded successfully")
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast.error("Failed to upload avatar. Please try again.")
      setAvatarPreview(value || null)
    } finally {
      setUploadingAvatar(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      setAvatarPreview(null)
      onChange?.(null)

      // If this is for an existing user, remove their avatar from the database immediately
      if (userId) {
        const updateFormData = new FormData()
        updateFormData.append('avatar', '')
        
        const updateResponse = await fetch(`/api/users/${userId}/avatar`, {
          method: 'PATCH',
          body: updateFormData,
        })

        if (!updateResponse.ok) {
          throw new Error('Failed to remove user avatar')
        }
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      toast.success("Avatar removed")
    } catch (error) {
      console.error('Avatar removal error:', error)
      toast.error("Failed to remove avatar. Please try again.")
      setAvatarPreview(value || null)
    }
  }

  const getInitials = () => {
    if (userName) return userName.charAt(0).toUpperCase()
    if (userEmail) return userEmail.charAt(0).toUpperCase()
    return "U"
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="relative inline-block">
          <Avatar className="h-32 w-32 border-4 border-gray-200 shadow-lg">
            {avatarPreview ? (
              <AvatarImage src={avatarPreview} alt="Avatar preview" className="object-cover" />
            ) : (
              <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          {uploadingAvatar && (
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploadingAvatar}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {avatarPreview ? "Change Photo" : "Upload Photo"}
          </Button>
          
          {avatarPreview && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveAvatar}
              disabled={disabled || uploadingAvatar}
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Remove Photo
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>JPG, PNG, or GIF format</p>
          <p>Maximum file size: 10MB</p>
          <p>Recommended: Square image</p>
        </div>
        
        {uploadingAvatar && (
          <p className="text-sm text-blue-600 flex items-center justify-center font-medium">
            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            Uploading photo...
          </p>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
    </div>
  )
}
