"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
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
  Calendar, 
  Shield, 
  UserIcon, 
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

interface UserRoleGridViewProps {
  userRoles: UserRole[]
  isFiltering: boolean
}

export function UserRoleGridView({ userRoles, isFiltering }: UserRoleGridViewProps) {
  const router = useRouter()

  if (userRoles.length === 0) {
    return (
      <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
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
      <div className="space-y-4">
        {userRoles.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={assignment.user.avatar} alt={assignment.user.name} />
                    <AvatarFallback>
                      {getInitials(assignment.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{assignment.user.name}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.user.email}</p>
                  </div>
                </div>
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
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getRoleColor(assignment.role.name)}>
                    <Shield className="mr-1 h-3 w-3" />
                    {formatRoleName(assignment.role.name)}
                  </Badge>
                  <Badge className={getStatusColor(assignment.isActive)}>
                    {formatUserRoleStatus(assignment.isActive)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Ditugaskan:</span>
                  </div>
                  <div className="text-right">
                    {formatDate(assignment.assignedAt)}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    <span>Oleh:</span>
                  </div>
                  <div className="text-right">
                    {assignment.assignedByUser?.name || 'System'}
                  </div>
                </div>

                {assignment.role.description && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {assignment.role.description}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
