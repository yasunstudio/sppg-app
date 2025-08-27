import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, Truck, MapPin, Package } from 'lucide-react'

interface Distribution {
  id: string
  distributionDate: string
  status: 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED'
  totalPortions: number
  notes?: string
  estimatedDuration?: number
  actualDuration?: number
  schools: Array<{
    id: string
    schoolId: string
    plannedPortions: number
    actualPortions?: number
    routeOrder: number
    school: {
      id: string
      name: string
      address: string
    }
  }>
}

interface DistributionsListProps {
  selectedSchool?: string | null
}

const statusLabels = {
  PREPARING: 'Persiapan',
  IN_TRANSIT: 'Dalam Perjalanan',
  DELIVERED: 'Terkirim',
  COMPLETED: 'Selesai'
}

const statusColors = {
  PREPARING: 'bg-yellow-100 text-yellow-800',
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800'
}

export function DistributionsList({ selectedSchool }: DistributionsListProps) {
  const { data: distributionsResponse, isLoading } = useQuery({
    queryKey: ['distributions', selectedSchool],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedSchool) params.append('schoolId', selectedSchool)
      
      const response = await fetch(`/api/distributions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch distributions')
      return response.json()
    }
  })

  const distributions: Distribution[] = distributionsResponse?.data || []

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Memuat data distribusi...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!distributions || distributions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Belum Ada Distribusi</h3>
            <p className="text-muted-foreground">
              {selectedSchool 
                ? 'Belum ada distribusi untuk sekolah yang dipilih'
                : 'Belum ada data distribusi makanan'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daftar Distribusi ({distributions.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal Distribusi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Porsi</TableHead>
                  <TableHead>Jumlah Sekolah</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributions.map((distribution) => (
                  <TableRow key={distribution.id}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {new Date(distribution.distributionDate).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[distribution.status]}>
                        {statusLabels[distribution.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                        {distribution.totalPortions.toLocaleString()} porsi
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        {distribution.schools.length} sekolah
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Truck className="w-4 h-4 mr-2 text-muted-foreground" />
                        {distribution.actualDuration 
                          ? `${distribution.actualDuration} menit`
                          : distribution.estimatedDuration 
                            ? `~${distribution.estimatedDuration} menit`
                            : '-'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {distribution.notes || '-'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Schools Details */}
      {selectedSchool && distributions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detail Distribusi ke Sekolah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {distributions.map((distribution) => (
                <div key={distribution.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">
                    Distribusi {new Date(distribution.distributionDate).toLocaleDateString('id-ID')}
                  </h4>
                  <div className="space-y-2">
                    {distribution.schools.map((school) => (
                      <div key={school.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <div>
                          <p className="font-medium">{school.school.name}</p>
                          <p className="text-sm text-muted-foreground">Urutan: {school.routeOrder}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {school.actualPortions || school.plannedPortions} porsi
                          </p>
                          {school.actualPortions && school.actualPortions !== school.plannedPortions && (
                            <p className="text-xs text-muted-foreground">
                              (Rencana: {school.plannedPortions})
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
