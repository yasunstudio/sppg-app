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
import { GraduationCap, Users, User } from 'lucide-react'

interface Class {
  id: string
  name: string
  grade: number
  capacity: number
  currentCount: number
  teacherName?: string
  notes?: string
  schoolName: string
  schoolId: string
  createdAt: string
  updatedAt: string
}

interface ClassesListProps {
  selectedSchool?: string | null
  schools: any[]
  onRefetch: () => void
}

export function ClassesList({ selectedSchool, schools, onRefetch }: ClassesListProps) {
  const { data: classesResponse, isLoading } = useQuery({
    queryKey: ['classes', selectedSchool],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedSchool) params.append('schoolId', selectedSchool)
      
      const response = await fetch(`/api/classes?${params}`)
      if (!response.ok) throw new Error('Failed to fetch classes')
      return response.json()
    }
  })

  const classes: Class[] = classesResponse?.data || []

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Memuat data kelas...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!classes || classes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Belum Ada Kelas</h3>
            <p className="text-muted-foreground">
              {selectedSchool 
                ? 'Belum ada kelas untuk sekolah yang dipilih'
                : 'Belum ada data kelas'
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
            <span>Daftar Kelas ({classes.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kelas</TableHead>
                  <TableHead>Tingkat</TableHead>
                  <TableHead>Kapasitas</TableHead>
                  <TableHead>Jumlah Siswa</TableHead>
                  <TableHead>Guru Kelas</TableHead>
                  <TableHead>Sekolah</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>
                      <div className="font-medium">{classItem.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        Kelas {classItem.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Users className="w-3 h-3 mr-1 text-muted-foreground" />
                        {classItem.capacity} siswa
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Users className="w-3 h-3 mr-1 text-muted-foreground" />
                        {classItem.currentCount} siswa
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <User className="w-3 h-3 mr-1 text-muted-foreground" />
                        {classItem.teacherName || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {classItem.schoolName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {classItem.notes || '-'}
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
