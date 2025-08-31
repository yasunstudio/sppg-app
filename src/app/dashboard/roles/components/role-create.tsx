"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  Settings,
  Plus
} from 'lucide-react'
import { toast } from '@/lib/toast'
import { PERMISSIONS } from '@/lib/permissions'

interface FormData {
  name: string
  description: string
  permissions: string[]
}

export function RoleCreate() {
  const router = useRouter()
  
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    permissions: []
  })

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
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create role')
      }

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Role created successfully.",
        })
        router.push('/dashboard/roles')
      } else {
        throw new Error('Failed to create role')
      }
    } catch (error) {
      console.error('Error creating role:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create role. Please try again.",
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/roles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roles
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Role</h1>
            <p className="text-muted-foreground">Define a new role with specific permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/roles">
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving || !formData.name.trim()}>
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
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
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., CONTENT_MANAGER"
                />
                <p className="text-xs text-muted-foreground">
                  Role name will be converted to uppercase
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role's responsibilities and purpose"
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
                  
                  {formData.permissions.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {formData.permissions.length >= 30 && "Full Access Level"}
                      {formData.permissions.length >= 20 && formData.permissions.length < 30 && "High Access Level"}
                      {formData.permissions.length >= 10 && formData.permissions.length < 20 && "Medium Access Level"}
                      {formData.permissions.length < 10 && "Limited Access Level"}
                    </div>
                  )}
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

      {/* Helper Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                const adminPermissions = Object.keys(PERMISSIONS).filter(p => 
                  p.includes('manage') || p.includes('create') || p.includes('update') || p.includes('delete')
                )
                setFormData(prev => ({
                  ...prev,
                  permissions: [...new Set([...prev.permissions, ...adminPermissions])]
                }))
              }}
            >
              Admin Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                const viewPermissions = Object.keys(PERMISSIONS).filter(p => 
                  p.includes('view') || p.includes('read')
                )
                setFormData(prev => ({
                  ...prev,
                  permissions: [...new Set([...prev.permissions, ...viewPermissions])]
                }))
              }}
            >
              View-Only Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Permission Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(PERMISSIONS).length}</div>
            <p className="text-xs text-muted-foreground">Total available permissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(groupedPermissions).length}</div>
            <p className="text-xs text-muted-foreground">Permission categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Access Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {formData.permissions.length >= 30 && "Full Access"}
              {formData.permissions.length >= 20 && formData.permissions.length < 30 && "High Access"}
              {formData.permissions.length >= 10 && formData.permissions.length < 20 && "Medium Access"}
              {formData.permissions.length < 10 && formData.permissions.length > 0 && "Limited Access"}
              {formData.permissions.length === 0 && "No Access"}
            </div>
            <p className="text-xs text-muted-foreground">{formData.permissions.length} permissions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
