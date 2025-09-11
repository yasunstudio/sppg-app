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
import type { Class } from '../utils/class-types'
import { useState } from 'react'

interface ClassTableViewProps {
  classes: Class[]
  loading?: boolean
  onView?: (classId: string) => void
  onEdit?: (classId: string) => void
  onDelete?: (classId: string) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
}

type SortColumn = 'name' | 'grade' | 'capacity' | 'teacherName' | 'school' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export function ClassTableView({
  classes,
  loading,
  onView,
  onEdit,
  onDelete,
  onSort
}: ClassTableViewProps) {
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
      {[...Array(6)].map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )

  const getGradeBadgeColor = (grade: number) => {
    const colors = {
      1: "bg-red-100 text-red-800",
      2: "bg-orange-100 text-orange-800", 
      3: "bg-yellow-100 text-yellow-800",
      4: "bg-green-100 text-green-800",
      5: "bg-blue-100 text-blue-800",
      6: "bg-purple-100 text-purple-800",
    } as const
    return colors[grade as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <SortButton column="name">Nama Kelas</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="grade">Tingkat</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="school">Sekolah</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="teacherName">Guru</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="capacity">Kapasitas</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="createdAt">Dibuat</SortButton>
                </TableHead>
                <TableHead className="w-[50px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <LoadingSkeleton key={i} />)
              ) : classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Tidak ada data kelas ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((classItem) => (
                  <TableRow key={classItem.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {classItem.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={getGradeBadgeColor(classItem.grade)}>
                        Kelas {classItem.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{classItem.school?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {classItem.teacherName || (
                        <span className="text-muted-foreground italic">Belum ditentukan</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{classItem.capacity}</span> siswa
                    </TableCell>
                    <TableCell>
                      {new Date(classItem.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView?.(classItem.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit?.(classItem.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Kelas
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete?.(classItem.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Kelas
                          </DropdownMenuItem>
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
