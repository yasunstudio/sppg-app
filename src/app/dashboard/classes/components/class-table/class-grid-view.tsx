'use client'

import { MoreVertical, Eye, Edit, Trash2, Users, GraduationCap, School } from 'lucide-react'
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
import type { Class } from '../utils/class-types'

interface ClassGridViewProps {
  classes: Class[]
  loading?: boolean
  onView?: (classId: string) => void
  onEdit?: (classId: string) => void
  onDelete?: (classId: string) => void
}

export function ClassGridView({
  classes,
  loading,
  onView,
  onEdit,
  onDelete
}: ClassGridViewProps) {
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

  const LoadingSkeleton = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-4 w-20" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (classes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Tidak ada data kelas ditemukan
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <Card key={classItem.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {classItem.name}
              </CardTitle>
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
            </div>
            <Badge className={getGradeBadgeColor(classItem.grade)} variant="secondary">
              Kelas {classItem.grade}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <School className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{classItem.school?.name}</span>
              </div>
              
              {classItem.teacherName && (
                <div className="flex items-center space-x-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{classItem.teacherName}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Kapasitas: {classItem.capacity} siswa</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onView?.(classItem.id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Detail
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onEdit?.(classItem.id)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>

            {classItem.notes && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                {classItem.notes}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
