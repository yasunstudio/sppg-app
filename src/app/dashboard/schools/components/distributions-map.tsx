'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import L from 'leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, Truck, MapPin, Package, List, Map } from 'lucide-react'
import { RoutePolyline } from '@/components/map/route-polyline'
import { SchoolMarker } from '@/components/map/school-marker'

// Dynamic import untuk komponen Map agar tidak error saat SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

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
      latitude?: number
      longitude?: number
    }
  }>
}

interface DistributionsMapProps {
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

// Koordinat default untuk Jakarta
const defaultCenter: [number, number] = [-6.2088, 106.8456]

export function DistributionsMap({ selectedSchool }: DistributionsMapProps) {
  const [selectedDistribution, setSelectedDistribution] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

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

  useEffect(() => {
    setMapLoaded(true)
  }, [])

  // Ambil koordinat dari database atau gunakan default
  const getSchoolCoordinates = (school: any): [number, number] => {
    if (school.latitude && school.longitude) {
      return [school.latitude, school.longitude]
    }
    
    // Fallback ke koordinat manual jika tidak ada di database
    const coordinates: { [key: string]: [number, number] } = {
      'SDN 01 Menteng': [-6.1944, 106.8294],
      'SDN 05 Kebayoran': [-6.2297, 106.7890],
      'SDN 12 Cempaka Putih': [-6.1677, 106.8729],
      'SDN 18 Tanah Abang': [-6.1935, 106.8194],
      'SDN 25 Gambir': [-6.1658, 106.8240]
    }
    return coordinates[school.name] || defaultCenter
  }

  const selectedDistributionData = distributions.find(d => d.id === selectedDistribution)

  const getRouteWaypoints = (distribution: Distribution) => {
    return distribution.schools
      .sort((a, b) => a.routeOrder - b.routeOrder)
      .map(school => getSchoolCoordinates(school.school))
  }

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
            <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Belum Ada Distribusi</h3>
            <p className="text-muted-foreground">
              {selectedSchool 
                ? 'Belum ada distribusi untuk sekolah yang dipilih'
                : 'Belum ada data distribusi'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Distribution Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pilih Distribusi untuk Ditampilkan di Peta</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedDistribution || ''} onValueChange={setSelectedDistribution}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih distribusi untuk melihat rute" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border">
              {distributions.map((distribution) => (
                <SelectItem 
                  key={distribution.id} 
                  value={distribution.id}
                  className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="flex items-center space-x-2">
                    <span>{new Date(distribution.distributionDate).toLocaleDateString('id-ID')}</span>
                    <Badge className={`text-xs ${statusColors[distribution.status]}`}>
                      {statusLabels[distribution.status]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({distribution.totalPortions} porsi ke {distribution.schools.length} sekolah)
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map" className="flex items-center">
            <Map className="w-4 h-4 mr-2" />
            Peta Distribusi
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center">
            <List className="w-4 h-4 mr-2" />
            Daftar Distribusi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          {mapLoaded && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Peta Rute Distribusi
                  {selectedDistributionData && (
                    <Badge className={`ml-2 ${statusColors[selectedDistributionData.status]}`}>
                      {statusLabels[selectedDistributionData.status]}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full rounded-lg overflow-hidden border">
                  <MapContainer
                    center={defaultCenter}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Tampilkan semua sekolah jika tidak ada distribusi yang dipilih */}
                    {!selectedDistributionData && distributions.map(distribution => 
                      distribution.schools.map(school => {
                        const [lat, lng] = getSchoolCoordinates(school.school)
                        return (
                          <SchoolMarker
                            key={school.schoolId}
                            position={[lat, lng]}
                            school={{
                              id: school.school.id,
                              name: school.school.name,
                              address: school.school.address
                            }}
                            plannedPortions={school.plannedPortions}
                          />
                        )
                      })
                    )}

                    {/* Tampilkan rute untuk distribusi yang dipilih */}
                    {selectedDistributionData && (
                      <>
                        {/* Markers untuk sekolah dalam distribusi */}
                        {selectedDistributionData.schools
                          .sort((a, b) => a.routeOrder - b.routeOrder)
                          .map((school, index) => {
                            const [lat, lng] = getSchoolCoordinates(school.school)
                            const isFirst = index === 0
                            const isLast = index === selectedDistributionData.schools.length - 1
                            
                            return (
                              <SchoolMarker
                                key={school.schoolId}
                                position={[lat, lng]}
                                school={{
                                  id: school.school.id,
                                  name: school.school.name,
                                  address: school.school.address
                                }}
                                routeOrder={school.routeOrder}
                                plannedPortions={school.plannedPortions}
                                actualPortions={school.actualPortions}
                                isFirst={isFirst}
                                isLast={isLast}
                              />
                            )
                          })}

                        {/* RoutePolyline untuk menampilkan rute yang mengikuti jalan */}
                        <RoutePolyline
                          waypoints={getRouteWaypoints(selectedDistributionData)}
                          color="#3b82f6"
                          weight={4}
                          opacity={0.8}
                        />
                      </>
                    )}
                  </MapContainer>
                </div>
                
                {selectedDistributionData && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Informasi Distribusi</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tanggal:</span>
                        <span className="ml-2">{new Date(selectedDistributionData.distributionDate).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Porsi:</span>
                        <span className="ml-2">{selectedDistributionData.totalPortions}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Jumlah Sekolah:</span>
                        <span className="ml-2">{selectedDistributionData.schools.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={`ml-2 ${statusColors[selectedDistributionData.status]}`}>
                          {statusLabels[selectedDistributionData.status]}
                        </Badge>
                      </div>
                    </div>
                    {selectedDistributionData.estimatedDuration && (
                      <div className="mt-2">
                        <span className="text-muted-foreground">Estimasi Durasi:</span>
                        <span className="ml-2">{selectedDistributionData.estimatedDuration} menit</span>
                      </div>
                    )}
                    {selectedDistributionData.notes && (
                      <div className="mt-2">
                        <span className="text-muted-foreground">Catatan:</span>
                        <span className="ml-2">{selectedDistributionData.notes}</span>
                      </div>
                    )}
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs text-blue-700 dark:text-blue-300">
                      <span className="font-medium">💡 Info:</span> Rute mengikuti jalan sebenarnya menggunakan OpenStreetMap routing
                      <br />
                      <span className="text-xs opacity-75">Jika terlihat garis lurus, sedang memuat rute atau routing service tidak tersedia</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Distribusi ({distributions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Porsi</TableHead>
                      <TableHead>Sekolah</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Catatan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distributions.map((distribution) => (
                      <TableRow key={distribution.id}>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                            {new Date(distribution.distributionDate).toLocaleDateString('id-ID')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[distribution.status]}>
                            {statusLabels[distribution.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Package className="w-3 h-3 mr-1 text-muted-foreground" />
                            {distribution.totalPortions} porsi
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {distribution.schools
                              .sort((a, b) => a.routeOrder - b.routeOrder)
                              .map((school) => (
                                <div key={school.schoolId} className="text-sm">
                                  <span className="text-muted-foreground">#{school.routeOrder}</span>
                                  <span className="ml-1">{school.school.name}</span>
                                  <span className="ml-1 text-muted-foreground">
                                    ({school.plannedPortions} porsi)
                                  </span>
                                </div>
                              ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {distribution.estimatedDuration && (
                              <div>Estimasi: {distribution.estimatedDuration} menit</div>
                            )}
                            {distribution.actualDuration && (
                              <div>Aktual: {distribution.actualDuration} menit</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {distribution.notes || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedDistribution(distribution.id)}
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Lihat di Peta
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
