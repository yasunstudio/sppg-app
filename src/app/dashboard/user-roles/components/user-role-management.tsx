'use client';

import { useState } from 'react';
import { useUserRoles } from './hooks/use-user-roles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter, Users, Shield, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';
import { formatUserRoleStatus, formatDate } from './utils/user-role-formatters';
import type { UserRoleFilters } from './utils/user-role-types';

export function UserRoleManagement() {
  const [filters, setFilters] = useState<UserRoleFilters>({
    searchTerm: '',
    selectedStatus: 'all',
    selectedRole: 'all',
    currentPage: 1,
    itemsPerPage: 10,
  });

  const { userRoles, stats, loading, error, pagination, refreshUserRoles } = useUserRoles({ filters });

  const handleFilterChange = (key: keyof UserRoleFilters, value: any) => {
    setFilters((prev: UserRoleFilters) => ({ ...prev, [key]: value, currentPage: 1 }));
  };

  const handleSearch = (search: string) => {
    handleFilterChange('searchTerm', search);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Error Memuat Role Pengguna</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => refreshUserRoles()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Role Pengguna</h1>
          <p className="text-muted-foreground">Kelola penugasan role dan izin akses pengguna sistem</p>
        </div>
        <Link href="/dashboard/user-roles/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tugaskan Role
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penugasan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Penugasan role dalam sistem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role Aktif</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats?.active || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Penugasan yang sedang aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role Tidak Aktif</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats?.inactive || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Penugasan tidak aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Role</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats?.rolesCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Role tersedia
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter
          </CardTitle>
          <CardDescription>Filter dan cari penugasan role pengguna</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pencarian</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pengguna atau role..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={filters.selectedRole || 'all'}
                onValueChange={(value) => handleFilterChange('selectedRole', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="nutritionist">Ahli Gizi</SelectItem>
                  <SelectItem value="chef">Chef</SelectItem>
                  <SelectItem value="school-admin">Admin Sekolah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Penugasan Role Pengguna</CardTitle>
          <CardDescription>
            Menampilkan {pagination?.totalCount || 0} penugasan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Tanggal Ditugaskan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRoles?.map((userRole) => (
                  <TableRow key={userRole.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {userRole.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{userRole.user?.name || 'Tidak diketahui'}</div>
                          <div className="text-sm text-muted-foreground">{userRole.user?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{userRole.role?.name || 'Role Tidak Diketahui'}</div>
                        {userRole.role?.description && (
                          <div className="text-sm text-muted-foreground">{userRole.role.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(userRole.assignedAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/dashboard/user-roles/${userRole.id}`}>
                          <Button variant="outline" size="sm">
                            Lihat
                          </Button>
                        </Link>
                        <Link href={`/dashboard/user-roles/${userRole.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} sampai{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} dari{' '}
            {pagination.totalCount} entri
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('currentPage', pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('currentPage', pagination.currentPage + 1)}
              disabled={!pagination.hasMore}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
