'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Eye, Trash2, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Role } from '../utils/role-types'
import { formatRoleName, formatPermissionCount, formatUserCount, formatDate, formatRoleType, getRoleBadgeVariant } from '../utils/role-formatters'

interface RoleTableViewProps {
  roles: Role[]
  loading?: boolean
  onRefresh?: () => void
}

export function RoleTableView({ roles, loading, onRefresh }: RoleTableViewProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleView = (id: string) => {
    router.push(`/dashboard/roles/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/roles/${id}/edit`)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus role "${name}"?`)) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menghapus role')
      }

      toast.success('Role berhasil dihapus')
      onRefresh?.()
    } catch (error) {
      console.error('Error deleting role:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus role')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-300">Role</TableHead>
              <TableHead className="dark:text-gray-300">Tipe</TableHead>
              <TableHead className="dark:text-gray-300">Permissions</TableHead>
              <TableHead className="dark:text-gray-300">Pengguna</TableHead>
              <TableHead className="dark:text-gray-300">Dibuat</TableHead>
              <TableHead className="dark:text-gray-300">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="dark:border-gray-700">
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded dark:bg-gray-600" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded dark:bg-gray-600" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded dark:bg-gray-600" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded dark:bg-gray-600" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded dark:bg-gray-600" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded dark:bg-gray-600" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="rounded-md border border-dashed dark:border-gray-700 p-8 text-center">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground dark:text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold dark:text-gray-200">Tidak ada role</h3>
        <p className="mt-2 text-sm text-muted-foreground dark:text-gray-400">
          Belum ada role yang dibuat dalam sistem.
        </p>
        <Button
          onClick={() => router.push('/dashboard/roles/create')}
          className="mt-4"
        >
          Buat Role Pertama
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border dark:border-gray-700 dark:bg-gray-800/50">
      <Table>
        <TableHeader>
          <TableRow className="dark:border-gray-700">
            <TableHead className="dark:text-gray-300">Role</TableHead>
            <TableHead className="dark:text-gray-300">Tipe</TableHead>
            <TableHead className="dark:text-gray-300">Permissions</TableHead>
            <TableHead className="dark:text-gray-300">Pengguna</TableHead>
            <TableHead className="dark:text-gray-300">Dibuat</TableHead>
            <TableHead className="dark:text-gray-300 w-[70px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id} className="dark:border-gray-700">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium dark:text-gray-100">
                    {formatRoleName(role.name)}
                  </div>
                  {role.description && (
                    <div className="text-sm text-muted-foreground dark:text-gray-400 max-w-[200px] truncate">
                      {role.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(role)} className="dark:border-gray-600">
                  {formatRoleType(role)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm dark:text-gray-200">
                  {formatPermissionCount(role.permissionCount)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm dark:text-gray-200">
                  <Users className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  {formatUserCount(role.userCount)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground dark:text-gray-400">
                  {formatDate(role.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0 dark:hover:bg-gray-700"
                      disabled={deletingId === role.id}
                    >
                      <span className="sr-only">Buka menu</span>
                      <MoreHorizontal className="h-4 w-4 dark:text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                    <DropdownMenuLabel className="dark:text-gray-200">Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:border-gray-600" />
                    <DropdownMenuItem 
                      onClick={() => handleView(role.id)}
                      className="dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleEdit(role.id)}
                      className="dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:border-gray-600" />
                    <DropdownMenuItem 
                      onClick={() => handleDelete(role.id, role.name)}
                      className="text-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                      disabled={deletingId === role.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingId === role.id ? 'Menghapus...' : 'Hapus'}
                    </DropdownMenuItem>
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
