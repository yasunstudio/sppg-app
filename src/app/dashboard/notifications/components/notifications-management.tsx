"use client"

import { useState } from "react"
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
  ExternalLink
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

interface Notification {
  id: string
  title: string
  message: string
  type: string
  priority: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export function NotificationsManagement() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [readFilter, setReadFilter] = useState("all")
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [page, setPage] = useState(1)

  // Mock data for now - will be replaced with real API
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Stok Bahan Baku Menipis",
      message: "Stok beras di gudang tinggal 15kg, perlu segera diisi ulang untuk produksi besok.",
      type: "INVENTORY_LOW",
      priority: "HIGH",
      isRead: false,
      actionUrl: "/dashboard/inventory",
      createdAt: new Date().toISOString()
    },
    {
      id: "2", 
      title: "Kualitas Produksi Menurun",
      message: "Batch produksi #2024-001 mendapat rating kualitas di bawah standar (6.5/10).",
      type: "QUALITY_ALERT",
      priority: "CRITICAL",
      isRead: false,
      actionUrl: "/dashboard/quality",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      title: "Pengiriman Selesai",
      message: "Pengiriman ke 15 sekolah telah berhasil diselesaikan dengan total 1,250 porsi.",
      type: "DISTRIBUTION",
      priority: "NORMAL",
      isRead: true,
      actionUrl: "/dashboard/delivery-tracking",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "4",
      title: "Anggaran Bulanan Terlampaui",
      message: "Pengeluaran bulan ini telah mencapai 105% dari budget yang dialokasikan.",
      type: "BUDGET_ALERT",
      priority: "HIGH",
      isRead: false,
      actionUrl: "/dashboard/financial",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "5",
      title: "Feedback Baru dari Sekolah",
      message: "SDN Mekar Jaya memberikan feedback positif untuk menu hari ini (rating: 4.5/5).",
      type: "FEEDBACK",
      priority: "LOW",
      isRead: true,
      actionUrl: "/dashboard/feedback",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ])

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    byType: {
      INVENTORY_LOW: 1,
      QUALITY_ALERT: 1,
      DISTRIBUTION: 1,
      BUDGET_ALERT: 1,
      FEEDBACK: 1
    },
    byPriority: {
      CRITICAL: 1,
      HIGH: 2,
      NORMAL: 1,
      LOW: 1
    }
  }

  const getTypeConfig = (type: string) => {
    const configs = {
      SYSTEM: { label: "Sistem", icon: Settings, color: "bg-gray-100 text-gray-800" },
      PRODUCTION: { label: "Produksi", icon: Zap, color: "bg-blue-100 text-blue-800" },
      DISTRIBUTION: { label: "Distribusi", icon: CheckCircle, color: "bg-green-100 text-green-800" },
      QUALITY_ALERT: { label: "Kualitas", icon: AlertTriangle, color: "bg-red-100 text-red-800" },
      INVENTORY_LOW: { label: "Inventori", icon: Info, color: "bg-orange-100 text-orange-800" },
      BUDGET_ALERT: { label: "Anggaran", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800" },
      FEEDBACK: { label: "Feedback", icon: Info, color: "bg-purple-100 text-purple-800" }
    }
    return configs[type as keyof typeof configs] || configs.SYSTEM
  }

  const getPriorityBadge = (priority: string) => {
    const badges = {
      LOW: <Badge variant="secondary" className="bg-gray-100 text-gray-800">Rendah</Badge>,
      NORMAL: <Badge variant="secondary" className="bg-blue-100 text-blue-800">Normal</Badge>,
      HIGH: <Badge variant="secondary" className="bg-orange-100 text-orange-800">Tinggi</Badge>,
      CRITICAL: <Badge variant="destructive">Kritis</Badge>
    }
    return badges[priority as keyof typeof badges] || badges.NORMAL
  }

  const filteredNotifications = notifications.filter(notification => {
    if (search && !notification.title.toLowerCase().includes(search.toLowerCase()) && 
        !notification.message.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (typeFilter !== "all" && notification.type !== typeFilter) {
      return false
    }
    if (priorityFilter !== "all" && notification.priority !== priorityFilter) {
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

  const handleMarkAsRead = () => {
    // Implementation will be added when API is ready
    toast.success(`${selectedNotifications.length} notifikasi ditandai sudah dibaca`)
    setSelectedNotifications([])
  }

  const handleMarkAllAsRead = () => {
    // Implementation will be added when API is ready
    toast.success("Semua notifikasi ditandai sudah dibaca")
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
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Tandai Semua Dibaca
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
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
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Dibaca</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prioritas Tinggi</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.byPriority.HIGH + stats.byPriority.CRITICAL}
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
              {notifications.filter(n => {
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
                <SelectItem value="all">Semua Tipe</SelectItem>
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
                <SelectItem value="all">Semua Prioritas</SelectItem>
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
                <SelectItem value="all">Semua</SelectItem>
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
                <Button variant="outline" size="sm" onClick={handleMarkAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Tandai Dibaca
                </Button>
                <Button variant="outline" size="sm">
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
              {filteredNotifications.map((notification) => {
                const typeConfig = getTypeConfig(notification.type)
                const TypeIcon = typeConfig.icon
                
                return (
                  <TableRow 
                    key={notification.id}
                    className={!notification.isRead ? "bg-blue-50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedNotifications.includes(notification.id)}
                        onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      {notification.isRead ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-blue-600" />
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
                            onClick={() => handleMarkAsRead()}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          
          {filteredNotifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium">Tidak ada notifikasi</p>
              <p className="text-muted-foreground">
                {search || typeFilter !== "all" || priorityFilter !== "all" || readFilter !== "all"
                  ? "Tidak ditemukan notifikasi yang sesuai dengan filter"
                  : "Belum ada notifikasi untuk ditampilkan"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
