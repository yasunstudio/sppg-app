"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useUsers } from "@/hooks/use-users"
import { deleteUser } from "../actions"
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Users as UsersIcon,
  SortAsc,
  SortDesc,
  RefreshCw,
  Loader2
} from "lucide-react"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export function ClientPage({ users: initialUsers }: { users: User[] }) {
  const router = useRouter()
  const { toast } = useToast()
  
  // State for filters and pagination
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [pageSize, setPageSize] = useState(10)
  
  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  // Use our custom hook for data fetching
  const { data, loading, error, refetch } = useUsers({
    page,
    limit: pageSize,
    search: debouncedSearch,
    role: roleFilter,
    sortBy,
    sortOrder,
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page when searching
    }, 500)
    
    return () => clearTimeout(timer)
  }, [search])

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Success",
        description: "User has been deleted successfully.",
      })
      refetch()
    } catch (error) {
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role === "all" ? "" : role)
    setPage(1)
  }

  const resetFilters = () => {
    setSearch("")
    setDebouncedSearch("")
    setRoleFilter("")
    setSortBy("createdAt")
    setSortOrder("desc")
    setPage(1)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30"
      case "USER":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const users = data?.users || []
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: pageSize,
    hasNextPage: false,
    hasPreviousPage: false,
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-center">
              <div>
                <p className="text-destructive font-medium">Error loading users</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                <Button onClick={refetch} className="mt-4">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UsersIcon className="w-8 h-8" />
            Users Management
          </h1>
          <p className="text-muted-foreground">
            Manage users and their permissions in the system.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/create">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Filters</span>
            </div>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter || "all"} onValueChange={handleRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>

            {/* Page Size */}
            <Select 
              value={pageSize.toString()} 
              onValueChange={(value) => {
                setPageSize(parseInt(value))
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button 
              variant="outline" 
              onClick={refetch}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg border-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50 border-b">
                  <TableHead 
                    className="text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortBy === "name" && (
                        sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      {sortBy === "email" && (
                        sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium">Role</TableHead>
                  <TableHead 
                    className="text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Created At
                      {sortBy === "createdAt" && (
                        sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="ml-2">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32">
                      <div className="flex flex-col items-center justify-center text-center">
                        <UsersIcon className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No users found</p>
                        <p className="text-sm text-muted-foreground">
                          {search || roleFilter ? "Try adjusting your filters" : "Get started by adding a new user"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{user.name || "No Name"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground">
                              <Link href={`/dashboard/users/${user.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 focus:text-red-600 dark:focus:text-red-400" 
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card border-border">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-foreground">Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-muted-foreground">
                                    This action cannot be undone. This will permanently delete the
                                    user &quot;{user.name || user.email}&quot; and remove their data from the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="hover:bg-muted">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800 text-white"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalCount > 0 && (
        <Card>
          <CardContent className="py-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              limit={pagination.limit}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
