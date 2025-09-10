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
  User,
  Users,
  GraduationCap,
  School,
  Heart,
  AlertTriangle,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Building,
  Phone
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { formatDate, formatGrade, formatAllergies } from "./utils/student-formatters"

interface Student {
  id: string
  name: string
  grade: string
  schoolId: string
  allergies?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  school?: {
    id: string
    name: string
    principalName: string
    principalPhone: string
  }
  _count?: {
    distributions: number
    nutritionRecords: number
  }
}

interface StudentDetailsProps {
  studentId: string
}

export default function StudentDetails({ studentId }: StudentDetailsProps) {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${studentId}`)
        const result = await response.json()

        if (result.success && result.data) {
          setStudent(result.data)
        } else {
          toast.error("Student tidak ditemukan")
          router.push("/dashboard/students")
        }
      } catch (error) {
        console.error("Error fetching student:", error)
        toast.error("Gagal memuat data student")
      } finally {
        setIsLoading(false)
      }
    }

    if (studentId) {
      fetchStudent()
    }
  }, [studentId, router])

  const handleEdit = () => {
    router.push(`/dashboard/students/${studentId}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus student ini? Tindakan ini tidak dapat dibatalkan.")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Student berhasil dihapus")
        router.push("/dashboard/students")
      } else {
        toast.error(result.message || "Gagal menghapus student")
      }
    } catch (error) {
      console.error("Error deleting student:", error)
      toast.error("Gagal menghapus student")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat data student...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Student Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Student yang Anda cari tidak dapat ditemukan.</p>
            <Button onClick={() => router.push("/dashboard/students")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Student
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kelas</p>
                <p className="text-2xl font-bold">{formatGrade(student.grade)}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sekolah</p>
                <p className="text-2xl font-bold truncate">{student.school?.name || 'N/A'}</p>
              </div>
              <School className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status Alergi</p>
                <p className="text-2xl font-bold">
                  {student.allergies ? (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Ada Alergi
                    </Badge>
                  ) : (
                    <Badge variant="default" className="text-xs">
                      <Heart className="h-3 w-3 mr-1" />
                      Aman
                    </Badge>
                  )}
                </p>
              </div>
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Distribusi</p>
                <p className="text-2xl font-bold">{student._count?.distributions || 0}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">Informasi Student</CardTitle>
              <CardDescription>
                Detail lengkap informasi student
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                <p className="text-sm font-medium">{student.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Kelas</label>
                <p className="text-sm font-medium">{formatGrade(student.grade)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Informasi Sekolah</label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{student.school?.name || 'Sekolah tidak terdaftar'}</span>
                </div>
                {student.school?.principalName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Kepala Sekolah: {student.school.principalName}</span>
                  </div>
                )}
                {student.school?.principalPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.school.principalPhone}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Status Alergi</label>
              <div className="mt-1">
                {student.allergies ? (
                  <div className="space-y-2">
                    <Badge variant="destructive" className="mr-2">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Memiliki Alergi
                    </Badge>
                    <p className="text-sm bg-red-50 border border-red-200 rounded-md p-2">
                      <strong>Alergi:</strong> {formatAllergies(student.allergies)}
                    </p>
                  </div>
                ) : (
                  <Badge variant="default">
                    <Heart className="h-3 w-3 mr-1" />
                    Tidak Ada Alergi
                  </Badge>
                )}
              </div>
            </div>

            {student.notes && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Catatan</label>
                  <p className="text-sm mt-1 bg-gray-50 border rounded-md p-2">{student.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informasi Sistem</CardTitle>
            <CardDescription>
              Data sistem dan riwayat perubahan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">ID Student</TableCell>
                  <TableCell>{student.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tanggal Dibuat</TableCell>
                  <TableCell>{formatDate(student.createdAt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Terakhir Diperbarui</TableCell>
                  <TableCell>{formatDate(student.updatedAt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Distribusi</TableCell>
                  <TableCell>{student._count?.distributions || 0} kali</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Record Nutrisi</TableCell>
                  <TableCell>{student._count?.nutritionRecords || 0} record</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
