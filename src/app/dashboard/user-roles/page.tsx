'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PermissionGuard } from '@/hooks/use-permissions'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { 
  UserCheck, 
  Settings,
  Users,
  Shield
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
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
}

export default function UserRoleAssignmentPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])

  useEffect(() => {
    Promise.all([fetchUsers(), fetchRoles()])
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users?include=roles')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles')
      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRoles = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch('/api/roles/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          roleIds: selectedRoleIds
        }),
      })

      if (response.ok) {
        console.log('Roles assigned successfully')
        setAssignDialogOpen(false)
        setSelectedUser(null)
        setSelectedRoleIds([])
        fetchUsers()
      } else {
        const error = await response.json()
        console.error('Failed to assign roles:', error.error)
      }
    } catch (error) {
      console.error('Error assigning roles:', error)
    }
  }

  const handleAssignClick = (user: User) => {
    setSelectedUser(user)
    setSelectedRoleIds(user.roles.map(ur => ur.role.id))
    setAssignDialogOpen(true)
  }

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    setSelectedRoleIds(prev => 
      checked 
        ? [...prev, roleId]
        : prev.filter(id => id !== roleId)
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading user roles...</p>
        </div>
      </div>
    )
  }

  return (
    <PermissionGuard 
      permission="users.edit"
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to assign user roles.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <UserCheck className="w-8 h-8" />
              User Role Assignment
            </h1>
            <p className="text-muted-foreground">
              Assign roles to users and manage their permissions.
            </p>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users & Their Roles
            </CardTitle>
            <CardDescription>
              Manage role assignments for all users in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Roles</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((ur) => (
                            <Badge key={ur.role.id} variant="secondary">
                              {ur.role.name}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">No roles assigned</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignClick(user)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Assign Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Assign Roles Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Roles to {selectedUser?.name}</DialogTitle>
              <DialogDescription>
                Select the roles you want to assign to this user.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={(checked) => 
                        handleRoleToggle(role.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`role-${role.id}`} 
                        className="text-sm font-medium cursor-pointer"
                      >
                        {role.name}
                      </Label>
                      {role.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignRoles}>
                Assign Roles
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  )
}
