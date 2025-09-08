"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  Search, 
  RefreshCcw,
  UserCheck,
  UserX,
  UserMinus,
  TrendingUp
} from "lucide-react"
import { UserTableView } from "./user-table/user-table-view"
import { UserGridView } from "./user-table/user-grid-view"
import { useResponsive } from "@/hooks/use-responsive"
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
  const { isMobile } = useResponsive()
  
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

  // Dialog states
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
      
      // Update stats if provided
      if (data.stats) {
        setStats(data.stats)
      }
      
      // Handle pagination data
      if (data.pagination) {
        setTotalUsers(data.pagination.totalCount || data.pagination.total || 0)
      } else {
        setTotalUsers(data.users?.length || 0)
      }
      
    } catch (error) {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTerm, roleFilter, statusFilter, sortBy, sortOrder])

  // Load users on component mount and when dependencies change
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Handle status toggle
  const handleStatusToggle = async (user: User) => {
    try {
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      
      const response = await fetch(`/api/users/${user.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      )

      toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      toast.error("Failed to update user status")
    }
  }

  // Handle user deletion
  const handleDelete = async () => {
    if (!selectedUser) return
    
    try {
      setDeleting(true)
      
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      // Remove from local state
      setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id))
      setShowDeleteDialog(false)
      setSelectedUser(null)
      
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete user")
    } finally {
      setDeleting(false)
    }
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // Handle filter changes
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  // Helper functions for badges
  const getRoleBadge = (role: string) => {
    const roleColors = {
      SUPER_ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      NUTRITIONIST: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      CHEF: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      PRODUCTION_STAFF: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      QUALITY_CONTROL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      WAREHOUSE_MANAGER: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      DISTRIBUTION_MANAGER: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      SCHOOL_ADMIN: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
      DRIVER: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
      FINANCIAL_ANALYST: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      OPERATIONS_SUPERVISOR: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
      VIEWER: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
    
    const colorClass = roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    
    return (
      <Badge className={colorClass}>
        {role.replace('_', ' ')}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { icon: UserCheck, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
      INACTIVE: { icon: UserX, color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" },
      SUSPENDED: { icon: UserMinus, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.INACTIVE
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  // Pagination
  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <div className="space-y-8">
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
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Emails</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}% verification rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <UserMinus className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspended}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.suspended / stats.total) * 100) : 0}% of total users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
          <CardDescription>
            Search and filter users by different criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="NUTRITIONIST">Nutritionist</SelectItem>
                <SelectItem value="CHEF">Chef</SelectItem>
                <SelectItem value="PRODUCTION_STAFF">Production Staff</SelectItem>
                <SelectItem value="QUALITY_CONTROL">Quality Control</SelectItem>
                <SelectItem value="WAREHOUSE_MANAGER">Warehouse Manager</SelectItem>
                <SelectItem value="DISTRIBUTION_MANAGER">Distribution Manager</SelectItem>
                <SelectItem value="SCHOOL_ADMIN">School Admin</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
                <SelectItem value="FINANCIAL_ANALYST">Financial Analyst</SelectItem>
                <SelectItem value="OPERATIONS_SUPERVISOR">Operations Supervisor</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-48">
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

      {/* Data View - Auto Responsive */}
      {isMobile ? (
        // Mobile: Grid view
        <UserGridView
          users={users}
          loading={loading}
          onStatusToggle={handleStatusToggle}
          onDelete={(user) => {
            setSelectedUser(user)
            setShowDeleteDialog(true)
          }}
          getRoleBadge={getRoleBadge}
          getStatusBadge={getStatusBadge}
        />
      ) : (
        // Tablet & Desktop: Table view
        <UserTableView
          users={users}
          loading={loading}
          onStatusToggle={handleStatusToggle}
          onDelete={(user) => {
            setSelectedUser(user)
            setShowDeleteDialog(true)
          }}
          getRoleBadge={getRoleBadge}
          getStatusBadge={getStatusBadge}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name || selectedUser?.email}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setSelectedUser(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
