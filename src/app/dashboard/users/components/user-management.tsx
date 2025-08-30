"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Download,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  lastLoginAt: string | null
  emailVerified: boolean
  phone: string | null
  address: string | null
  avatar: string | null
}

interface UserStats {
  total: number
  active: number
  inactive: number
  suspended: number
  newThisMonth: number
  verified: number
}

export function UserManagement() {
  const { data: session } = useSession()
  const router = useRouter()
  
  // State management
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    newThisMonth: 0,
    verified: 0
  })
  
  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      
      // Build query parameters for server-side pagination
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchTerm,
        role: roleFilter === 'all' ? '' : roleFilter,
        status: statusFilter === 'all' ? '' : statusFilter,
        sortBy: sortBy,
        sortOrder: sortOrder
      })
      
      const response = await fetch(`/api/users/enhanced?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users || [])
      
      // Only update stats if it's different from current
      if (data.stats) {
        setStats(data.stats)
      }
      
      // Update pagination info from server response
      if (data.pagination) {
        setTotalUsers(data.pagination.totalCount || data.pagination.total || 0)
      } else {
        // Fallback if pagination not provided
        setTotalUsers(data.users?.length || 0)
      }
    } catch (error) {
      toast.error("Failed to load users data")
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTerm, roleFilter, statusFilter, sortBy, sortOrder])

  // Load users on component mount and when filters change
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Reset to page 1 when filters change (except page change itself)
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, roleFilter, statusFilter, sortBy, sortOrder])

  // Update pagination calculation to use server-side total
  const totalPages = Math.ceil(totalUsers / pageSize)

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.message || `HTTP ${response.status}: ${response.statusText}`
        
        // Handle specific status codes
        if (response.status === 409) {
          toast.warning(errorMessage) // User was deactivated instead of deleted
        } else {
          throw new Error(errorMessage)
        }
        
        await fetchUsers()
        setShowDeleteDialog(false)
        setSelectedUser(null)
        return
      }

      await fetchUsers()
      setShowDeleteDialog(false)
      setSelectedUser(null)
      
      toast.success("User deleted successfully")
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDeleting(false)
    }
  }

  // Handle status toggle
  const handleStatusToggle = async (user: User) => {
    try {
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.message || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      await fetchUsers()
      toast.success(`User ${newStatus.toLowerCase()} successfully`)
    } catch (error) {
      console.error('Failed to update user status:', error)
      toast.error(`Failed to update user status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Export users data
  const handleExport = async () => {
    try {
      const response = await fetch('/api/users/export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to export users')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Users exported successfully")
    } catch (error) {
      toast.error("Failed to export users")
    }
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case 'INACTIVE':
        return <Badge variant="secondary">Inactive</Badge>
      case 'SUSPENDED':
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get role badge
  const getRoleBadge = (role: string) => {
    const colors = {
      SUPER_ADMIN: "bg-purple-100 text-purple-800",
      ADMIN: "bg-blue-100 text-blue-800",
      MANAGER: "bg-green-100 text-green-800",
      SUPERVISOR: "bg-yellow-100 text-yellow-800",
      STAFF: "bg-gray-100 text-gray-800",
      USER: "bg-gray-100 text-gray-800",
      VIEWER: "bg-slate-100 text-slate-800"
    }
    
    return (
      <Badge variant="outline" className={colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {role}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading user management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions for your application
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/users/create">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newThisMonth} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.active / stats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.verified / stats.total) * 100).toFixed(1)}% verified
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspended}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>
            Search, filter, and manage all users in your system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={fetchUsers}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name || ""} />
                        ) : (
                          <AvatarFallback>
                            {user.name?.charAt(0) || user.email.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name || "No name"}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.emailVerified && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : "Never"
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/users/${user.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusToggle(user)}
                        >
                          {user.status === 'ACTIVE' ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDeleteDialog(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? If the user has associated data (menus, audit logs, etc.), 
              they will be deactivated instead of permanently deleted to maintain data integrity.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Avatar>
                  {selectedUser.avatar ? (
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name || ""} />
                  ) : (
                    <AvatarFallback>
                      {selectedUser.name?.charAt(0) || selectedUser.email.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.name || "No name"}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                  <div className="text-sm text-muted-foreground">Role: {selectedUser.role}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
