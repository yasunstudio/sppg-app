"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, UserCheck, UserX, Shield, TrendingUp } from 'lucide-react'
import type { UserRoleStats } from '../utils/user-role-types'

interface UserRoleStatsCardsProps {
  stats: UserRoleStats | null
  showStats: boolean
  onToggleStats: () => void
}

export function UserRoleStatsCards({ stats, showStats, onToggleStats }: UserRoleStatsCardsProps) {
  if (!stats) return null

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleStats}
        >
          {showStats ? 'Sembunyikan' : 'Tampilkan'} Statistik
        </Button>
      </div>

      {showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penugasan</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Penugasan role pengguna
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Penugasan Aktif</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Role yang sedang aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tidak Aktif</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                Role yang tidak aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Role</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rolesCount}</div>
              <p className="text-xs text-muted-foreground">
                Role yang tersedia
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
