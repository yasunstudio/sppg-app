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
import { Plus, MoreHorizontal, Edit, Trash2, Eye, Search, GraduationCap, Users } from 'lucide-react'
// Class form import
import { ClassForm } from '@/app/dashboard/schools/components/class-form'

interface Class {
  id: string
  name: string
  grade: number
  capacity: number
  currentStudents: number
  teacherName?: string
  schedule?: string
  room?: string
  status: 'ACTIVE' | 'INACTIVE'
  school: {
    id: string
    name: string
  }
  createdAt: string
}

interface School {
  id: string
  name: string
  type: string
}

interface ClassesListProps {
  selectedSchool: string | null
  schools: School[]
  onRefetch: () => void
}

export function ClassesList({ selectedSchool, schools, onRefetch }: ClassesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [gradeFilter, setGradeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null)
  const [editClass, setEditClass] = useState<Class | null>(null)
  const [viewClass, setViewClass] = useState<Class | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  // Fetch classes data
  const { data: classesResponse, isLoading, refetch } = useQuery({
    queryKey: ['classes', selectedSchool, gradeFilter, statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedSchool) params.append('schoolId', selectedSchool)
      if (gradeFilter !== 'ALL') params.append('grade', gradeFilter)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`/api/classes?${params}`)
      if (!response.ok) throw new Error('Failed to fetch classes')
      return response.json()
    }
  })

  const classes = classesResponse?.data || []

  const deleteMutation = useMutation({
    mutationFn: async (classId: string) => {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete class')
      return response.json()
    },
    onSuccess: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Berhasil',
        description: 'Kelas berhasil dihapus',
      })
      refetch()
      setDeleteClassId(null)
    },
    onError: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Error',
        description: 'Gagal menghapus kelas',
      })
    },
  })

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const statusLabels = {
    ACTIVE: 'Aktif',
    INACTIVE: 'Tidak Aktif'
  }

  if (!selectedSchool) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Pilih Sekolah</h3>
            <p className="text-muted-foreground">
              Silakan pilih sekolah terlebih dahulu untuk melihat daftar kelas
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
            <h2 className="text-xl font-semibold">Daftar Kelas</h2>
            {selectedSchoolData && (
              <p className="text-muted-foreground">
                {selectedSchoolData.name}
              </p>
            )}
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kelas
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Kelas Baru</DialogTitle>
              </DialogHeader>
              <ClassForm
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
                    placeholder="Cari kelas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Tingkat</SelectItem>
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
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Kelas ({classes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada kelas ditemukan</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kelas</TableHead>
                    <TableHead>Tingkat</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Wali Kelas</TableHead>
                    <TableHead>Ruang</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem: Class) => (
                    <TableRow key={classItem.id}>
                      <TableCell>
                        <div className="font-medium">{classItem.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {classItem.schedule || 'Jadwal belum diatur'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Kelas {classItem.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className={getCapacityColor(classItem.currentStudents, classItem.capacity)}>
                            {classItem.currentStudents}/{classItem.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((classItem.currentStudents / classItem.capacity) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {classItem.teacherName || '-'}
                      </TableCell>
                      <TableCell>
                        {classItem.room || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(classItem.status)}>
                          {statusLabels[classItem.status]}
                        </Badge>
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
                              onClick={() => setViewClass(classItem)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setEditClass(classItem)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteClassId(classItem.id)}
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

      {/* View Class Dialog */}
      <Dialog open={!!viewClass} onOpenChange={() => setViewClass(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Kelas</DialogTitle>
          </DialogHeader>
          {viewClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Kelas</label>
                  <p className="text-sm">{viewClass.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tingkat</label>
                  <p className="text-sm">
                    <Badge variant="outline">
                      Kelas {viewClass.grade}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kapasitas</label>
                  <p className="text-sm">
                    {viewClass.currentStudents}/{viewClass.capacity} siswa
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm">
                    <Badge className={getStatusColor(viewClass.status)}>
                      {statusLabels[viewClass.status]}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wali Kelas</label>
                  <p className="text-sm">{viewClass.teacherName || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ruang Kelas</label>
                  <p className="text-sm">{viewClass.room || '-'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Jadwal</label>
                  <p className="text-sm">{viewClass.schedule || 'Jadwal belum diatur'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</label>
                  <p className="text-sm">
                    {new Date(viewClass.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={!!editClass} onOpenChange={() => setEditClass(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Kelas</DialogTitle>
          </DialogHeader>
          {editClass && (
            <ClassForm
              class={editClass}
              schoolId={selectedSchool || ''}
              onSuccess={() => {
                setEditClass(null)
                refetch()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteClassId} onOpenChange={() => setDeleteClassId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteClassId && deleteMutation.mutate(deleteClassId)}
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
