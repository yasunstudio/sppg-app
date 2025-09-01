"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  Users,
  ClipboardList,
  Package,
  CheckCircle,
  AlertCircle,
  FileText,
  Activity,
  PlayCircle,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

interface ProductionPlan {
  id: string
  planDate: string
  targetPortions: number
  menuId?: string
  kitchenId?: string
  status: string
  plannedStartTime?: string
  plannedEndTime?: string
  actualStartTime?: string
  actualEndTime?: string
  notes?: string
  createdAt: string
  menu?: {
    id: string
    name: string
    description?: string
    mealType: string
    targetGroup: string
    totalCalories?: number
    totalProtein?: number
    totalFat?: number
    totalCarbs?: number
    menuItems: Array<{
      id: string
      name: string
      category: string
      servingSize: number
      description?: string
    }>
  }
  batches: Array<{
    id: string
    batchNumber: string
    status: string
    plannedQuantity: number
    actualQuantity?: number
    startedAt?: string
    completedAt?: string
    qualityScore?: number
    notes?: string
  }>
  qualityChecks: Array<{
    id: string
    checkpointType: string
    status: string
    checkedAt: string
    checkedBy: string
    temperature?: number
    visualInspection?: string
    notes?: string
  }>
  _count: {
    batches: number
    qualityChecks: number
  }
}

