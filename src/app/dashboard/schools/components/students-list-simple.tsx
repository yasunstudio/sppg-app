import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Calendar, User } from 'lucide-react'

interface Student {
  id: string
  name: string
  nisn: string
  age: number
  gender: 'MALE' | 'FEMALE'
  grade: string
  parentName: string
  notes?: string
  school: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface StudentsListProps {
  selectedSchool?: string | null
  schools: any[]
  onRefetch: () => void
}

const genderLabels = {
  MALE: 'Laki-laki',
  FEMALE: 'Perempuan'
}

export function StudentsListSimple({ selectedSchool, schools, onRefetch }: StudentsListProps) {
  const { data: studentsResponse, isLoading } = useQuery({
    queryKey: ['students', selectedSchool],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedSchool) params.append('schoolId', selectedSchool)
      
      const response = await fetch(`/api/students?${params}`)
      if (!response.ok) throw new Error('Failed to fetch students')
      return response.json()
    }
  })

  const students: Student[] = studentsResponse?.data || []

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Memuat data siswa...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!students || students.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Belum Ada Siswa</h3>
            <p className="text-muted-foreground">
              {selectedSchool 
                ? 'Belum ada siswa untuk sekolah yang dipilih'
                : 'Belum ada data siswa'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daftar Siswa ({students.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>NISN</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Umur</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Orang Tua</TableHead>
                  <TableHead>Sekolah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {student.nisn}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        Kelas {student.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                        {student.age} tahun
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {genderLabels[student.gender]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <User className="w-3 h-3 mr-1 text-muted-foreground" />
                        {student.parentName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {student.school.name}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
