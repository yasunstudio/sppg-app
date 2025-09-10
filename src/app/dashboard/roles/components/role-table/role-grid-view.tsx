'use client'

import { MoreVertical, Eye, Edit, Trash2, Shield, Users, Key } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { formatDate, formatRoleType, formatPermissionCount, getRoleBadgeVariant } from '../utils/role-formatters'
import type { Role } from '../utils/role-types'

interface RoleGridViewProps {
  roles: Role[]
  loading?: boolean
  onView?: (roleId: string) => void
  onEdit?: (roleId: string) => void
  onDelete?: (roleId: string) => void
}

export function RoleGridView({
  roles,
  loading,
  onView,
  onEdit,
  onDelete
}: RoleGridViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded dark:bg-gray-600" />
                  <div className="h-3 w-16 bg-muted rounded dark:bg-gray-600" />
                </div>
                <div className="h-6 w-16 bg-muted rounded-full dark:bg-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted rounded dark:bg-gray-600" />
                <div className="h-3 w-3/4 bg-muted rounded dark:bg-gray-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4 dark:bg-gray-700">
          <Shield className="w-12 h-12 text-muted-foreground dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2 dark:text-gray-300">
          Belum ada role
        </h3>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          Data role akan ditampilkan di sini
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role) => (
        <Card key={role.id} className="hover:shadow-md transition-shadow dark:bg-gray-800/50 dark:border-gray-700 dark:hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg dark:text-gray-100">{role.name}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">{formatRoleType(role)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(role)} className="dark:border-gray-600">
                  {formatRoleType(role)}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 dark:hover:bg-gray-700">
                      <MoreVertical className="h-4 w-4 dark:text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                    {onView && (
                      <DropdownMenuItem 
                        onClick={() => onView(role.id)}
                        className="dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem 
                        onClick={() => onEdit(role.id)}
                        className="dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Role
                      </DropdownMenuItem>
                    )}
                    {(onView || onEdit) && onDelete && (
                      <DropdownMenuSeparator className="dark:border-gray-600" />
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(role.id)}
                        className="text-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Description */}
            {role.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 dark:text-gray-400">
                {role.description}
              </p>
            )}
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground dark:text-gray-400">
                <Key className="h-4 w-4" />
                <span>{formatPermissionCount(role.permissionCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>{role.userCount} pengguna</span>
              </div>
            </div>
            
            {/* Permissions Preview */}
            {role.permissions && role.permissions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground dark:text-gray-400">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                      {permission.replace('manage_', '').replace('_', ' ')}
                    </Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                      +{role.permissions.length - 3} lainnya
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Created Date */}
            <div className="pt-2 border-t text-xs text-muted-foreground dark:border-gray-600 dark:text-gray-400">
              Dibuat: {formatDate(role.createdAt)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
