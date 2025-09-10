'use client'

import { MoreVertical, Eye, Edit, Trash2, Users } from 'lucide-react'
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
import { formatCapacity, formatGradeLevel, formatClassStatus, formatClassStatusText, formatTeacherName } from '../utils/class-formatters'
import type { Class } from '../utils/class-types'
import { useClasses } from '../hooks/use-classes'
import { useRouter } from 'next/navigation'

interface ClassTableViewProps {
  className?: string
}

export function ClassTableView({ className }: ClassTableViewProps) {
  const router = useRouter()
  const { classes, isLoading, error } = useClasses()

  const handleView = (classId: string) => {
    router.push(`/dashboard/classes/${classId}`)
  }

  const handleEdit = (classId: string) => {
    router.push(`/dashboard/classes/${classId}/edit`)
  }

  const handleDelete = (classId: string) => {
    // Implement delete logic
    console.log('Delete class:', classId)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Data Kelas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kelas</TableHead>
              <TableHead>Tingkat</TableHead>
              <TableHead>Kapasitas</TableHead>
              <TableHead>Terisi</TableHead>
              <TableHead>Guru</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Tidak ada data kelas</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              classes.map((classItem) => {
                const status = formatClassStatus(classItem.currentCount, classItem.capacity)
                return (
                  <TableRow key={classItem.id}>
                    <TableCell className="font-medium">
                      {classItem.name}
                    </TableCell>
                    <TableCell>
                      {formatGradeLevel(classItem.grade)}
                    </TableCell>
                    <TableCell>
                      {classItem.capacity} siswa
                    </TableCell>
                    <TableCell>
                      {formatCapacity(classItem.currentCount, classItem.capacity)}
                    </TableCell>
                    <TableCell>
                      {formatTeacherName(classItem.teacherName)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status === 'full' ? 'destructive' : status === 'active' ? 'default' : 'secondary'}>
                        {formatClassStatusText(status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(classItem.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(classItem.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(classItem.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
