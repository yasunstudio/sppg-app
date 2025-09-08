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
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, MoreHorizontal, Package } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface InventoryTableViewProps {
  data: any[]
  isLoading: boolean
  onRefetch: () => void
  getStatusBadge: (status: string) => React.ReactNode
  onDelete: (id: string, name: string) => void
}

export function InventoryTableView({ 
  data, 
  isLoading, 
  onRefetch, 
  getStatusBadge, 
  onDelete 
}: InventoryTableViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Package className="w-5 h-5 mr-2 text-primary" />
            Data Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-foreground">Bahan Baku</TableHead>
                  <TableHead className="text-foreground">Kategori</TableHead>
                  <TableHead className="text-foreground">Supplier</TableHead>
                  <TableHead className="text-foreground">Quantity</TableHead>
                  <TableHead className="text-foreground">Harga Unit</TableHead>
                  <TableHead className="text-foreground">Total Harga</TableHead>
                  <TableHead className="text-foreground">Batch</TableHead>
                  <TableHead className="text-foreground">Kadaluarsa</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 bg-muted rounded w-8 animate-pulse"></div>
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

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Package className="w-5 h-5 mr-2 text-primary" />
          Data Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-foreground">Bahan Baku</TableHead>
                <TableHead className="text-foreground">Kategori</TableHead>
                <TableHead className="text-foreground">Supplier</TableHead>
                <TableHead className="text-foreground">Quantity</TableHead>
                <TableHead className="text-foreground">Harga Unit</TableHead>
                <TableHead className="text-foreground">Total Harga</TableHead>
                <TableHead className="text-foreground">Batch</TableHead>
                <TableHead className="text-foreground">Kadaluarsa</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow className="border-border hover:bg-muted/50">
                  <TableCell colSpan={10} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Package className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Tidak ada data inventory
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Mulai tambahkan item inventory untuk melihat data di sini.
                      </p>
                      <Button asChild>
                        <Link href="/dashboard/inventory/add">
                          <Package className="w-4 h-4 mr-2" />
                          Tambah Item
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id} className="border-border hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{item.rawMaterial?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.rawMaterial?.unit || 'N/A'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border bg-muted/30 text-foreground">
                        {item.rawMaterial?.category || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{item.supplier?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.supplier?.contactName || 'N/A'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{item.quantity}</p>
                        <p className="text-sm text-muted-foreground">
                          Min: {item.minimumStock}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {formatCurrency(item.purchasePrice)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {formatCurrency(item.purchasePrice * item.quantity)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono text-sm text-foreground">
                        {item.batchNumber}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">
                        {formatDate(item.expiryDate)}
                      </p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border-border">
                          <DropdownMenuItem asChild>
                            <Link 
                              href={`/dashboard/inventory/${item.id}`}
                              className="flex items-center text-foreground hover:bg-muted cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link 
                              href={`/dashboard/inventory/${item.id}/edit`}
                              className="flex items-center text-foreground hover:bg-muted cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete(item.id, item.rawMaterial?.name || 'Item')}
                            className="flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
