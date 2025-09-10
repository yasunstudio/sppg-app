'use client'

import { MoreVertical, Eye, Edit, Trash2, SortAsc, SortDesc } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { formatGender, formatAge, formatDate } from '../utils/student-formatters'
import type { Student } from '../utils/student-types'
import { useState } from 'react'

interface StudentTableViewProps {
  students: Student[]
  loading?: boolean
  onView?: (studentId: string) => void
  onEdit?: (studentId: string) => void
  onDelete?: (studentId: string) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
}

type SortColumn = 'nisn' | 'name' | 'age' | 'gender' | 'grade' | 'school' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export function StudentTableView({
  students,
  loading,
  onView,
  onEdit,
  onDelete,
  onSort
}: StudentTableViewProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (column: SortColumn) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newDirection)
    onSort?.(column, newDirection)
  }

  const SortButton = ({ column, children }: { column: SortColumn; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(column)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      {sortColumn === column && (
        sortDirection === 'asc' ? 
          <SortAsc className="ml-1 h-4 w-4" /> : 
          <SortDesc className="ml-1 h-4 w-4" />
      )}
    </Button>
  )

  const LoadingSkeleton = () => (
    <TableRow>
      {[...Array(7)].map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Siswa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <SortButton column="nisn">NISN</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="name">Nama Siswa</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="age">Umur</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="gender">Jenis Kelamin</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="grade">Kelas</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="school">Sekolah</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="createdAt">Terdaftar</SortButton>
                </TableHead>
                <TableHead className="w-[70px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => <LoadingSkeleton key={i} />)
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      Belum ada data siswa
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{student.nisn}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.parentName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatAge(student.age)}</TableCell>
                    <TableCell>
                      <Badge variant={student.gender === 'MALE' ? 'default' : 'secondary'}>
                        {formatGender(student.gender)}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>
                      <div className="text-sm">{student.school?.name || 'Tidak ada sekolah'}</div>
                    </TableCell>
                    <TableCell>
                      {formatDate(student.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(student.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(student.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Ubah
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => onDelete(student.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
