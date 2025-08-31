"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Shield, 
  Save,
  ArrowLeft,
  RefreshCw,
  Key,
  Settings
} from 'lucide-react'
import { toast } from '@/lib/toast'
import { PERMISSIONS } from '@/lib/permissions'

interface Role {
  id: string
  name: string
  description: string | null
  permissions: string[]
  userCount: number
  permissionCount: number
  createdAt: string
  updatedAt: string
}

interface FormData {
  name: string
  description: string
  permissions: string[]
}

export function RoleEdit() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.roleId as string
  
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    permissions: []
  })

  useEffect(() => {
    if (roleId) {
      fetchRoleDetails()
    }
  }, [roleId])

  const fetchRoleDetails = async () => {
    try {
      const response = await fetch(`/api/roles/${roleId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        const roleData = result.data
        setRole(roleData)
        setFormData({
          name: roleData.name,
          description: roleData.description || '',
          permissions: roleData.permissions || []
        })
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching role details:', error)
      toast({
        title: "Error",
        description: "Failed to fetch role details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Role name is required.",
        variant: "destructive"
      })
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update role')
      }

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Role updated successfully.",
        })
        router.push(`/dashboard/roles/${roleId}`)
      } else {
        throw new Error('Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update role. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }))
  }

  const handleSelectAllCategory = (category: string, permissions: string[]) => {
    const categoryPermissions = permissions
    const allSelected = categoryPermissions.every(p => formData.permissions.includes(p))
    
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !categoryPermissions.includes(p))
        : [...new Set([...prev.permissions, ...categoryPermissions])]
    }))
  }

  // Group permissions by category
  const groupedPermissions = Object.keys(PERMISSIONS).reduce((acc, permission) => {
    const category = permission.split('.')[0]
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(permission)
    return acc
  }, {} as Record<string, string[]>)

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
            <p className="text-muted-foreground">Update role information and permissions</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40">
              <div className="text-center space-y-2">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Loading role details...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/roles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roles
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40">
              <div className="text-center space-y-2">
                <Shield className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-semibold">Role Not Found</h3>
                <p className="text-muted-foreground">The requested role could not be found.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/roles/${roleId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
            <p className="text-muted-foreground">Update role information and permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/roles/${roleId}`}>
              Cancel
            </Link>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Role Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Information
              </CardTitle>
              <CardDescription>
                Basic role details and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter role name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter role description"
                  rows={4}
                />
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Selected Permissions: {formData.permissions.length}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Original: {role.permissionCount} permissions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Permissions
              </CardTitle>
              <CardDescription>
                Select permissions for this role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {Object.entries(groupedPermissions).map(([category, permissions]) => {
                  const categoryPermissions = permissions
                  const selectedCount = categoryPermissions.filter(p => formData.permissions.includes(p)).length
                  const allSelected = categoryPermissions.every(p => formData.permissions.includes(p))
                  const someSelected = categoryPermissions.some(p => formData.permissions.includes(p))
                  
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm uppercase tracking-wide">
                            {category.replace('_', ' ')}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {selectedCount}/{categoryPermissions.length}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectAllCategory(category, categoryPermissions)}
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoryPermissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
                            <Checkbox
                              id={`permission-${permission}`}
                              checked={formData.permissions.includes(permission)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission, checked as boolean)
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <Label 
                                htmlFor={`permission-${permission}`} 
                                className="text-sm font-medium cursor-pointer"
                              >
                                {permission}
                              </Label>
                              <div className="text-xs text-muted-foreground mt-1">
                                {PERMISSIONS[permission as keyof typeof PERMISSIONS] || 'Permission access'}
                              </div>
                            </div>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                      
                      {category !== Object.keys(groupedPermissions).slice(-1)[0] && (
                        <div className="border-t pt-4" />
                      )}
                    </div>
                  )
                })}
                
                {Object.keys(groupedPermissions).length === 0 && (
                  <div className="text-center py-8">
                    <Key className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No permissions available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
