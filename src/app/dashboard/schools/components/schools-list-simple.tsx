import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Phone, MapPin, Users, GraduationCap, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'

interface School {
  id: string
  name: string
  address: string
  principalName: string
  principalPhone: string
  totalStudents: number
  notes?: string
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt: string
  studentCount: number
  classCount: number
}

interface SchoolsListProps {
  schools: School[]
  isLoading: boolean
  onRefetch: () => void
  onSelectSchool: (schoolId: string) => void
}

export function SchoolsList({ 
  schools, 
  isLoading, 
  onRefetch,
  onSelectSchool
}: SchoolsListProps) {
  const [viewSchool, setViewSchool] = useState<School | null>(null)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Memuat data sekolah...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!schools || schools.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Belum ada data sekolah</p>
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
            <span>Daftar Sekolah ({schools.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sekolah</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Kepala Sekolah</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{school.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {school.principalPhone || '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">SD Negeri</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Aktif</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="truncate max-w-32" title={school.address}>
                          {school.address}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Users className="w-3 h-3 mr-1 text-muted-foreground" />
                        {school.totalStudents}
                      </div>
                    </TableCell>
                    <TableCell>{school.classCount}</TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {school.principalName || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setViewSchool(school)}
                            className="flex items-center"
                          >
                            <Eye className="w-3 h-3 mr-2" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onSelectSchool(school.id)}
                            className="flex items-center text-blue-600"
                          >
                            <MapPin className="w-3 h-3 mr-2" />
                            Lihat Distribusi
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View School Dialog */}
      {viewSchool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Detail Sekolah</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nama Sekolah</label>
                <p className="text-sm">{viewSchool.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Alamat</label>
                <p className="text-sm">{viewSchool.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Kepala Sekolah</label>
                <p className="text-sm">{viewSchool.principalName}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Telepon</label>
                <p className="text-sm">{viewSchool.principalPhone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Total Siswa</label>
                <p className="text-sm">{viewSchool.totalStudents} siswa</p>
              </div>
              <div>
                <label className="text-sm font-medium">Total Kelas</label>
                <p className="text-sm">{viewSchool.classCount} kelas</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setViewSchool(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
