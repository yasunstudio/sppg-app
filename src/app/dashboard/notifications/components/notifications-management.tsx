"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  Check, 
  AlertTriangle, 
  Info, 
  Zap, 
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  Trash2,
  ExternalLink,
  Loader2
} from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import { useNotifications } from "@/hooks/use-notifications"
import Link from "next/link"

export function NotificationsManagement() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [readFilter, setReadFilter] = useState("ALL")
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [page, setPage] = useState(1)

  // Use real notifications hook instead of mock data
  const {
    notifications,
    stats,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh
  } = useNotifications()

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, 30000)

    return () => clearInterval(interval)
  }, [refresh])

  // Filter notifications locally since the API doesn't support query params yet
  const filteredNotifications = notifications.filter(notification => {
    if (search && !notification.title.toLowerCase().includes(search.toLowerCase()) && 
        !notification.message.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (typeFilter !== "ALL" && notification.type !== typeFilter) {
      return false
    }
    if (priorityFilter !== "ALL" && notification.priority !== priorityFilter) {
      return false
    }
    if (readFilter === "read" && !notification.isRead) {
      return false
    }
    if (readFilter === "unread" && notification.isRead) {
      return false
    }
    return true
  })

  const getTypeConfig = (type: string) => {
    const configs = {
      SYSTEM: { label: "Sistem", icon: Settings, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
      PRODUCTION: { label: "Produksi", icon: Zap, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      DISTRIBUTION: { label: "Distribusi", icon: CheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      QUALITY_ALERT: { label: "Kualitas", icon: AlertTriangle, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      INVENTORY_LOW: { label: "Inventori", icon: Info, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
      BUDGET_ALERT: { label: "Anggaran", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      FEEDBACK: { label: "Feedback", icon: Info, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" }
    }
    return configs[type as keyof typeof configs] || configs.SYSTEM
  }

  const getPriorityBadge = (priority: string) => {
    const badges = {
      LOW: <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Rendah</Badge>,
      NORMAL: <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Normal</Badge>,
      HIGH: <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Tinggi</Badge>,
      CRITICAL: <Badge variant="destructive" className="bg-red-500 text-white dark:bg-red-600 dark:text-red-100">Kritis</Badge>
    }
    return badges[priority as keyof typeof badges] || badges.NORMAL
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    } else {
      setSelectedNotifications([])
    }
  }

  const handleSelectNotification = (notificationId: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, notificationId])
    } else {
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
    }
  }

  const handleMarkAsRead = async () => {
    if (selectedNotifications.length === 0) {
      toast.error("Pilih notifikasi terlebih dahulu")
      return
    }
    
    try {
      // Mark each selected notification as read
      await Promise.all(
        selectedNotifications.map(id => markAsRead(id))
      )
      setSelectedNotifications([])
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDelete = async () => {
    if (selectedNotifications.length === 0) {
      toast.error("Pilih notifikasi terlebih dahulu")
      return
    }

    try {
      // Delete each selected notification
      await Promise.all(
        selectedNotifications.map(id => deleteNotification(id))
      )
      setSelectedNotifications([])
    } catch (error) {
      console.error('Failed to delete notifications:', error)
    }
  }

  const handleRefresh = () => {
    refresh()
    toast.success("Data notifikasi diperbarui")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau semua notifikasi sistem
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Tandai Semua Dibaca
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifikasi</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Dibaca</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.unread || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prioritas Tinggi</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {(stats.byPriority.HIGH || 0) + (stats.byPriority.CRITICAL || 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(notifications || []).filter(n => {
                const today = new Date()
                const notifDate = new Date(n.createdAt)
                return notifDate.toDateString() === today.toDateString()
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari notifikasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter berdasarkan tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Tipe</SelectItem>
                <SelectItem value="SYSTEM">Sistem</SelectItem>
                <SelectItem value="PRODUCTION">Produksi</SelectItem>
                <SelectItem value="DISTRIBUTION">Distribusi</SelectItem>
                <SelectItem value="QUALITY_ALERT">Kualitas</SelectItem>
                <SelectItem value="INVENTORY_LOW">Inventori</SelectItem>
                <SelectItem value="BUDGET_ALERT">Anggaran</SelectItem>
                <SelectItem value="FEEDBACK">Feedback</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Prioritas</SelectItem>
                <SelectItem value="CRITICAL">Kritis</SelectItem>
                <SelectItem value="HIGH">Tinggi</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="LOW">Rendah</SelectItem>
              </SelectContent>
            </Select>
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status baca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                <SelectItem value="unread">Belum Dibaca</SelectItem>
                <SelectItem value="read">Sudah Dibaca</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedNotifications.length} notifikasi dipilih
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleMarkAsRead} disabled={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  Tandai Dibaca
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete} disabled={loading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Notifikasi</CardTitle>
          <CardDescription>
            Semua notifikasi yang diterima oleh sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
              <Button variant="outline" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          )}
          
          {loading && !error && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Memuat notifikasi...</p>
            </div>
          )}
          
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notifikasi</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Prioritas</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Tidak ada notifikasi yang ditemukan</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notification) => {
                    const typeConfig = getTypeConfig(notification.type)
                    const TypeIcon = typeConfig.icon
                    
                    return (
                      <TableRow 
                        key={notification.id}
                        className={!notification.isRead ? "bg-blue-50 dark:bg-blue-950/30" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedNotifications.includes(notification.id)}
                            onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          {notification.isRead ? (
                            <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={typeConfig.color}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(notification.priority)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatRelativeTime(notification.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {notification.actionUrl && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={notification.actionUrl}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {!notification.isRead && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                disabled={loading}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