export function ProductionPlanDetails() {
  const router = useRouter()
  const params = useParams()
  const [productionPlan, setProductionPlan] = useState<ProductionPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProductionPlan(params.id as string)
    }
  }, [params.id])

  const fetchProductionPlan = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/production-plans/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch production plan')
      }

      const data = await response.json()
      setProductionPlan(data)
    } catch (error) {
      console.error('Error fetching production plan:', error)
      toast.error('Gagal memuat data production plan')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; icon: React.ReactNode } } = {
      PLANNED: { color: "bg-blue-100 text-blue-800", icon: <ClipboardList className="w-3 h-3" /> },
      IN_PROGRESS: { color: "bg-orange-100 text-orange-800", icon: <PlayCircle className="w-3 h-3" /> },
      COMPLETED: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3" /> },
    }
    
    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800", icon: <AlertCircle className="w-3 h-3" /> }
    
    return (
      <Badge variant="secondary" className={`${statusInfo.color} gap-1`}>
        {statusInfo.icon}
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getBatchStatusBadge = (status: string) => {
    const colorMap: { [key: string]: string } = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800"
    }
    
    return (
      <Badge variant="secondary" className={colorMap[status] || "bg-gray-100 text-gray-800"}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getQualityStatusBadge = (status: string) => {
    const colorMap: { [key: string]: string } = {
      PASSED: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800"
    }
    
    return (
      <Badge variant="secondary" className={colorMap[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    )
  }

  const getMealTypeBadge = (mealType: string) => {
    const colorMap: { [key: string]: string } = {
      BREAKFAST: "bg-yellow-100 text-yellow-800",
      LUNCH: "bg-blue-100 text-blue-800",
      DINNER: "bg-purple-100 text-purple-800",
      SNACK: "bg-green-100 text-green-800"
    }
    
    return (
      <Badge variant="secondary" className={colorMap[mealType] || "bg-gray-100 text-gray-800"}>
        {mealType}
      </Badge>
    )
  }

  const calculateDuration = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return null
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}j ${minutes}m`
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!productionPlan) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-8">
          <h3 className="mt-2 text-sm font-semibold">Production plan not found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Data production plan yang dicari tidak ditemukan.
          </p>
          <Button className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Production Plan Details</h1>
            <p className="text-muted-foreground">
              Complete information about the food production plan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/dashboard/production-plans/${productionPlan.id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Plan Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(productionPlan.planDate)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Target Portions</label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{productionPlan.targetPortions.toLocaleString()}</span>
                  <span className="text-muted-foreground">portions</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  {getStatusBadge(productionPlan.status)}
                </div>
              </div>

              {productionPlan.kitchenId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kitchen ID</label>
                  <p className="font-medium">{productionPlan.kitchenId}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Menu Information */}
        {productionPlan.menu && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Menu Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Menu</label>
                  <p className="font-medium text-lg">{productionPlan.menu.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Jenis & Target</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getMealTypeBadge(productionPlan.menu.mealType)}
                    <span className="text-sm text-muted-foreground">{productionPlan.menu.targetGroup}</span>
                  </div>
                </div>

                {productionPlan.menu.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Deskripsi</label>
                    <p className="text-sm text-muted-foreground">{productionPlan.menu.description}</p>
                  </div>
                )}

                {/* Nutrition Info */}
                {(productionPlan.menu.totalCalories || productionPlan.menu.totalProtein) && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Informasi Gizi</label>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                      {productionPlan.menu.totalCalories && (
                        <div>Kalori: {productionPlan.menu.totalCalories} kcal</div>
                      )}
                      {productionPlan.menu.totalProtein && (
                        <div>Protein: {productionPlan.menu.totalProtein}g</div>
                      )}
                      {productionPlan.menu.totalFat && (
                        <div>Lemak: {productionPlan.menu.totalFat}g</div>
                      )}
                      {productionPlan.menu.totalCarbs && (
                        <div>Karbo: {productionPlan.menu.totalCarbs}g</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Production Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {productionPlan.plannedStartTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Waktu Mulai Rencana</label>
                  <p className="font-medium">{formatDateTime(productionPlan.plannedStartTime)}</p>
                </div>
              )}

              {productionPlan.plannedEndTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Waktu Selesai Rencana</label>
                  <p className="font-medium">{formatDateTime(productionPlan.plannedEndTime)}</p>
                </div>
              )}

              {productionPlan.plannedStartTime && productionPlan.plannedEndTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Durasi Rencana</label>
                  <p className="font-medium">
                    {calculateDuration(productionPlan.plannedStartTime, productionPlan.plannedEndTime)}
                  </p>
                </div>
              )}

              <Separator />

              {productionPlan.actualStartTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Waktu Mulai Aktual</label>
                  <p className="font-medium">{formatDateTime(productionPlan.actualStartTime)}</p>
                </div>
              )}

              {productionPlan.actualEndTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Waktu Selesai Aktual</label>
                  <p className="font-medium">{formatDateTime(productionPlan.actualEndTime)}</p>
                </div>
              )}

              {productionPlan.actualStartTime && productionPlan.actualEndTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Durasi Aktual</label>
                  <p className="font-medium">
                    {calculateDuration(productionPlan.actualStartTime, productionPlan.actualEndTime)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Statistik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Batches</label>
                <p className="text-2xl font-bold">{productionPlan._count.batches}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Quality Checks</label>
                <p className="text-2xl font-bold">{productionPlan._count.qualityChecks}</p>
              </div>

              {/* Batch completion percentage */}
              {productionPlan.batches.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Batch Progress</label>
                  <div className="mt-1">
                    <div className="text-sm text-muted-foreground mb-1">
                      {productionPlan.batches.filter(b => b.status === 'COMPLETED').length} of {productionPlan.batches.length} completed
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{
                          width: `${(productionPlan.batches.filter(b => b.status === 'COMPLETED').length / productionPlan.batches.length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      {productionPlan.menu?.menuItems && productionPlan.menu.menuItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>Daftar item yang termasuk dalam menu ini</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Item</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Ukuran Porsi</TableHead>
                  <TableHead>Deskripsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionPlan.menu.menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.servingSize}g</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.description || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Production Batches */}
      {productionPlan.batches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Production Batches</CardTitle>
            <CardDescription>List of production batches for this plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kuantitas</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Quality Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionPlan.batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                    <TableCell>{getBatchStatusBadge(batch.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{batch.actualQuantity || batch.plannedQuantity} / {batch.plannedQuantity}</span>
                        <span className="text-sm text-muted-foreground">Aktual / Rencana</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        {batch.startedAt && <span>Mulai: {formatDateTime(batch.startedAt)}</span>}
                        {batch.completedAt && <span>Selesai: {formatDateTime(batch.completedAt)}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {batch.qualityScore ? (
                        <Badge variant={batch.qualityScore >= 80 ? "default" : "destructive"}>
                          {batch.qualityScore.toFixed(1)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Quality Checks */}
      {productionPlan.qualityChecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Checks</CardTitle>
            <CardDescription>Quality inspection history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Checkpoint Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Checked By</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Checked At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionPlan.qualityChecks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell className="font-medium">{check.checkpointType}</TableCell>
                    <TableCell>{getQualityStatusBadge(check.status)}</TableCell>
                    <TableCell>{check.checkedBy}</TableCell>
                    <TableCell>
                      {check.temperature ? `${check.temperature}°C` : '-'}
                    </TableCell>
                    <TableCell>{formatDateTime(check.checkedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Notes Section */}
      {productionPlan.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{productionPlan.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID Production Plan:</span>
              <span className="font-mono">{productionPlan.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dibuat pada:</span>
              <span>{formatDateTime(productionPlan.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
