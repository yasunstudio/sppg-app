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
import { Loader2, Save, ArrowLeft, Search, User, School, MessageSquare } from "lucide-react"

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

export function NutritionConsultationCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    question: "",
    answer: "",
    status: "PENDING" as "PENDING" | "ANSWERED" | "CLOSED"
  })
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSchoolId, setSelectedSchoolId] = useState("")

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
        if (selectedSchoolId) params.append('schoolId', selectedSchoolId)
        
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

    setLoading(true)
    try {
      const response = await fetch('/api/nutrition-consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Konsultasi nutrisi berhasil dibuat")
        router.push('/dashboard/nutrition-consultations')
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal membuat konsultasi")
      }
    } catch (error) {
      console.error('Error creating consultation:', error)
      toast.error("Terjadi kesalahan saat membuat konsultasi")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/nutrition-consultations')
  }

  const selectedStudent = students.find(s => s.id === formData.studentId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buat Konsultasi Nutrisi Baru</h1>
          <p className="text-muted-foreground">
            Buat konsultasi nutrisi baru untuk siswa yang membutuhkan saran ahli gizi
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
              {/* School Filter */}
              <div className="space-y-2">
                <Label htmlFor="school-filter">Filter Sekolah</Label>
                <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sekolah..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Sekolah</SelectItem>
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
                        {searchTerm || selectedSchoolId ? "Tidak ada siswa yang sesuai" : "Tidak ada data siswa"}
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
                Masukkan pertanyaan dan status konsultasi
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
                <Label htmlFor="answer">Jawaban (Opsional)</Label>
                <Textarea
                  id="answer"
                  placeholder="Jawaban dari ahli gizi (dapat diisi kemudian)..."
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
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Konsultasi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
