"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  Camera,
  Thermometer,
  FileText,
  Activity,
  Shield,
  Package,
  Truck,
  Settings,
  Calendar,
  Users,
  MoreHorizontal
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"

interface QualityCheckpoint {
  id: string
  productionPlanId?: string
  batchId?: string
  checkpointType: string
  checkedAt: string
  checkedBy: string
  checkerName: string
  status: string
  temperature?: number
  visualInspection?: string
  tasteTest?: string
  textureEvaluation?: string
  correctiveAction?: string
  photos: string[]
  metrics?: any
  notes?: string
  createdAt: string
  batchName?: string
  productionPlanName?: string
}

export function QualityCheckpointsManagement() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [page, setPage] = useState(1)

  // Mock data untuk development
  const [checkpoints] = useState<QualityCheckpoint[]>([
    {
      id: "1",
      productionPlanId: "plan-1",
      batchId: "batch-1",
      checkpointType: "RAW_MATERIAL",
      checkedAt: new Date().toISOString(),
      checkedBy: "user-1",
      checkerName: "Rahmat Hidayat",
      status: "FAIL",
      temperature: 45.0,
      visualInspection: "Ditemukan kontaminasi pada beberapa kemasan. Suhu tidak sesuai standar distribusi.",
      tasteTest: undefined,
      textureEvaluation: undefined,
      correctiveAction: undefined,
      photos: ["photo1.jpg", "photo2.jpg"],
      metrics: {
        freshness: 9.5,
        quality: 9.0,
        hygiene: 10.0
      },
      notes: "Semua bahan baku memenuhi standar kualitas",
      createdAt: new Date().toISOString(),
      batchName: "Batch Produksi #2024-001",
      productionPlanName: "Menu Sekolah Senin"
    },
    {
      id: "2",
      batchId: "batch-2",
      checkpointType: "PRODUCTION",
      checkedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      checkedBy: "user-2",
      checkerName: "Siti Nurhaliza",
      status: "CONDITIONAL",
      temperature: 72.5,
      visualInspection: "Bahan baku dalam kondisi baik, tidak ada tanda-tanda pembusukan atau kontaminasi. Warna sesuai standar.",
      tasteTest: undefined,
      textureEvaluation: "Tekstur sesuai dengan standar kualitas yang ditetapkan.",
      correctiveAction: undefined,
      photos: ["photo3.jpg"],
      metrics: {
        temperature: 8.5,
        taste: 9.0,
        appearance: 7.5,
        texture: 7.0
      },
      notes: "Perlu penyesuaian waktu memasak untuk batch selanjutnya",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      batchName: "Batch Produksi #2024-002",
      productionPlanName: "Menu Sekolah Selasa"
    },
    {
      id: "3",
      batchId: "batch-3",
      checkpointType: "PACKAGING",
      checkedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      checkedBy: "user-3",
      checkerName: "Ahmad Sulaiman",
      status: "PACKAGING",
      temperature: undefined,
      visualInspection: "Kemasan dalam kondisi baik, segel rapat, dan tidak ada kerusakan fisik pada packaging.",
      tasteTest: undefined,
      textureEvaluation: undefined,
      correctiveAction: "Ganti kemasan yang rusak, cek sealer machine",
      photos: ["photo4.jpg", "photo5.jpg"],
      metrics: {
        packaging_integrity: 6.0,
        seal_quality: 5.5,
        labeling: 9.0
      },
      notes: "Mesin sealer perlu diperbaiki segera",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      batchName: "Batch Produksi #2024-003",
      productionPlanName: "Menu Sekolah Rabu"
    },
    {
      id: "4",
      checkpointType: "DISTRIBUTION",
      checkedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      checkedBy: "user-4",
      checkerName: "Rina Sari",
      status: "PASS",
      temperature: 8.0,
      visualInspection: "Semua produk dalam kondisi baik",
      tasteTest: undefined,
      textureEvaluation: undefined,
      correctiveAction: undefined,
      photos: [],
      metrics: {
        temperature_compliance: 9.5,
        packaging_condition: 9.0,
        delivery_time: 8.5
      },
      notes: "Perlu follow up untuk memastikan distribusi sesuai protokol suhu.",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      batchName: undefined,
      productionPlanName: undefined
    },
    {
      id: "5",
      batchId: "batch-4",
      checkpointType: "PRODUCTION",
      checkedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      checkedBy: "user-1",
      checkerName: "Ahmad Fauzi",
      status: "REWORK_REQUIRED",
      temperature: 65.0,
      visualInspection: "Warna tidak merata",
      tasteTest: "Rasa kurang asin",
      textureEvaluation: "Terlalu lembek",
      correctiveAction: "Rework dengan penambahan bumbu dan waktu masak",
      photos: ["photo6.jpg"],
      metrics: {
        temperature: 7.0,
        taste: 6.5,
        appearance: 6.0,
        texture: 5.5
      },
      notes: "Perlu rework total untuk batch ini",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      batchName: "Batch Produksi #2024-004",
      productionPlanName: "Menu Sekolah Kamis"
    }
  ])

  const stats = {
    total: checkpoints.length,
    pass: checkpoints.filter(cp => cp.status === "PASS").length,
    fail: checkpoints.filter(cp => cp.status === "FAIL").length,
    conditional: checkpoints.filter(cp => cp.status === "CONDITIONAL").length,
    rework: checkpoints.filter(cp => cp.status === "REWORK_REQUIRED").length,
    pending: checkpoints.filter(cp => cp.status === "PENDING").length,
    byType: checkpoints.reduce((acc, cp) => {
      acc[cp.checkpointType] = (acc[cp.checkpointType] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    passRate: checkpoints.length > 0 ? (checkpoints.filter(cp => cp.status === "PASS").length / checkpoints.length) * 100 : 0
  }

  const getTypeConfig = (type: string) => {
    const configs = {
      RAW_MATERIAL: { label: "Bahan Baku", icon: Package, color: "bg-blue-100 text-blue-800" },
      PRODUCTION: { label: "Produksi", icon: Settings, color: "bg-green-100 text-green-800" },
      PACKAGING: { label: "Kemasan", icon: Shield, color: "bg-yellow-100 text-yellow-800" },
      DISTRIBUTION: { label: "Distribusi", icon: Truck, color: "bg-purple-100 text-purple-800" }
    }
    return configs[type as keyof typeof configs] || configs.RAW_MATERIAL
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      PASS: { label: "Lulus", icon: CheckCircle, color: "bg-green-100 text-green-800", variant: "default" as const },
      FAIL: { label: "Gagal", icon: XCircle, color: "bg-red-100 text-red-800", variant: "destructive" as const },
      CONDITIONAL: { label: "Bersyarat", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800", variant: "secondary" as const },
      PENDING: { label: "Menunggu", icon: Clock, color: "bg-gray-100 text-gray-800", variant: "outline" as const },
      REWORK_REQUIRED: { label: "Perlu Rework", icon: AlertTriangle, color: "bg-orange-100 text-orange-800", variant: "secondary" as const }
    }
    return configs[status as keyof typeof configs] || configs.PENDING
  }

  const filteredCheckpoints = checkpoints.filter(checkpoint => {
    if (search && !checkpoint.checkerName.toLowerCase().includes(search.toLowerCase()) && 
        !checkpoint.batchName?.toLowerCase().includes(search.toLowerCase()) &&
        !checkpoint.productionPlanName?.toLowerCase().includes(search.toLowerCase()) &&
        !checkpoint.notes?.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (typeFilter !== "all" && checkpoint.checkpointType !== typeFilter) {
      return false
    }
    if (statusFilter !== "all" && checkpoint.status !== statusFilter) {
      return false
    }
    if (dateFilter === "today") {
      const today = new Date().toDateString()
      const checkpointDate = new Date(checkpoint.checkedAt).toDateString()
      if (checkpointDate !== today) return false
    }
    if (dateFilter === "week") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      if (new Date(checkpoint.checkedAt) < weekAgo) return false
    }
    return true
  })

  const handleDelete = (checkpointId: string) => {
    // Implementation will be added when API is ready
    toast.success("Checkpoint berhasil dihapus")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Checkpoints</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau semua checkpoint kualitas produksi
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Laporan
          </Button>
          <Button asChild>
            <Link href="/dashboard/quality-checkpoints/create">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Checkpoint
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checkpoint</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lulus</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.pass}</div>
            <p className="text-xs text-muted-foreground">
              {stats.passRate.toFixed(1)}% tingkat keberhasilan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gagal</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.fail}</div>
            <p className="text-xs text-muted-foreground">
              Perlu tindakan perbaikan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bersyarat</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.conditional}</div>
            <p className="text-xs text-muted-foreground">
              Memerlukan pengawasan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rework</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.rework}</div>
            <p className="text-xs text-muted-foreground">
              Perlu pengerjaan ulang
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Checkpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari checkpoint..."
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
                <SelectItem value="RAW_MATERIAL">Bahan Baku</SelectItem>
                <SelectItem value="PRODUCTION">Produksi</SelectItem>
                <SelectItem value="PACKAGING">Kemasan</SelectItem>
                <SelectItem value="DISTRIBUTION">Distribusi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PASS">Lulus</SelectItem>
                <SelectItem value="FAIL">Gagal</SelectItem>
                <SelectItem value="CONDITIONAL">Bersyarat</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="REWORK_REQUIRED">Rework</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Checkpoints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Quality Checkpoint</CardTitle>
          <CardDescription>
            {filteredCheckpoints.length} dari {checkpoints.length} checkpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Checkpoint</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pemeriksa</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCheckpoints.map((checkpoint) => {
                const typeConfig = getTypeConfig(checkpoint.checkpointType)
                const statusConfig = getStatusConfig(checkpoint.status)
                const TypeIcon = typeConfig.icon
                const StatusIcon = statusConfig.icon
                
                return (
                  <TableRow key={checkpoint.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {checkpoint.batchName || `Checkpoint ${checkpoint.id}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {checkpoint.productionPlanName || "Checkpoint umum"}
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
                      <Badge variant={statusConfig.variant} className={statusConfig.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{checkpoint.checkerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <p>{formatRelativeTime(checkpoint.checkedAt)}</p>
                        <p className="text-xs">{formatDate(checkpoint.checkedAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {checkpoint.temperature && (
                          <div className="flex items-center gap-1 text-xs">
                            <Thermometer className="h-3 w-3" />
                            {checkpoint.temperature}°C
                          </div>
                        )}
                        {checkpoint.photos.length > 0 && (
                          <div className="flex items-center gap-1 text-xs">
                            <Camera className="h-3 w-3" />
                            {checkpoint.photos.length} foto
                          </div>
                        )}
                        {checkpoint.notes && (
                          <div className="flex items-center gap-1 text-xs">
                            <FileText className="h-3 w-3" />
                            Ada catatan
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/quality-checkpoints/${checkpoint.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/quality-checkpoints/${checkpoint.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(checkpoint.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          
          {filteredCheckpoints.length === 0 && (
            <div className="text-center py-8">
              <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium">Tidak ada checkpoint</p>
              <p className="text-muted-foreground">
                {search || typeFilter !== "all" || statusFilter !== "all" || dateFilter !== "all"
                  ? "Tidak ditemukan checkpoint yang sesuai dengan filter"
                  : "Belum ada checkpoint untuk ditampilkan"
                }
              </p>
              {!search && typeFilter === "all" && statusFilter === "all" && dateFilter === "all" && (
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/quality-checkpoints/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Checkpoint Pertama
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
