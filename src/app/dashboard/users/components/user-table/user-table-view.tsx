'use client'

import { MoreVertical, Eye, Edit, Trash2, SortAsc, SortDesc, Shield, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { formatDate, formatUserStatus, formatUserRole, getInitials, getStatusColor, getRoleColor } from '../utils/user-formatters'
import type { User } from '../utils/user-types'
import { useState } from 'react'

interface UserTableViewProps {
  users: User[]
  loading?: boolean
  onView?: (userId: string) => void
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
}

type SortColumn = 'name' | 'email' | 'isActive' | 'emailVerified' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export function UserTableView({
  users,
  loading,
  onView,
  onEdit,
  onDelete,
  onSort
}: UserTableViewProps) {
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bergabung</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => <LoadingSkeleton key={i} />)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada pengguna
            </h3>
            <p className="text-gray-500">
              Belum ada pengguna yang terdaftar dalam sistem.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pengguna ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortButton column="name">Pengguna</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="email">Email</SortButton>
                </TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  <SortButton column="isActive">Status</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="createdAt">Bergabung</SortButton>
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        {user.username && (
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                      {user.emailVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Terverifikasi
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.slice(0, 2).map((userRole) => (
                          <Badge 
                            key={userRole.id} 
                            variant="outline" 
                            className={`text-xs ${getRoleColor(userRole.role.name)}`}
                          >
                            {userRole.role.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Belum ada role</span>
                      )}
                      {user.roles && user.roles.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.roles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.isActive ? "default" : "secondary"}
                      className={getStatusColor(user.isActive)}
                    >
                      {formatUserStatus(user.isActive)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(user.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(user.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(user.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete?.(user.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
