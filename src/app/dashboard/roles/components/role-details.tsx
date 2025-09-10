"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Shield, 
  Users,
  Key,
  Edit,
  ArrowLeft,
  RefreshCw,
  UserCheck,
  Settings
} from 'lucide-react'
import { toast } from '@/lib/toast'

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

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface RoleDetailsProps {
  roleId?: string
}

export function RoleDetails({ roleId: propRoleId }: RoleDetailsProps = {}) {
  const params = useParams()
  const router = useRouter()
  const roleId = propRoleId || (params.roleId as string)
  
  const [role, setRole] = useState<Role | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)

  useEffect(() => {
    if (roleId) {
      fetchRoleDetails()
      fetchRoleUsers()
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
        setRole(result.data)
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

  const fetchRoleUsers = async () => {
    setUsersLoading(true)
    try {
      const response = await fetch(`/api/users?role=${roleId}&include=roles`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error('Error fetching role users:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  const getRoleVariant = (name: string) => {
    if (name.includes('ADMIN')) return 'destructive'
    if (name.includes('MANAGER')) return 'default'
    if (name.includes('COORDINATOR')) return 'secondary'
    return 'outline'
  }

  const getPermissionLevel = (count: number) => {
    if (count >= 30) return { label: 'Full Access', variant: 'destructive' as const }
    if (count >= 20) return { label: 'High Access', variant: 'default' as const }
    if (count >= 10) return { label: 'Medium Access', variant: 'secondary' as const }
    return { label: 'Limited Access', variant: 'outline' as const }
  }

  const groupPermissionsByCategory = (permissions: string[]) => {
    return permissions.reduce((acc, permission) => {
      const category = permission.split('.')[0]
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(permission)
      return acc
    }, {} as Record<string, string[]>)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role Details</h1>
            <p className="text-muted-foreground">View role information and permissions</p>
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

  const permissionLevel = getPermissionLevel(role.permissionCount)
  const groupedPermissions = groupPermissionsByCategory(role.permissions)

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
            <h1 className="text-3xl font-bold tracking-tight">{role.name}</h1>
            <p className="text-muted-foreground">Role details and permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchRoleDetails}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link href={`/dashboard/roles/${roleId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Role
            </Link>
          </Button>
        </div>
      </div>

      {/* Role Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role Name</label>
              <div className="mt-1">
                <Badge variant={getRoleVariant(role.name)} className="text-sm">
                  {role.name}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1 text-sm">
                {role.description || 'No description provided'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Access Level</label>
              <div className="mt-1">
                <Badge variant={permissionLevel.variant}>
                  {permissionLevel.label}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Users</label>
                <div className="mt-1 flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{role.userCount}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Permissions</label>
                <div className="mt-1 flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{role.permissionCount}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(role.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(role.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Permissions ({role.permissionCount})
            </CardTitle>
            <CardDescription>
              Permissions granted to this role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {category.replace('_', ' ')}
                  </h4>
                  <div className="grid gap-1">
                    {permissions.map((permission) => (
                      <div key={permission} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <Settings className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-mono">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedPermissions).length === 0 && (
                <div className="text-center py-8">
                  <Key className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No permissions assigned</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users with this role */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users with this Role ({role.userCount})
          </CardTitle>
          <CardDescription>
            Users currently assigned to this role
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center space-y-2">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            </div>
          ) : users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/user-roles/${user.id}`}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold mb-1">No Users</h3>
              <p className="text-muted-foreground">No users are currently assigned to this role.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
