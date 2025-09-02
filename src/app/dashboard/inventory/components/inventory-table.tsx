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
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface InventoryTableProps {
  data: any[]
  isLoading: boolean
  onRefetch: () => void
  getStatusBadge: (status: string) => React.ReactNode
}

export function InventoryTable({ data, isLoading, onRefetch, getStatusBadge }: InventoryTableProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete inventory item')
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success('Item inventory berhasil dihapus!')
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      onRefetch()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus item inventory')
    }
  })

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus item "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }
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
          <CardTitle className="text-foreground">Loading...</CardTitle>
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
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Inventory Items ({data.length})</CardTitle>
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
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    Tidak ada data inventory.
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
                          {item.rawMaterial?.unit || 'unit'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(item.unitPrice || 0)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(item.totalPrice || 0)}
                    </TableCell>
                    <TableCell>
                      {item.batchNumber ? (
                        <code className="text-sm bg-muted px-1 rounded text-foreground">
                          {item.batchNumber}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.expiryDate ? (
                        <div>
                          <p className="text-foreground">{formatDate(item.expiryDate)}</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} hari
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-muted">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border-border">
                          <DropdownMenuItem asChild className="text-foreground hover:bg-muted focus:bg-muted">
                            <Link href={`/dashboard/inventory/${item.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-foreground hover:bg-muted focus:bg-muted">
                            <Link href={`/dashboard/inventory/${item.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 dark:text-red-400 hover:bg-muted focus:bg-muted"
                            onClick={() => handleDelete(item.id, item.rawMaterial?.name || 'Item')}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
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
