"use client"

import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Shield, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Plus
} from 'lucide-react'
import type { UserRole } from '../utils/user-role-types'
import { 
  formatRoleName, 
  formatUserRoleStatus, 
  getRoleColor, 
  getStatusColor, 
  formatDate, 
  getInitials 
} from '../utils/user-role-formatters'

interface UserRoleTableViewProps {
  userRoles: UserRole[]
  isFiltering: boolean
}

export function UserRoleTableView({ userRoles, isFiltering }: UserRoleTableViewProps) {
  const router = useRouter()

  if (userRoles.length === 0) {
    return (
      <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Tidak ada penugasan role ditemukan</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/user-roles/assign')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tugaskan Role Pertama
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Pengguna</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ditugaskan</TableHead>
              <TableHead>Oleh</TableHead>
              <TableHead className="w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userRoles.map((assignment) => (
              <TableRow key={assignment.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={assignment.user.avatar || undefined} alt={assignment.user.name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(assignment.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{assignment.user.name}</p>
                      <p className="text-sm text-muted-foreground">{assignment.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge className={getRoleColor(assignment.role.name)}>
                      <Shield className="mr-1 h-3 w-3" />
                      {formatRoleName(assignment.role.name)}
                    </Badge>
                    {assignment.role.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {assignment.role.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Aktif
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(assignment.assignedAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    System
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/user-roles/${assignment.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/user-roles/${assignment.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Penugasan
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Penugasan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
