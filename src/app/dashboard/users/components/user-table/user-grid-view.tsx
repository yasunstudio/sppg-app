'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, Trash2, Eye, MoreHorizontal, Users, CheckCircle, Calendar, Clock } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, getInitials, getStatusColor, getRoleColor } from '../utils/user-formatters'
import type { User } from '../utils/user-types'

interface UserGridViewProps {
  users: User[]
  loading?: boolean
  onView?: (userId: string) => void
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
}

export function UserGridView({ 
  users, 
  loading = false, 
  onView,
  onEdit,
  onDelete
}: UserGridViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Tidak ada pengguna ditemukan
          </h3>
          <p className="text-sm text-muted-foreground">
            Coba ubah filter pencarian Anda atau tambah pengguna baru.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getUserRole = (user: User) => {
    if (user.roles && user.roles.length > 0) {
      return user.roles[0].role.name
    }
    return 'No Role'
  }

  const getUserStatus = (user: User) => {
    return user.isActive ? 'active' : 'inactive'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || ''} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{user.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(user.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(user.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(user.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Peran:</span>
                <Badge variant="outline" className={getRoleColor(getUserRole(user))}>
                  {getUserRole(user)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Badge variant="outline" className={getStatusColor(user.isActive)}>
                  {user.isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>

              {user.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Telepon:</span>
                  <span className="text-xs">{user.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Terdaftar:</span>
                <span className="text-xs">{formatDate(user.createdAt)}</span>
              </div>

              {user.emailVerified && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span className="text-xs">Email Terverifikasi</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
