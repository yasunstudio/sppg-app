import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Plus, MoreHorizontal, Edit, Trash2, Eye, Search, Users, UserPlus } from 'lucide-react'
// Student form import
import { StudentForm } from '@/app/dashboard/schools/components/student-form'

interface Student {
  id: string
  name: string
  nisn: string
  age: number
  gender: 'MALE' | 'FEMALE'
  grade: string
  parentName: string
  notes?: string | null
  schoolId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  school: {
    id: string
    name: string
  }
}

interface School {
  id: string
  name: string
  type: string
}

interface StudentsListProps {
  selectedSchool: string | null
  schools: School[]
  onRefetch: () => void
}

export function StudentsList({ selectedSchool, schools, onRefetch }: StudentsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [gradeFilter, setGradeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null)
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [viewStudent, setViewStudent] = useState<Student | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  // Fetch students data
  const { data: studentsResponse, isLoading, refetch } = useQuery({
    queryKey: ['students', selectedSchool, gradeFilter, statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedSchool) params.append('schoolId', selectedSchool)
      if (gradeFilter !== 'ALL') params.append('grade', gradeFilter)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`/api/students?${params}`)
      if (!response.ok) throw new Error('Failed to fetch students')
      return response.json()
    }
  })

  const students = studentsResponse?.data || []

  const deleteMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete student')
      return response.json()
    },
    onSuccess: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Berhasil',
        description: 'Siswa berhasil dihapus',
      })
      refetch()
      setDeleteStudentId(null)
    },
    onError: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Error',
        description: 'Gagal menghapus siswa',
      })
    },
  })

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800',
      GRADUATED: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const statusLabels = {
    ACTIVE: 'Aktif',
    INACTIVE: 'Tidak Aktif',
    GRADUATED: 'Lulus'
  }

  const genderLabels = {
    MALE: 'Laki-laki',
    FEMALE: 'Perempuan'
  }

  if (!selectedSchool) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Pilih Sekolah</h3>
            <p className="text-muted-foreground">
              Silakan pilih sekolah terlebih dahulu untuk melihat daftar siswa
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const selectedSchoolData = schools.find(s => s.id === selectedSchool)

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Daftar Siswa</h2>
            {selectedSchoolData && (
              <p className="text-muted-foreground">
                {selectedSchoolData.name}
              </p>
            )}
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Siswa Baru</DialogTitle>
              </DialogHeader>
              <StudentForm
                schoolId={selectedSchool}
                onSuccess={() => {
                  setIsCreateDialogOpen(false)
                  refetch()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari siswa (nama atau NIS)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Kelas</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Kelas {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                  <SelectItem value="GRADUATED">Lulus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Siswa ({students.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada siswa ditemukan</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama & NIS</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orang Tua</TableHead>
                    <TableHead>Diet Khusus</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student: Student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            NIS: {student.nisn}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">Kelas {student.grade}</div>
                          <div className="text-sm text-muted-foreground">
                            Umur {student.age} tahun
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {genderLabels[student.gender as keyof typeof genderLabels]}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {genderLabels[student.gender as keyof typeof genderLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{student.parentName || '-'}</div>
                          <div className="text-muted-foreground">
                            {student.notes ? 'Ada catatan' : 'Tidak ada catatan'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.notes ? (
                          <Badge variant="outline">Ada Catatan</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => setViewStudent(student)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setEditStudent(student)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteStudentId(student.id)}
                              className="cursor-pointer text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Student Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Siswa</DialogTitle>
          </DialogHeader>
          {viewStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                  <p className="text-sm">{viewStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NISN</label>
                  <p className="text-sm">{viewStudent.nisn}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kelas</label>
                  <p className="text-sm">Kelas {viewStudent.grade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</label>
                  <p className="text-sm">{genderLabels[viewStudent.gender]}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Umur</label>
                  <p className="text-sm">{viewStudent.age} tahun</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</label>
                  <Badge variant="outline">
                    {genderLabels[viewStudent.gender as keyof typeof genderLabels]}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Orang Tua</label>
                  <p className="text-sm">{viewStudent.parentName || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kontak Orang Tua</label>
                  <p className="text-sm">Lihat data kontak tersendiri</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Catatan</label>
                  <p className="text-sm">{viewStudent.notes || 'Tidak ada catatan'}</p>
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={!!editStudent} onOpenChange={() => setEditStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Siswa</DialogTitle>
          </DialogHeader>
          {editStudent && (
            <StudentForm
              student={editStudent}
              schoolId={selectedSchool || ''}
              onSuccess={() => {
                setEditStudent(null)
                refetch()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteStudentId} onOpenChange={() => setDeleteStudentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus siswa ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteStudentId && deleteMutation.mutate(deleteStudentId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
