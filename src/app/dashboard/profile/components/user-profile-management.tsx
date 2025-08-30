"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Camera,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Save,
  Key,
  Activity
} from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string | null
  address: string | null
  image: string | null
  emailVerified: Date | null
  isActive: boolean
  profile?: {
    bio: string | null
    dateOfBirth: Date | null
    gender: string | null
  }
  roles: {
    role: {
      name: string
      description: string
    }
  }[]
  preferences?: {
    notifications: boolean
    theme: string
    language: string
  }
}

export function UserProfileManagement() {
  const { data: session, update } = useSession()
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/users/profile')
        if (!response.ok) throw new Error('Failed to fetch profile')
        
        const data = await response.json()
        setUserProfile(data)
        
        // Update form with current data
        profileForm.reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          bio: data.profile?.bio || '',
          dateOfBirth: data.profile?.dateOfBirth ? 
            new Date(data.profile.dateOfBirth).toISOString().split('T')[0] : '',
          gender: data.profile?.gender || undefined,
        })
      } catch (error) {
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [profileForm, toast])

  // Handle profile image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Submit profile form
  const onProfileSubmit = async (data: ProfileFormData) => {
    setSaving(true)
    try {
      const formData = new FormData()
      
      // Add profile data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value)
        }
      })
      
      // Add image if selected
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to update profile')

      const updatedProfile = await response.json()
      setUserProfile(updatedProfile)
      setPreviewImage(null)
      setImageFile(null)
      
      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: updatedProfile.name,
          email: updatedProfile.email,
          image: updatedProfile.image,
        }
      })

      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  // Submit password form
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setSaving(true)
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to change password')
      }

      passwordForm.reset()
      setShowPasswordDialog(false)
      
      toast.success("Password changed successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  // Toggle notification preferences
  const updateNotificationPreference = async (enabled: boolean) => {
    try {
      const response = await fetch('/api/users/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: enabled }),
      })

      if (!response.ok) throw new Error('Failed to update preferences')

      toast.success("Notification preferences updated")
    } catch (error) {
      toast.error("Failed to update preferences")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load profile data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewImage || userProfile.image || undefined} />
                  <AvatarFallback className="text-lg">
                    {userProfile.name?.charAt(0).toUpperCase() || userProfile.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Camera className="h-4 w-4 mr-2" />
                          Change Picture
                        </span>
                      </Button>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...profileForm.register("name")}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-600">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register("email")}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-red-600">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...profileForm.register("phone")}
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-sm text-red-600">{profileForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profileForm.watch("gender") || ""}
                      onValueChange={(value) => profileForm.setValue("gender", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...profileForm.register("dateOfBirth")}
                    />
                    {profileForm.formState.errors.dateOfBirth && (
                      <p className="text-sm text-red-600">{profileForm.formState.errors.dateOfBirth.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...profileForm.register("address")}
                  />
                  {profileForm.formState.errors.address && (
                    <p className="text-sm text-red-600">{profileForm.formState.errors.address.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...profileForm.register("bio")}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
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
              </form>
            </CardContent>
          </Card>

          {/* Role Information */}
          <Card>
            <CardHeader>
              <CardTitle>Role & Permissions</CardTitle>
              <CardDescription>
                Your current roles and access levels in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Current Roles</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userProfile.roles.map((userRole, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        <Shield className="h-3 w-3" />
                        {userRole.role.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Account Status</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={userProfile.isActive ? "default" : "destructive"}>
                      {userProfile.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {userProfile.emailVerified && (
                      <Badge variant="outline" className="gap-1">
                        <Mail className="h-3 w-3" />
                        Email Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Last changed: {userProfile.profile ? "Recently" : "Unknown"}
                  </p>
                </div>
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          {...passwordForm.register("currentPassword")}
                        />
                        {passwordForm.formState.errors.currentPassword && (
                          <p className="text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          {...passwordForm.register("newPassword")}
                        />
                        {passwordForm.formState.errors.newPassword && (
                          <p className="text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...passwordForm.register("confirmPassword")}
                        />
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                          {saving ? "Changing..." : "Change Password"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch
                  checked={userProfile.preferences?.notifications ?? true}
                  onCheckedChange={updateNotificationPreference}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent actions and login history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Activity log coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
