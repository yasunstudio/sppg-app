"use client"

import { useRouter } from "next/navigation"
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
  School,
  Users,
  Phone,
  MapPin,
  User,
  GraduationCap,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Building
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { formatPhoneNumber, formatStudentCount, formatDate } from "./utils/school-formatters"

interface School {
  id: string
  name: string
  principalName: string
  principalPhone: string
  address: string
  totalStudents: number
  notes?: string | null
  latitude?: number | null
  longitude?: number | null
  createdAt: string
  updatedAt: string
  _count?: {
    students: number
    classes: number
    distributions: number
  }
}

interface SchoolDetailsProps {
  schoolId: string
}

export default function SchoolDetails({ schoolId }: SchoolDetailsProps) {
  const router = useRouter()
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/schools/${schoolId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch school details')
        }
        
        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'School not found')
        }
        
        setSchool(result.data)
      } catch (error) {
        console.error('Error fetching school:', error)
        setError(error instanceof Error ? error.message : 'Unknown error')
        toast.error('Gagal memuat detail sekolah')
      } finally {
        setLoading(false)
      }
    }

    fetchSchool()
  }, [schoolId])

  const handleEdit = () => {
    router.push(`/dashboard/schools/${schoolId}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus sekolah ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete school')
      }

      toast.success('Sekolah berhasil dihapus')
      router.push('/dashboard/schools')
    } catch (error) {
      console.error('Error deleting school:', error)
      toast.error('Gagal menghapus sekolah')
    }
  }

  const handleBack = () => {
    router.push('/dashboard/schools')
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat detail sekolah...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            {error || 'Sekolah tidak ditemukan'}
          </div>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{school.name}</h1>
            <p className="text-muted-foreground">Detail informasi sekolah</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="mr-2 h-5 w-5" />
                Informasi Dasar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Sekolah</label>
                  <p className="text-lg font-semibold">{school.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Siswa</label>
                  <p className="text-lg font-semibold">{formatStudentCount(school.totalStudents)}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Alamat</label>
                  <p className="text-base flex items-start">
                    <MapPin className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                    {school.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Principal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informasi Kepala Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Kepala Sekolah</label>
                  <p className="text-lg font-semibold">{school.principalName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nomor Telepon</label>
                  <p className="text-base flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {formatPhoneNumber(school.principalPhone)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {school.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Catatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base whitespace-pre-wrap">{school.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          {school._count && (
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{school._count.students}</p>
                    <p className="text-sm text-muted-foreground">Siswa</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{school._count.classes}</p>
                    <p className="text-sm text-muted-foreground">Kelas</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{school._count.distributions}</p>
                    <p className="text-sm text-muted-foreground">Distribusi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Terdaftar</label>
                <p className="text-base">{formatDate(school.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</label>
                <p className="text-base">{formatDate(school.updatedAt)}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID Sekolah</label>
                <p className="text-xs font-mono bg-muted px-2 py-1 rounded">{school.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          {school.latitude && school.longitude && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Koordinat Lokasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Latitude</label>
                  <p className="text-base font-mono">{school.latitude}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Longitude</label>
                  <p className="text-base font-mono">{school.longitude}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
