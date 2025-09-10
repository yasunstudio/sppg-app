'use client'

import { MoreVertical, Eye, Edit, Trash2, Users, Phone, MapPin, Building } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { formatPhoneNumber, formatStudentCount, truncateText, getSchoolInitials } from '../utils/school-formatters'
import type { School } from '../utils/school-types'
import { useRouter } from 'next/navigation'
import { usePermission } from '@/hooks/use-role-permissions'

interface SchoolGridViewProps {
  schools: School[]
  loading?: boolean
  isFiltering?: boolean
  onDelete?: (schoolId: string) => Promise<boolean>
}

export function SchoolGridView({
  schools,
  loading,
  isFiltering,
  onDelete
}: SchoolGridViewProps) {
  const router = useRouter()

  // Permissions
  const canViewSchool = usePermission('schools.view')
  const canEditSchool = usePermission('schools.edit')
  const canDeleteSchool = usePermission('schools.delete')

  const handleView = (schoolId: string) => {
    if (canViewSchool) {
      router.push(`/schools/${schoolId}`)
    }
  }

  const handleEdit = (schoolId: string) => {
    if (canEditSchool) {
      router.push(`/schools/${schoolId}/edit`)
    }
  }

  const handleDelete = async (schoolId: string) => {
    if (canDeleteSchool && onDelete) {
      if (confirm('Apakah Anda yakin ingin menghapus sekolah ini?')) {
        await onDelete(schoolId)
      }
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
                <div className="h-6 w-20 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Building className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {isFiltering ? 'Tidak ada hasil' : 'Belum ada data sekolah'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isFiltering 
            ? 'Coba ubah filter atau kata kunci pencarian' 
            : 'Mulai dengan menambahkan sekolah pertama'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {schools.map((school) => (
        <Card key={school.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="font-semibold truncate">{school.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {school.principalName}
                </p>
              </div>
              
              {/* School Avatar */}
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0 ml-3">
                {getSchoolInitials(school.name)}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-3">
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{formatPhoneNumber(school.principalPhone)}</span>
              </div>
              
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{truncateText(school.address, 50)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {formatStudentCount(school.totalStudents)}
              </Badge>
              
              {school._count && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {school._count.classes} kelas
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex gap-2">
                {canViewSchool && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(school.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat
                  </Button>
                )}
                
                {canEditSchool && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(school.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {/* More Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canViewSchool && (
                    <DropdownMenuItem onClick={() => handleView(school.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                  )}
                  {canEditSchool && (
                    <DropdownMenuItem onClick={() => handleEdit(school.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {canDeleteSchool && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(school.id)}
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
