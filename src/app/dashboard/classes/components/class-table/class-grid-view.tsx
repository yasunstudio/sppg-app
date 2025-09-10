'use client'

import { MoreVertical, Eye, Edit, Trash2, Users, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

interface ClassGridViewProps {
  className?: string
}

export function ClassGridView({ className }: ClassGridViewProps) {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (classes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <div className="flex flex-col items-center gap-2">
            <GraduationCap className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Tidak ada data kelas</h3>
            <p className="text-muted-foreground">Belum ada kelas yang terdaftar</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => {
        const status = formatClassStatus(classItem.currentCount, classItem.capacity)
        const fillPercentage = (classItem.currentCount / classItem.capacity) * 100
        
        return (
          <Card key={classItem.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatGradeLevel(classItem.grade)}
                  </p>
                </div>
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
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Kapasitas</span>
                  <span className="font-medium">
                    {formatCapacity(classItem.currentCount, classItem.capacity)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{formatTeacherName(classItem.teacherName)}</span>
                </div>
                <Badge variant={status === 'full' ? 'destructive' : status === 'active' ? 'default' : 'secondary'}>
                  {formatClassStatusText(status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
