'use client'

import { MoreVertical, Eye, Edit, Trash2, Users, Phone, MapPin } from 'lucide-react'
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
import { formatPhoneNumber, formatStudentCount, truncateText } from '../utils/school-formatters'
import type { School } from '../utils/school-types'
import { useRouter } from 'next/navigation'
import { usePermission } from '@/hooks/use-role-permissions'

interface SchoolTableViewProps {
  schools: School[]
  loading?: boolean
  isFiltering?: boolean
  onDeleteSchool?: (schoolId: string) => Promise<boolean>
}

export function SchoolTableView({
  schools,
  loading,
  isFiltering,
  onDeleteSchool
}: SchoolTableViewProps) {
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
    if (canDeleteSchool && onDeleteSchool) {
      if (confirm('Apakah Anda yakin ingin menghapus sekolah ini?')) {
        await onDeleteSchool(schoolId)
      }
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Sekolah</TableHead>
              <TableHead>Kepala Sekolah</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Siswa</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
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
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Sekolah</TableHead>
            <TableHead>Kepala Sekolah</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Siswa</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map((school) => (
            <TableRow key={school.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{school.name}</div>
                  {school._count && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {school._count.classes} kelas
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="font-medium">{school.principalName}</div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {formatPhoneNumber(school.principalPhone)}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="max-w-xs">
                  <div className="flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{truncateText(school.address, 60)}</span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {formatStudentCount(school.totalStudents)}
                </Badge>
              </TableCell>
              
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
