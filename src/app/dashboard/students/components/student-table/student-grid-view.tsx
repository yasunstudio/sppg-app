'use client'

import { MoreVertical, Eye, Edit, Trash2, Calendar, User, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { formatGender, formatAge, formatDate } from '../utils/student-formatters'
import type { Student } from '../utils/student-types'

interface StudentGridViewProps {
  students: Student[]
  loading?: boolean
  onView?: (studentId: string) => void
  onEdit?: (studentId: string) => void
  onDelete?: (studentId: string) => void
}

export function StudentGridView({
  students,
  loading,
  onView,
  onEdit,
  onDelete
}: StudentGridViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
                <div className="h-6 w-16 bg-muted rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <GraduationCap className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Belum ada siswa
        </h3>
        <p className="text-sm text-muted-foreground">
          Data siswa akan ditampilkan di sini
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map((student) => (
        <Card key={student.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{student.name}</h3>
                <p className="text-sm text-muted-foreground">NISN: {student.nisn}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={student.gender === 'MALE' ? 'default' : 'secondary'}>
                  {formatGender(student.gender)}
                </Badge>
                
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
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Age and Grade */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Umur:</span>
                  <span className="font-medium">{formatAge(student.age)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Kelas:</span>
                  <span className="font-medium">{student.grade}</span>
                </div>
              </div>

              {/* School */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sekolah:</span>
                <span className="font-medium">{student.school?.name || 'Tidak ada sekolah'}</span>
              </div>

              {/* Parent */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Orang Tua:</span>
                <span className="font-medium">{student.parentName}</span>
              </div>

              {/* Notes */}
              {student.notes && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Catatan:</span>
                  <span className="font-medium text-xs">{student.notes.substring(0, 50)}{student.notes.length > 50 ? '...' : ''}</span>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-2 flex gap-2">
                {onView && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onView(student.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </Button>
                )}
                {onEdit && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onEdit(student.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
