'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Edit, Trash2, Eye, MoreHorizontal, Users, Factory, Calendar, ArrowRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getMealTypeLabel } from '@/lib/constants/meal-types'
import Link from 'next/link'

interface MenuListProps {
  menus: any[]
  isLoading: boolean
  onRefetch: () => void
  getMealTypeColor: (mealType: string) => string
}

export function MenuList({ 
  menus, 
  isLoading, 
  onRefetch, 
  getMealTypeColor
}: MenuListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProductionStatus = (menu: any) => {
    if (!menu.productionPlans || menu.productionPlans.length === 0) {
      return { status: 'NO_PRODUCTION', label: 'Belum Diproduksi', color: 'bg-gray-100 text-gray-800' }
    }

    const latestPlan = menu.productionPlans[0] // Already sorted by planDate desc
    switch (latestPlan.status) {
      case 'PLANNED':
        return { status: 'PLANNED', label: 'Dijadwalkan', color: 'bg-blue-100 text-blue-800' }
      case 'IN_PROGRESS':
        return { status: 'IN_PROGRESS', label: 'Sedang Produksi', color: 'bg-yellow-100 text-yellow-800' }
      case 'COMPLETED':
        return { status: 'COMPLETED', label: 'Selesai Produksi', color: 'bg-green-100 text-green-800' }
      case 'CANCELLED':
        return { status: 'CANCELLED', label: 'Dibatalkan', color: 'bg-red-100 text-red-800' }
      default:
        return { status: 'UNKNOWN', label: 'Status Tidak Diketahui', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const getMealTypeLabelFromConstants = getMealTypeLabel

  const getStatusLabel = (status: string) => {
    const labels = {
      DRAFT: 'Draft',
      APPROVED: 'Disetujui',
      PUBLISHED: 'Dipublikasi',
      ARCHIVED: 'Diarsipkan'
    }
    return labels[status as keyof typeof labels] || status
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Menu ({menus.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Menu</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Porsi</TableHead>
                <TableHead>Kalori</TableHead>
                <TableHead>Protein</TableHead>
                <TableHead>Status Menu</TableHead>
                <TableHead>Status Produksi</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menus.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Belum ada menu. Buat menu pertama Anda!
                  </TableCell>
                </TableRow>
              ) : (
                menus.map((menu) => {
                  const productionStatus = getProductionStatus(menu)
                  return (
                    <TableRow key={menu.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{menu.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {menu.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getMealTypeColor(menu.mealType)}>
                          {getMealTypeLabelFromConstants(menu.mealType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                          {menu.menuItems?.length || 0} items
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{menu.totalCalories || 0}</span>
                        <span className="text-sm text-muted-foreground ml-1">kcal</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{menu.totalProtein || 0}</span>
                        <span className="text-sm text-muted-foreground ml-1">g</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={menu.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {menu.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={productionStatus.color}>
                            {productionStatus.label}
                          </Badge>
                          {menu.productionPlans && menu.productionPlans.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formatDate(menu.productionPlans[0].planDate)}
                              </span>
                            </div>
                          )}
                          {productionStatus.status === 'NO_PRODUCTION' && (
                            <Link href={`/dashboard/production-plans/create?menuId=${menu.id}`}>
                              <Button size="sm" variant="outline" className="h-6 text-xs">
                                <Factory className="w-3 h-3 mr-1" />
                                Buat Produksi
                              </Button>
                            </Link>
                          )}
                          {productionStatus.status !== 'NO_PRODUCTION' && (
                            <Link href={`/dashboard/production-plans`}>
                              <Button size="sm" variant="ghost" className="h-6 text-xs">
                                <ArrowRight className="w-3 h-3 mr-1" />
                                Lihat Produksi
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{formatDate(menu.createdAt)}</p>
                          {menu.approvedBy && (
                            <p className="text-xs text-muted-foreground">
                              Approved by {menu.approvedBy}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Menu
                            </DropdownMenuItem>
                            {menu.isActive && (
                              <DropdownMenuItem>
                                <Users className="w-4 h-4 mr-2" />
                                Nonaktifkan Menu
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
