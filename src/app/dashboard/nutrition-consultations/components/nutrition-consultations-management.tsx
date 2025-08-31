"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, Eye, Edit, Trash2, MessageSquare, Users, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useNutritionConsultations } from '@/hooks/use-nutrition-consultations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface NutritionConsultation {
  id: string
  studentId: string
  question: string
  answer?: string
  status: 'PENDING' | 'ANSWERED' | 'CLOSED'
  createdAt: string
  updatedAt: string
  student?: {
    id: string
    name: string
    school?: {
      id: string
      name: string
    }
  }
}

export function NutritionConsultationsManagement() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  
  const {
    consultations,
    stats,
    loading,
    pagination,
    refetch
  } = useNutritionConsultations({
    page,
    limit: 10,
    search,
    status: statusFilter === 'all' ? '' : statusFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'ANSWERED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Answered</Badge>
      case 'CLOSED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this consultation?')) {
      try {
        const response = await fetch(`/api/nutrition-consultations/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          toast.success('Consultation deleted successfully')
          refetch()
        } else {
          toast.error('Failed to delete consultation')
        }
      } catch (error) {
        console.error('Error deleting consultation:', error)
        toast.error('Error deleting consultation')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Konsultasi Nutrisi</h1>
          <p className="text-muted-foreground">
            Kelola konsultasi nutrisi siswa dan saran ahli gizi
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/nutrition-consultations/create">
            <Plus className="mr-2 h-4 w-4" />
            Konsultasi Baru
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Konsultasi</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.pending || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terjawab</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.answered || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.completionRate?.toFixed(1) || 0}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Konsultasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari konsultasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter berdasarkan status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="ANSWERED">Terjawab</SelectItem>
                <SelectItem value="CLOSED">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consultations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Konsultasi</CardTitle>
          <CardDescription>
            Semua konsultasi nutrisi yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Sekolah</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Memuat data konsultasi...
                  </TableCell>
                </TableRow>
              ) : consultations?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada data konsultasi ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                consultations?.map((consultation: NutritionConsultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">
                      {consultation.student?.name || 'Tidak diketahui'}
                    </TableCell>
                    <TableCell>
                      {consultation.student?.school?.name || 'Tidak diketahui'}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {consultation.question}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(consultation.status)}
                    </TableCell>
                    <TableCell>
                      {formatDate(consultation.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/nutrition-consultations/${consultation.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/nutrition-consultations/${consultation.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(consultation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Menampilkan {((pagination.page - 1) * pagination.limit) + 1} sampai{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
                {pagination.total} konsultasi
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Sebelumnya
                </Button>
                <div className="text-sm font-medium">
                  Halaman {pagination.page} dari {pagination.pages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
