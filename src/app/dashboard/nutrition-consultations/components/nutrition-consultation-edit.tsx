"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { 
  Loader2, 
  Save, 
  ArrowLeft, 
  Search, 
  User, 
  School, 
  MessageSquare,
  AlertCircle 
} from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  name: string
  nisn: string
  grade: string
  school: {
    id: string
    name: string
  }
}

interface School {
  id: string
  name: string
}

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

interface NutritionConsultationEditProps {
  id: string
}

export function NutritionConsultationEdit({ id }: NutritionConsultationEditProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [consultation, setConsultation] = useState<NutritionConsultation | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    question: "",
    answer: "",
    status: "PENDING" as "PENDING" | "ANSWERED" | "CLOSED"
  })
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSchoolId, setSelectedSchoolId] = useState("all")

  // Fetch consultation data
  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await fetch(`/api/nutrition-consultations/${id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            const data = result.data
            setConsultation(data)
            setFormData({
              studentId: data.studentId,
              question: data.question,
              answer: data.answer || "",
              status: data.status
            })
          } else {
            toast.error("Konsultasi tidak ditemukan")
            router.push('/dashboard/nutrition-consultations')
          }
        } else {
          toast.error("Gagal memuat data konsultasi")
          router.push('/dashboard/nutrition-consultations')
        }
      } catch (error) {
        console.error('Error fetching consultation:', error)
        toast.error("Terjadi kesalahan saat memuat data")
        router.push('/dashboard/nutrition-consultations')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchConsultation()
    }
  }, [id, router])

  // Fetch schools for filtering
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools?limit=100')
        const result = await response.json()
        if (result.data) {
          setSchools(result.data)
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
      }
    }
    fetchSchools()
  }, [])

  // Fetch students based on search and school filter
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true)
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (selectedSchoolId && selectedSchoolId !== 'all') params.append('schoolId', selectedSchoolId)
        
        const response = await fetch(`/api/students?${params.toString()}`)
        const result = await response.json()
        if (result.data) {
          setStudents(result.data)
        }
      } catch (error) {
        console.error('Error fetching students:', error)
        toast.error("Gagal memuat data siswa")
      } finally {
        setLoadingStudents(false)
      }
    }
    
    fetchStudents()
  }, [searchTerm, selectedSchoolId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.studentId || !formData.question.trim()) {
      toast.error("Siswa dan pertanyaan harus diisi")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/nutrition-consultations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Konsultasi berhasil diperbarui")
        router.push(`/dashboard/nutrition-consultations/${id}`)
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal memperbarui konsultasi")
      }
    } catch (error) {
      console.error('Error updating consultation:', error)
      toast.error("Terjadi kesalahan saat memperbarui konsultasi")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/dashboard/nutrition-consultations/${id}`)
  }

  const selectedStudent = students.find(s => s.id === formData.studentId)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat data konsultasi...</span>
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
              Konsultasi yang ingin Anda edit tidak dapat ditemukan
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Konsultasi Nutrisi</h1>
          <p className="text-muted-foreground">
            Perbarui informasi konsultasi nutrisi siswa
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Student Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Pilih Siswa
              </CardTitle>
              <CardDescription>
                Cari dan pilih siswa yang akan berkonsultasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Student Info */}
              {consultation.student && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Siswa Saat Ini:</p>
                      <p className="text-sm text-blue-700">
                        {consultation.student.name} ({consultation.student.nisn})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* School Filter */}
              <div className="space-y-2">
                <Label htmlFor="school-filter">Filter Sekolah</Label>
                <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sekolah..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Sekolah</SelectItem>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Student Search */}
              <div className="space-y-2">
                <Label htmlFor="student-search">Cari Siswa</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="student-search"
                    placeholder="Cari nama atau NISN siswa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Student Selection */}
              <div className="space-y-2">
                <Label htmlFor="student">Siswa *</Label>
                <Select 
                  value={formData.studentId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih siswa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingStudents ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Memuat siswa...
                      </div>
                    ) : students.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        {searchTerm || (selectedSchoolId && selectedSchoolId !== 'all') ? "Tidak ada siswa yang sesuai" : "Tidak ada data siswa"}
                      </div>
                    ) : (
                      students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {student.nisn} • {student.grade} • {student.school.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Student Info */}
              {selectedStudent && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedStudent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        NISN: {selectedStudent.nisn} • Kelas: {selectedStudent.grade}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sekolah: {selectedStudent.school.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consultation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Detail Konsultasi
              </CardTitle>
              <CardDescription>
                Perbarui pertanyaan, jawaban, dan status konsultasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question */}
              <div className="space-y-2">
                <Label htmlFor="question">Pertanyaan *</Label>
                <Textarea
                  id="question"
                  placeholder="Masukkan pertanyaan atau keluhan terkait nutrisi siswa..."
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              {/* Answer (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="answer">Jawaban Ahli Gizi</Label>
                <Textarea
                  id="answer"
                  placeholder="Jawaban dari ahli gizi..."
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "PENDING" | "ANSWERED" | "CLOSED") => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Menunggu</SelectItem>
                    <SelectItem value="ANSWERED">Dijawab</SelectItem>
                    <SelectItem value="CLOSED">Ditutup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
