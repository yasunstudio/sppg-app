"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  School, 
  MessageSquare, 
  Clock, 
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

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
    nisn: string
    grade: string
    school?: {
      id: string
      name: string
    }
  }
}

interface NutritionConsultationDetailsProps {
  id: string
}

export function NutritionConsultationDetails({ id }: NutritionConsultationDetailsProps) {
  const router = useRouter()
  const [consultation, setConsultation] = useState<NutritionConsultation | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch consultation details
  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await fetch(`/api/nutrition-consultations/${id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setConsultation(result.data)
          } else {
            toast.error("Format data tidak valid")
            router.push('/dashboard/nutrition-consultations')
          }
        } else {
          toast.error("Konsultasi tidak ditemukan")
          router.push('/dashboard/nutrition-consultations')
        }
      } catch (error) {
        console.error('Error fetching consultation:', error)
        toast.error("Gagal memuat detail konsultasi")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchConsultation()
    }
  }, [id, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        )
      case 'ANSWERED':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Terjawab
          </Badge>
        )
      case 'CLOSED':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <XCircle className="h-3 w-3 mr-1" />
            Selesai
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus konsultasi ini?')) {
      return
    }

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/nutrition-consultations/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Konsultasi berhasil dihapus')
        router.push('/dashboard/nutrition-consultations')
      } else {
        toast.error('Gagal menghapus konsultasi')
      }
    } catch (error) {
      console.error('Error deleting consultation:', error)
      toast.error('Terjadi kesalahan saat menghapus konsultasi')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat detail konsultasi...</span>
        </div>
      </div>
    )
  }

  if (!consultation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Konsultasi Tidak Ditemukan</h1>
            <p className="text-muted-foreground">
              Konsultasi yang Anda cari tidak dapat ditemukan
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/nutrition-consultations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
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
          <h1 className="text-3xl font-bold tracking-tight">Detail Konsultasi Nutrisi</h1>
          <p className="text-muted-foreground">
            Informasi lengkap konsultasi nutrisi siswa
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/nutrition-consultations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/nutrition-consultations/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Consultation Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Status Konsultasi
                </span>
                {getStatusBadge(consultation.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Dibuat</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(consultation.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Terakhir diperbarui</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(consultation.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Pertanyaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {consultation.question}
              </p>
            </CardContent>
          </Card>

          {/* Answer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Jawaban Ahli Gizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consultation.answer ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {consultation.answer}
                </p>
              ) : (
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">Belum ada jawaban</p>
                    <p className="text-gray-400 text-sm">
                      Jawaban dari ahli gizi akan muncul di sini
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Student Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informasi Siswa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {consultation.student ? (
                <>
                  <div>
                    <Label className="text-sm font-medium">Nama Siswa</Label>
                    <p className="text-lg font-semibold">{consultation.student.name}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-sm font-medium">NISN</Label>
                    <p className="text-sm text-muted-foreground">{consultation.student.nisn}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Kelas</Label>
                    <p className="text-sm text-muted-foreground">{consultation.student.grade}</p>
                  </div>

                  {consultation.student.school && (
                    <>
                      <Separator />
                      <div className="flex items-start space-x-2">
                        <School className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium">Sekolah</Label>
                          <p className="text-sm text-muted-foreground">
                            {consultation.student.school.name}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Informasi siswa tidak tersedia</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/nutrition-consultations/${id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Konsultasi
                </Link>
              </Button>
              {consultation.student && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/dashboard/students/${consultation.student.id}`}>
                    <User className="h-4 w-4 mr-2" />
                    Lihat Profil Siswa
                  </Link>
                </Button>
              )}
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Konsultasi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
