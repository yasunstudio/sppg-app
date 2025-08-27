'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, School, Users, GraduationCap, MapPin, Search, Filter } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SchoolsList } from './components/schools-list'
import { SchoolForm } from './components/school-form'
import { SchoolStats } from './components/school-stats'
import { StudentsListSimple } from './components/students-list-simple'
import { ClassesList } from './components/classes-list-simple'
import { DistributionsMap } from './components/distributions-map'

type SchoolStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'
type SchoolType = 'SD' | 'SMP' | 'SMA' | 'SMK'

export default function SchoolsPage() {
  const [activeTab, setActiveTab] = useState('schools')
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SchoolStatus | 'ALL'>('ALL')
  const [typeFilter, setTypeFilter] = useState<SchoolType | 'ALL'>('ALL')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Fetch schools data
  const { data: schoolsResponse, isLoading, refetch } = useQuery({
    queryKey: ['schools', statusFilter, typeFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (typeFilter !== 'ALL') params.append('type', typeFilter)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`/api/schools?${params}`)
      if (!response.ok) throw new Error('Failed to fetch schools')
      return response.json()
    }
  })

  const schools = schoolsResponse?.data || []

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800', 
      PENDING: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status as SchoolStatus] || 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type: string) => {
    const colors = {
      SD: 'bg-blue-100 text-blue-800',
      SMP: 'bg-purple-100 text-purple-800',
      SMA: 'bg-indigo-100 text-indigo-800',
      SMK: 'bg-orange-100 text-orange-800'
    }
    return colors[type as SchoolType] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Sekolah & Siswa</h1>
          <p className="text-muted-foreground">
            Kelola data sekolah, siswa, dan distribusi program makanan sekolah
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Sekolah
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Sekolah Baru</DialogTitle>
              </DialogHeader>
              <SchoolForm 
                onSuccess={() => {
                  setIsCreateDialogOpen(false)
                  refetch()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <SchoolStats />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari sekolah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: SchoolStatus | 'ALL') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value: SchoolType | 'ALL') => setTypeFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Jenis Sekolah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jenis</SelectItem>
                <SelectItem value="SD">Sekolah Dasar</SelectItem>
                <SelectItem value="SMP">SMP</SelectItem>
                <SelectItem value="SMA">SMA</SelectItem>
                <SelectItem value="SMK">SMK</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schools" className="flex items-center">
            <School className="w-4 h-4 mr-2" />
            Sekolah
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Siswa
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" />
            Kelas
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Distribusi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schools" className="space-y-4">
          <SchoolsList
            schools={schools}
            isLoading={isLoading}
            onRefetch={refetch}
            onSelectSchool={setSelectedSchool}
          />
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <StudentsListSimple
            selectedSchool={selectedSchool}
            schools={schools}
            onRefetch={refetch}
          />
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <ClassesList
            selectedSchool={selectedSchool}
            schools={schools}
            onRefetch={refetch}
          />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <DistributionsMap selectedSchool={selectedSchool} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
