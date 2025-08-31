"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  UserCheck, 
  Settings,
  Users,
  Shield,
  RefreshCw,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Plus
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
  userCount?: number
}

interface PaginationInfo {
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function UserRolesManagement() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  const fetchUsers = useCallback(async () => {
    try {
      setError(null)
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        include: 'roles',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== "all" && { role: roleFilter })
      })

      const response = await fetch(`/api/users?${params}`)
      if (response.ok) {
        const result = await response.json()
        setUsers(result.users || [])
        
        // Update pagination info from server response
        if (result.pagination) {
          setPagination({
            totalCount: result.pagination.totalCount || result.pagination.total || 0,
            totalPages: result.pagination.totalPages || Math.ceil((result.pagination.totalCount || result.pagination.total || 0) / pageSize),
            currentPage: result.pagination.currentPage || currentPage,
            hasNextPage: result.pagination.hasNextPage || false,
            hasPrevPage: result.pagination.hasPrevPage || false
          })
        } else {
          // Fallback if pagination not provided
          setPagination(prev => ({ ...prev, totalCount: result.users?.length || 0 }))
        }
        
        setLastUpdated(new Date())
      } else {
        setError('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Error fetching users')
    }
  }, [currentPage, pageSize, searchTerm, roleFilter])

  const fetchRoles = useCallback(async () => {
    try {
      setError(null)
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
  }, [])

  useEffect(() => {
    Promise.all([fetchUsers(), fetchRoles()])
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (navigator.onLine) {
        fetchUsers()
      }
    }, 30000)
    
    // Monitor online status
    const handleOnline = () => {
      setIsOnline(true)
      fetchUsers() // Refresh when back online
    }
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [fetchUsers, fetchRoles])

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, roleFilter])

  const handleRefresh = () => {
    setLoading(true)
    Promise.all([fetchUsers(), fetchRoles()])
  }

  const handleManageRoles = (userId: string) => {
    router.push(`/dashboard/user-roles/${userId}/edit`)
  }

  const handleViewDetails = (userId: string) => {
    router.push(`/dashboard/user-roles/${userId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading user roles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg">⚠️</div>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => {
            setError(null)
            setLoading(true)
            Promise.all([fetchUsers(), fetchRoles()])
          }}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UserCheck className="w-8 h-8" />
            User Role Management
          </h1>
          <p className="text-muted-foreground">
            Assign roles to users and manage their permissions.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{pagination.totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Available Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Users with Roles</p>
                <p className="text-2xl font-bold">
                  {users.filter(user => user.roles.length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Users & Their Roles
          </CardTitle>
          <CardDescription>
            View and manage role assignments for all users
            {lastUpdated && (
              <span className="block text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
                {!isOnline && <span className="text-orange-500 ml-2">• Offline</span>}
                {isOnline && <span className="text-green-500 ml-2">• Live</span>}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Roles</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No users found</p>
                      {searchTerm || roleFilter !== "all" ? (
                        <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : (
                            <AvatarFallback>
                              {user.name?.charAt(0) || user.email.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((userRole) => (
                            <Badge key={userRole.role.id} variant="secondary">
                              {userRole.role.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No roles assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleManageRoles(user.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Manage Roles
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, pagination.totalCount)} of {pagination.totalCount} users
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
              {(() => {
                const maxVisiblePages = 5
                const totalPages = pagination.totalPages
                
                if (totalPages <= maxVisiblePages) {
                  // Show all pages if total is less than max visible
                  return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8"
                    >
                      {page}
                    </Button>
                  ))
                } else {
                  // Show ellipsis navigation for many pages
                  const buttons = []
                  const showEllipsisStart = currentPage > 3
                  const showEllipsisEnd = currentPage < totalPages - 2
                  
                  // Always show first page
                  buttons.push(
                    <Button
                      key={1}
                      variant={currentPage === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      className="w-8"
                    >
                      1
                    </Button>
                  )
                  
                  // Show ellipsis if needed
                  if (showEllipsisStart) {
                    buttons.push(
                      <span key="ellipsis-start" className="px-2 text-muted-foreground">
                        ...
                      </span>
                    )
                  }
                  
                  // Show pages around current page
                  const start = Math.max(2, currentPage - 1)
                  const end = Math.min(totalPages - 1, currentPage + 1)
                  
                  for (let page = start; page <= end; page++) {
                    if (page !== 1 && page !== totalPages) {
                      buttons.push(
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8"
                        >
                          {page}
                        </Button>
                      )
                    }
                  }
                  
                  // Show ellipsis if needed
                  if (showEllipsisEnd) {
                    buttons.push(
                      <span key="ellipsis-end" className="px-2 text-muted-foreground">
                        ...
                      </span>
                    )
                  }
                  
                  // Always show last page if more than 1 page
                  if (totalPages > 1) {
                    buttons.push(
                      <Button
                        key={totalPages}
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8"
                      >
                        {totalPages}
                      </Button>
                    )
                  }
                  
                  return buttons
                }
              })()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
