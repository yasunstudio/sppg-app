'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { PermissionGuard } from '@/hooks/use-permissions'
import { PERMISSIONS, USER_ROLES } from '@/lib/permissions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Settings,
  Key,
  UserCheck
} from 'lucide-react'

interface Role {
  id: string
  name: string
  description: string | null
  permissions: string[]
  _count: {
    users: number
  }
}

interface CreateRoleData {
  name: string
  description: string
  permissions: string[]
}

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<CreateRoleData>({
    name: '',
    description: '',
    permissions: []
  })

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles')
      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      } else {
        console.error('Failed to fetch roles')
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRole = async () => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log('Role created successfully')
        setCreateDialogOpen(false)
        setFormData({ name: '', description: '', permissions: [] })
        fetchRoles()
      } else {
        const error = await response.json()
        console.error('Failed to create role:', error.error)
      }
    } catch (error) {
      console.error('Error creating role:', error)
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedRole) return

    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log('Role updated successfully')
        setEditDialogOpen(false)
        setSelectedRole(null)
        setFormData({ name: '', description: '', permissions: [] })
        fetchRoles()
      } else {
        const error = await response.json()
        console.error('Failed to update role:', error.error)
      }
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('Role deleted successfully')
        fetchRoles()
      } else {
        const error = await response.json()
        console.error('Failed to delete role:', error.error)
      }
    } catch (error) {
      console.error('Error deleting role:', error)
    }
  }

  const handleEditClick = (role: Role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions
    })
    setEditDialogOpen(true)
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading roles...</p>
        </div>
      </div>
    )
  }

  return (
    <PermissionGuard 
      permission="system.config"
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to manage roles and permissions.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="w-8 h-8" />
              Role & Permission Management
            </h1>
            <p className="text-muted-foreground">
              Manage user roles and their permissions in the system.
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Create a new role and assign permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
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
                  />
                </div>
                <div className="space-y-4">
                  <Label>Permissions</Label>
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium capitalize">{category.replace('_', ' ')}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={`create-${permission}`}
                              checked={formData.permissions.includes(permission)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={`create-${permission}`} 
                              className="text-sm"
                            >
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="h-[1px] w-full bg-border my-2" />
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole} disabled={!formData.name}>
                  Create Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Existing Roles
            </CardTitle>
            <CardDescription>
              Manage existing roles and their permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || 'No description'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role._count.users} users</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.permissions.length} permissions</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(role)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={role._count.users > 0}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Role</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this role? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteRole(role.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Role Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update role information and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter role name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter role description"
                />
              </div>
              <div className="space-y-4">
                <Label>Permissions</Label>
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium capitalize">{category.replace('_', ' ')}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${permission}`}
                            checked={formData.permissions.includes(permission)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`edit-${permission}`} 
                            className="text-sm"
                          >
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="h-[1px] w-full bg-border my-2" />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole} disabled={!formData.name}>
                Update Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  )
}
