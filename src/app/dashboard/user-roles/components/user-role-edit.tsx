"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  User,
  Shield,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { toast } from '@/lib/toast'

interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  roles: {
    role: {
      id: string
      name: string
      description: string | null
    }
  }[]
}

interface Role {
  id: string
  name: string
  description: string | null
  permissions: string[]
}

interface UserRoleEditProps {
  userId: string
}

export function UserRoleEdit({ userId }: UserRoleEditProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserDetails = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/users/${userId}?include=roles`)
      if (response.ok) {
        const result = await response.json()
        const userData = result.user || result.data
        setUser(userData)
        setSelectedRoleIds(userData.roles.map((ur: any) => ur.role.id))
      } else if (response.status === 404) {
        setError('User not found')
      } else {
        setError('Failed to fetch user details')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      setError('Error fetching user details')
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles')
      if (response.ok) {
        const result = await response.json()
        setRoles(result.data || [])
      } else {
        setError('Failed to fetch roles')
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      setError('Error fetching roles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.all([fetchUserDetails(), fetchRoles()])
  }, [userId])

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoleIds(prev => [...prev, roleId])
    } else {
      setSelectedRoleIds(prev => prev.filter(id => id !== roleId))
    }
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const response = await fetch('/api/roles/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          roleIds: selectedRoleIds,
        }),
      })

      if (response.ok) {
        toast.success('Roles updated successfully!')
        router.push(`/dashboard/user-roles/${userId}`)
      } else {
        const error = await response.json()
        toast.error('Failed to update roles')
        setError('Failed to update roles')
      }
    } catch (error) {
      console.error('Error updating roles:', error)
      toast.error('Error updating roles')
      setError('Error updating roles')
    } finally {
      setSaving(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    Promise.all([fetchUserDetails(), fetchRoles()])
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading user and roles...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg">⚠️</div>
            <p className="text-red-600">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">User not found</p>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="w-8 h-8" />
              Edit User Roles
            </h1>
            <p className="text-muted-foreground">
              Assign or remove roles for this user
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback>
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Roles Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Current Role Assignment
          </CardTitle>
          <CardDescription>
            Currently selected: {selectedRoleIds.length} role{selectedRoleIds.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedRoleIds.length > 0 ? (
              selectedRoleIds.map((roleId) => {
                const role = roles.find(r => r.id === roleId)
                return role ? (
                  <Badge key={roleId} variant="default">
                    {role.name}
                  </Badge>
                ) : null
              })
            ) : (
              <span className="text-muted-foreground">No roles selected</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Available Roles
          </CardTitle>
          <CardDescription>
            Select the roles you want to assign to this user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">No roles available</p>
              </div>
            ) : (
              roles.map((role, index) => (
                <div key={role.id}>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={(checked) => 
                        handleRoleToggle(role.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <Label 
                        htmlFor={`role-${role.id}`} 
                        className="text-sm font-medium cursor-pointer block"
                      >
                        {role.name}
                      </Label>
                      {role.description && (
                        <p className="text-xs text-muted-foreground">
                          {role.description}
                        </p>
                      )}
                      {role.permissions && role.permissions.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Permissions ({role.permissions.length}):
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                            {role.permissions.slice(0, 8).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                            {role.permissions.length > 8 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 8} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {index < roles.length - 1 && <Separator className="my-2" />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p>Make sure to save your changes before leaving this page.</p>
              <p>Changes will be applied immediately after saving.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
        </CardContent>
      </Card>
    </div>
  )
}
