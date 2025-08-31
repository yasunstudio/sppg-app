'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Trash2, 
  Recycle, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  X,
  Download,
  Weight,
  TrendingUp,
  Building,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'

interface WasteRecord {
  id: string
  recordDate: string
  wasteType: 'ORGANIC' | 'INORGANIC' | 'PACKAGING'
  source: 'PREPARATION' | 'PRODUCTION' | 'PACKAGING' | 'SCHOOL_LEFTOVER' | 'EXPIRED_MATERIAL'
  weight: number
  notes?: string | null
  school?: {
    id: string
    name: string
    address: string
  } | null
  createdAt: string
  updatedAt: string
}

interface WasteStats {
  total: number
  totalWeight: number
  byType: Record<string, { count: number; weight: number }>
  bySource: Record<string, { count: number; weight: number }>
  recent30Days: number
}

export function WasteRecordsManagement() {
  const router = useRouter()
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([])
  const [stats, setStats] = useState<WasteStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWasteType, setSelectedWasteType] = useState<string>('all')
  const [selectedSource, setSelectedSource] = useState<string>('all')

  useEffect(() => {
    fetchWasteRecords()
  }, [])

  const fetchWasteRecords = async () => {
    try {
      const response = await fetch('/api/waste-records')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setWasteRecords(result.data)
          setStats(result.stats)
        } else {
          toast.error('Failed to fetch waste records')
        }
      } else {
        toast.error('Failed to fetch waste records')
      }
    } catch (error) {
      console.error('Error fetching waste records:', error)
      toast.error('Failed to fetch waste records')
    } finally {
      setLoading(false)
    }
  }

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case 'ORGANIC':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'INORGANIC':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'PACKAGING':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'PREPARATION':
        return 'bg-yellow-100 text-yellow-700'
      case 'PRODUCTION':
        return 'bg-purple-100 text-purple-700'
      case 'PACKAGING':
        return 'bg-blue-100 text-blue-700'
      case 'SCHOOL_LEFTOVER':
        return 'bg-orange-100 text-orange-700'
      case 'EXPIRED_MATERIAL':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatWasteType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatSource = (source: string) => {
    return source.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const filteredRecords = wasteRecords.filter((record) => {
    const matchesSearch = record.school?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatWasteType(record.wasteType).toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatSource(record.source).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedWasteType === 'all' || record.wasteType === selectedWasteType
    const matchesSource = selectedSource === 'all' || record.source === selectedSource
    
    return matchesSearch && matchesType && matchesSource
  })

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Waste Management</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage waste records from food production and schools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => {/* TODO: Export functionality */}}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/dashboard/waste-management/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Waste Record
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Waste tracking entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
              <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWeight.toFixed(2)} kg</div>
              <p className="text-xs text-muted-foreground">
                Cumulative waste weight
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recent30Days}</div>
              <p className="text-xs text-muted-foreground">
                Records in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organic Waste</CardTitle>
              <Recycle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.byType.ORGANIC ? stats.byType.ORGANIC.weight.toFixed(2) : '0'} kg
              </div>
              <p className="text-xs text-muted-foreground">
                Organic waste total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by school, notes, type, or source..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedWasteType} onValueChange={setSelectedWasteType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Waste Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ORGANIC">Organic</SelectItem>
                  <SelectItem value="INORGANIC">Inorganic</SelectItem>
                  <SelectItem value="PACKAGING">Packaging</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="PREPARATION">Preparation</SelectItem>
                  <SelectItem value="PRODUCTION">Production</SelectItem>
                  <SelectItem value="PACKAGING">Packaging</SelectItem>
                  <SelectItem value="SCHOOL_LEFTOVER">School Leftover</SelectItem>
                  <SelectItem value="EXPIRED_MATERIAL">Expired Material</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || selectedWasteType !== 'all' || selectedSource !== 'all') && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedWasteType('all')
                    setSelectedSource('all')
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waste Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Waste Records</CardTitle>
          <CardDescription>
            {filteredRecords.length} of {wasteRecords.length} waste records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(record.recordDate).toLocaleDateString()}</span>
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
                        <div className="flex items-center space-x-1">
                          <Weight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{record.weight} kg</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.school ? (
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{record.school.name}</p>
                              <p className="text-sm text-muted-foreground">{record.school.address}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No school</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {record.notes || 'No notes'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/waste-management/${record.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/waste-management/${record.id}/edit`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Record
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {/* TODO: Delete functionality */}}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Record
                            </DropdownMenuItem>
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
                        <p className="text-muted-foreground">No waste records found</p>
                        <Button
                          variant="outline"
                          onClick={() => router.push('/dashboard/waste-management/create')}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add First Record
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
