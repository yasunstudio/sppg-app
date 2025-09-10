"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Calendar, 
  Weight, 
  Building, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Plus
} from 'lucide-react'
import type { WasteRecord } from '../utils'
import { getWasteTypeColor, getSourceColor, formatWasteType, formatSource, formatDate } from '../utils'

interface WasteGridViewProps {
  wasteRecords: WasteRecord[]
  isFiltering: boolean
}

export function WasteGridView({ wasteRecords, isFiltering }: WasteGridViewProps) {
  const router = useRouter()

  if (wasteRecords.length === 0) {
    return (
      <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Tidak ada catatan limbah ditemukan</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/waste-records/create')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Catatan Pertama
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
      <div className="space-y-4">
        {wasteRecords.map((wasteRecord) => (
          <Card key={wasteRecord.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-2">
                  <Badge className={getWasteTypeColor(wasteRecord.wasteType)}>
                    {formatWasteType(wasteRecord.wasteType)}
                  </Badge>
                  <Badge className={getSourceColor(wasteRecord.source)}>
                    {formatSource(wasteRecord.source)}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/waste-records/${wasteRecord.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/waste-records/${wasteRecord.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Catatan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {/* TODO: Delete functionality */}}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Catatan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatDate(wasteRecord.recordDate)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{wasteRecord.weight} kg</span>
                </div>
                
                {wasteRecord.school && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      {wasteRecord.school.name}
                    </span>
                  </div>
                )}
                
                {wasteRecord.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {wasteRecord.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
