'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, Trash2, Eye, EyeOff, MoreHorizontal, Users, CheckCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  lastLoginAt: string | null
  emailVerified: boolean
  phone: string | null
  address: string | null
  avatar: string | null
}

interface UserTableViewProps {
  users: User[]
  loading: boolean
  onStatusToggle: (user: User) => void
  onDelete: (user: User) => void
  getRoleBadge: (role: string) => React.ReactNode
  getStatusBadge: (status: string) => React.ReactNode
}

export function UserTableView({ 
  users, 
  loading, 
  onStatusToggle, 
  onDelete, 
  getRoleBadge, 
  getStatusBadge 
}: UserTableViewProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-48 animate-pulse"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 bg-muted rounded w-8 animate-pulse ml-auto"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Tidak ada data user
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Mulai tambahkan user untuk melihat data di sini.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/users/create">
                        <Users className="w-4 h-4 mr-2" />
                        Tambah User
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name || ""} />
                        ) : (
                          <AvatarFallback>
                            {user.name?.charAt(0) || user.email.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name || "No name"}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.emailVerified && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString('id-ID')
                      : "Never"
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/users/${user.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusToggle(user)}
                        >
                          {user.status === 'ACTIVE' ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(user)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
