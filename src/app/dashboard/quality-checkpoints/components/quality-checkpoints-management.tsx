"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Plus, 
  Filter, 
  Download, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Package,
  Settings,
  Shield,
  Truck,
  Thermometer,
  Camera,
  Search,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { useQualityCheckpoints, useQualityCheckpointMutations } from "@/hooks/use-quality-checkpoints"

export function QualityCheckpointsManagement() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    type: "ALL",
    status: "ALL",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10
  })

  const { data, loading, error, refetch } = useQualityCheckpoints(filters)
  const { deleteCheckpoint, loading: mutationLoading } = useQualityCheckpointMutations()

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }))
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCheckpoint(id)
      refetch()
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleExport = () => {
    toast.info("Export functionality will be implemented soon")
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Checkpoints</h1>
          <p className="text-muted-foreground">
            Kelola dan monitor semua checkpoint kualitas produksi
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/quality-checkpoints/create">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Checkpoint
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checkpoints</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : data?.statistics.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Semua checkpoint yang tercatat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lulus</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : data?.statistics.pass || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Checkpoint yang lulus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gagal</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loading ? "..." : data?.statistics.fail || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Checkpoint yang gagal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bersyarat</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {loading ? "..." : data?.statistics.conditional || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Checkpoint bersyarat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Rework</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {loading ? "..." : data?.statistics.rework || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Checkpoint perlu rework
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Tipe Checkpoint</Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua tipe</SelectItem>
                  <SelectItem value="RAW_MATERIAL">Bahan Baku</SelectItem>
                  <SelectItem value="PRODUCTION">Produksi</SelectItem>
                  <SelectItem value="PACKAGING">Kemasan</SelectItem>
                  <SelectItem value="DISTRIBUTION">Distribusi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua status</SelectItem>
                  <SelectItem value="PASS">Lulus</SelectItem>
                  <SelectItem value="FAIL">Gagal</SelectItem>
                  <SelectItem value="CONDITIONAL">Bersyarat</SelectItem>
                  <SelectItem value="PENDING">Menunggu</SelectItem>
                  <SelectItem value="REWORK_REQUIRED">Perlu Rework</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tanggal Akhir</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setFilters({
                type: "",
                status: "",
                startDate: "",
                endDate: "",
                page: 1,
                limit: 10
              })}
            >
              Reset Filter
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Quality Checkpoints</CardTitle>
          <CardDescription>
            {loading ? "Memuat data..." : `Menampilkan ${data?.checkpoints.length || 0} dari ${data?.pagination.total || 0} checkpoint`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Batch/Plan</TableHead>
                  <TableHead>Pemeriksa</TableHead>
                  <TableHead>Suhu</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.checkpoints.map((checkpoint) => {
                  const typeConfig = getTypeConfig(checkpoint.checkpointType)
                  const statusConfig = getStatusConfig(checkpoint.status)
                  const TypeIcon = typeConfig.icon
                  const StatusIcon = statusConfig.icon

                  return (
                    <TableRow key={checkpoint.id}>
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
                        <div className="space-y-1">
                          {checkpoint.batch && (
                            <p className="text-sm font-medium">{checkpoint.batch.batchNumber}</p>
                          )}
                          {checkpoint.productionPlan?.menu && (
                            <p className="text-xs text-muted-foreground">
                              {checkpoint.productionPlan.menu.name}
                            </p>
                          )}
                          {!checkpoint.batch && !checkpoint.productionPlan && (
                            <p className="text-sm text-muted-foreground">-</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{checkpoint.checker.name}</p>
                          <p className="text-xs text-muted-foreground">{checkpoint.checker.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {checkpoint.temperature ? (
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{checkpoint.temperature}°C</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {checkpoint.photos.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <Camera className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{checkpoint.photos.length}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{formatDate(checkpoint.checkedAt)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(checkpoint.checkedAt)}
                          </p>
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
                            <DropdownMenuItem
                              onClick={() => handleDelete(checkpoint.id)}
                              className="text-red-600"
                              disabled={mutationLoading}
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
          )}

          {data && data.checkpoints.length === 0 && (
            <div className="text-center py-8">
              <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Tidak ada checkpoint yang ditemukan</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/quality-checkpoints/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Checkpoint Pertama
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {data.pagination.page} dari {data.pagination.totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={data.pagination.page <= 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={data.pagination.page >= data.pagination.totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
