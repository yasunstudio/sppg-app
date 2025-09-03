import { useRouter } from 'next/navigation'
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
import { usePermission } from '@/components/guards/permission-guard'
import type { WasteRecord } from '../utils/waste-types'
import { getWasteTypeColor, getSourceColor, formatWasteType, formatSource, formatDateShort } from '../utils/waste-formatters'

interface WasteTableViewProps {
  wasteRecords: WasteRecord[]
  isFiltering: boolean
}

export function WasteTableView({ wasteRecords, isFiltering }: WasteTableViewProps) {
  const router = useRouter()
  
  // Permission checks
  const canViewWaste = usePermission('waste.view')
  const canEditWaste = usePermission('waste.edit')
  const canDeleteWaste = usePermission('waste.delete')
  const canCreateWaste = usePermission('waste.create')

  return (
    <div className={`rounded-md border transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Sumber</TableHead>
            <TableHead>Berat</TableHead>
            <TableHead className="hidden lg:table-cell">Sekolah</TableHead>
            <TableHead className="hidden xl:table-cell">Catatan</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wasteRecords.length > 0 ? (
            wasteRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm sm:text-base">{formatDateShort(record.recordDate)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getWasteTypeColor(record.wasteType)}>
                    {formatWasteType(record.wasteType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getSourceColor(record.source)}>
                    {formatSource(record.source)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{record.weight} kg</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {record.school && (
                    <div className="flex items-center space-x-2 max-w-xs">
                      <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{record.school.name}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {record.notes && (
                    <span className="text-sm text-muted-foreground max-w-xs block truncate">
                      {record.notes}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canViewWaste && (
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/waste-management/${record.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                      )}
                      {canEditWaste && (
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/waste-management/${record.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Catatan
                        </DropdownMenuItem>
                      )}
                      {canDeleteWaste && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {/* TODO: Delete functionality */}}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Catatan
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <Trash2 className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Tidak ada catatan limbah ditemukan</p>
                  {canCreateWaste && (
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard/waste-management/create')}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Catatan Pertama
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
