'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, Trash2, Eye, EyeOff, MoreHorizontal, Users, CheckCircle, Calendar, Clock } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

interface UserGridViewProps {
  users: User[]
  loading: boolean
  onStatusToggle: (user: User) => void
  onDelete: (user: User) => void
  getRoleBadge: (role: string) => React.ReactNode
  getStatusBadge: (status: string) => React.ReactNode
}

export function UserGridView({ 
  users, 
  loading, 
  onStatusToggle, 
  onDelete, 
  getRoleBadge, 
  getStatusBadge 
}: UserGridViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-6 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
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
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Avatar>
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name || ""} />
                    ) : (
                      <AvatarFallback>
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {user.name || 'No name'}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                    {user.emailVerified && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link 
                        href={`/dashboard/users/${user.id}/edit`}
                        className="flex items-center text-foreground hover:bg-muted cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusToggle(user)}
                      className="flex items-center text-foreground hover:bg-muted cursor-pointer"
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
                      className="flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Role and Status */}
              <div className="flex items-center justify-between">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>

              {/* Contact Info */}
              {(user.phone || user.address) && (
                <div className="space-y-1 pt-2 border-t border-border">
                  {user.phone && (
                    <div className="text-xs text-muted-foreground">
                      📞 {user.phone}
                    </div>
                  )}
                  {user.address && (
                    <div className="text-xs text-muted-foreground truncate">
                      📍 {user.address}
                    </div>
                  )}
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Last Login
                  </span>
                  <span className="font-medium text-foreground">
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString('id-ID')
                      : "Never"
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Created
                  </span>
                  <span className="font-medium text-foreground">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
