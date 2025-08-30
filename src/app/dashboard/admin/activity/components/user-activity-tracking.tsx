"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Activity,
  Clock,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  User,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Edit,
  Settings,
  AlertTriangle
} from "lucide-react"

interface ActivityLog {
  id: string
  action: string
  entityType: string
  entityId: string | null
  details: Record<string, any>
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

interface ActivitySummary {
  totalActivities: number
  todayActivities: number
  weeklyActivities: number
  topActions: Array<{
    action: string
    count: number
  }>
  topUsers: Array<{
    userId: string
    userName: string
    count: number
  }>
}

export function UserActivityTracking() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [summary, setSummary] = useState<ActivitySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)

  useEffect(() => {
    fetchActivities()
  }, [currentPage, searchQuery, actionFilter, dateFilter, userFilter])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchQuery,
        action: actionFilter !== "all" ? actionFilter : "",
        date: dateFilter !== "all" ? dateFilter : "",
        user: userFilter !== "all" ? userFilter : "",
      })

      const response = await fetch(`/api/admin/activity-logs?${params}`)
      if (!response.ok) throw new Error("Failed to fetch activities")
      
      const data = await response.json()
      setActivities(data.activities)
      setSummary(data.summary)
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportActivities = async (format: "csv" | "xlsx") => {
    try {
      const params = new URLSearchParams({
        format,
        search: searchQuery,
        action: actionFilter !== "all" ? actionFilter : "",
        date: dateFilter !== "all" ? dateFilter : "",
        user: userFilter !== "all" ? userFilter : "",
      })

      const response = await fetch(`/api/admin/activity-logs/export?${params}`)
      if (!response.ok) throw new Error("Failed to export activities")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `activity-logs.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting activities:", error)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "USER_LOGIN":
        return <Lock className="h-4 w-4 text-green-500" />
      case "USER_LOGOUT":
        return <Unlock className="h-4 w-4 text-gray-500" />
      case "USER_CREATED":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "USER_UPDATED":
        return <Edit className="h-4 w-4 text-yellow-500" />
      case "USER_DELETED":
        return <UserMinus className="h-4 w-4 text-red-500" />
      case "ROLE_ASSIGNED":
        return <Settings className="h-4 w-4 text-purple-500" />
      case "PERMISSION_DENIED":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "USER_LOGIN":
        return "bg-green-100 text-green-800"
      case "USER_LOGOUT":
        return "bg-gray-100 text-gray-800"
      case "USER_CREATED":
        return "bg-blue-100 text-blue-800"
      case "USER_UPDATED":
        return "bg-yellow-100 text-yellow-800"
      case "USER_DELETED":
        return "bg-red-100 text-red-800"
      case "ROLE_ASSIGNED":
        return "bg-purple-100 text-purple-800"
      case "PERMISSION_DENIED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatActionText = (activity: ActivityLog) => {
    const { action, details, entityType } = activity
    
    switch (action) {
      case "USER_LOGIN":
        return "Logged in to the system"
      case "USER_LOGOUT":
        return "Logged out from the system"
      case "USER_CREATED":
        return `Created new user: ${details.targetUserEmail || details.targetUserName || 'Unknown'}`
      case "USER_UPDATED":
        return `Updated user profile: ${details.targetUserEmail || details.targetUserName || 'Unknown'}`
      case "USER_DELETED":
        return `Deleted user: ${details.targetUserEmail || details.targetUserName || 'Unknown'}`
      case "ROLE_ASSIGNED":
        return `Assigned role ${details.roleName} to ${details.targetUserEmail || 'user'}`
      case "PERMISSION_DENIED":
        return `Access denied to ${details.resource || 'resource'}`
      default:
        return `Performed ${action.toLowerCase().replace('_', ' ')} on ${entityType || 'system'}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="w-8 h-8" />
            User Activity Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor and audit user activities across the system
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportActivities("csv")}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => exportActivities("xlsx")}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={fetchActivities} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                  <p className="text-2xl font-bold">{summary.totalActivities.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-2">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">{summary.todayActivities}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-2">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{summary.weeklyActivities}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-2">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{summary.topUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="USER_LOGIN">User Login</SelectItem>
                <SelectItem value="USER_LOGOUT">User Logout</SelectItem>
                <SelectItem value="USER_CREATED">User Created</SelectItem>
                <SelectItem value="USER_UPDATED">User Updated</SelectItem>
                <SelectItem value="USER_DELETED">User Deleted</SelectItem>
                <SelectItem value="ROLE_ASSIGNED">Role Assigned</SelectItem>
                <SelectItem value="PERMISSION_DENIED">Permission Denied</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log ({activities.length})</CardTitle>
          <CardDescription>
            Detailed log of all user activities and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.user.image || undefined} />
                          <AvatarFallback>
                            {activity.user.name?.charAt(0).toUpperCase() || 
                             activity.user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {activity.user.name || "No Name"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {activity.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getActionIcon(activity.action)}
                        <Badge 
                          className={getActionColor(activity.action)}
                          variant="secondary"
                        >
                          {activity.action.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatActionText(activity)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {activity.ipAddress || "Unknown"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(activity.createdAt).toLocaleString('id-ID')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Activities Summary */}
      {summary && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Actions</CardTitle>
              <CardDescription>Most frequent user actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.topActions.map((action, index) => (
                <div key={action.action} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getActionIcon(action.action)}
                    <span className="text-sm">{action.action.replace('_', ' ')}</span>
                  </div>
                  <Badge variant="outline">{action.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Most Active Users</CardTitle>
              <CardDescription>Users with highest activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.topUsers.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-muted rounded-full w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm">{user.userName}</span>
                  </div>
                  <Badge variant="outline">{user.count} activities</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
