'use client'

import { useState, useEffect } from 'react'
import { SystemConfigStatsCards } from './system-config-stats/system-config-stats-cards'
import { SystemConfigPageActions } from './system-config-page-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  Settings, 
  Save, 
  Edit, 
  Database,
  Globe,
  Bell,
  DollarSign,
  Shield,
  Wrench,
  RefreshCw,
  Plus,
  Search,
  BarChart3,
  List
} from 'lucide-react'
import { CONFIG_CATEGORIES, CONFIG_DATA_TYPES } from './utils/system-config-schemas'

interface SystemConfig {
  id: string
  key: string
  value: string
  description: string | null
  dataType: string
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface GroupedConfigs {
  [category: string]: SystemConfig[]
}

export function SystemConfigManagement() {
  const [configs, setConfigs] = useState<SystemConfig[]>([])
  const [groupedConfigs, setGroupedConfigs] = useState<GroupedConfigs>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingConfig, setEditingConfig] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchConfigs()
  }, [refreshKey])

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/system-config')
      const data = await response.json()
      
      if (data.success) {
        setConfigs(data.data)
        setGroupedConfigs(data.grouped)
      } else {
        setError(data.error || 'Gagal memuat konfigurasi sistem')
      }
    } catch (err) {
      setError('Gagal memuat konfigurasi sistem')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleEdit = (config: SystemConfig) => {
    setEditingConfig(config.id)
    setEditValue(config.value)
    setEditDescription(config.description || '')
  }

  const handleSave = async (configId: string) => {
    try {
      const response = await fetch('/api/system-config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: configId,
          value: editValue,
          description: editDescription
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setEditingConfig(null)
        fetchConfigs()
      } else {
        setError(data.error || 'Gagal memperbarui konfigurasi')
      }
    } catch (err) {
      setError('Gagal memperbarui konfigurasi')
    }
  }

  const handleCancel = () => {
    setEditingConfig(null)
    setEditValue('')
    setEditDescription('')
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      GENERAL: Settings,
      DATABASE: Database,
      EMAIL: Globe,
      NOTIFICATIONS: Bell,
      PAYMENT: DollarSign,
      SECURITY: Shield,
      API: Wrench,
      UI: Settings
    }
    
    const IconComponent = icons[category] || Settings
    return <IconComponent className="w-5 h-5" />
  }

  const getDataTypeBadgeColor = (dataType: string) => {
    const colors: { [key: string]: string } = {
      STRING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      INTEGER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      BOOLEAN: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      JSON: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    }
    return colors[dataType] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  const filteredConfigs = configs.filter(config =>
    config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredGroupedConfigs = Object.entries(groupedConfigs).reduce((acc, [category, configs]) => {
    const filtered = configs.filter(config =>
      config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {} as GroupedConfigs)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-2 dark:text-white">Memuat konfigurasi sistem...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <Button onClick={fetchConfigs} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-white">Konfigurasi Sistem</h1>
          <p className="text-sm md:text-base text-muted-foreground dark:text-gray-400">
            Kelola pengaturan dan konfigurasi sistem aplikasi
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href="/dashboard/system-config/create">
            <Button className="w-full sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Konfigurasi
            </Button>
          </Link>
          <SystemConfigPageActions onRefresh={handleRefresh} />
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <Input
            placeholder="Cari konfigurasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
          />
        </div>
        <div className="text-sm text-muted-foreground dark:text-gray-400">
          {filteredConfigs.length} dari {configs.length} konfigurasi
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="list" className="dark:data-[state=active]:bg-gray-700">
            <List className="w-4 h-4 mr-2" />
            Daftar Konfigurasi
          </TabsTrigger>
          <TabsTrigger value="stats" className="dark:data-[state=active]:bg-gray-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Statistik
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <SystemConfigStatsCards 
            configs={filteredConfigs} 
            groupedConfigs={filteredGroupedConfigs} 
          />
        </TabsContent>

        <TabsContent value="list">
          {/* Configuration Categories */}
          <div className="space-y-6">
            {Object.entries(filteredGroupedConfigs).map(([category, categoryConfigs]) => (
              <Card key={category} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    {getCategoryIcon(category)}
                    {CONFIG_CATEGORIES[category as keyof typeof CONFIG_CATEGORIES] || category}
                    <Badge variant="secondary" className="ml-auto dark:bg-gray-700 dark:text-gray-300">
                      {categoryConfigs.length} konfigurasi
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryConfigs.map((config) => (
                      <div
                        key={config.id}
                        className="border rounded-lg p-4 space-y-3 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono dark:text-gray-300">
                                {config.key}
                              </code>
                              <Badge 
                                className={getDataTypeBadgeColor(config.dataType)}
                              >
                                {CONFIG_DATA_TYPES[config.dataType as keyof typeof CONFIG_DATA_TYPES] || config.dataType}
                              </Badge>
                              <Badge 
                                variant={config.isActive ? "default" : "secondary"}
                                className={config.isActive ? "dark:bg-green-600" : "dark:bg-gray-600"}
                              >
                                {config.isActive ? 'Aktif' : 'Nonaktif'}
                              </Badge>
                            </div>
                            
                            {editingConfig === config.id ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium mb-1 dark:text-white">
                                    Value
                                  </label>
                                  <Textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    rows={3}
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1 dark:text-white">
                                    Deskripsi
                                  </label>
                                  <Textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={2}
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Deskripsi opsional..."
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSave(config.id)}
                                    className="dark:bg-green-600 dark:hover:bg-green-700"
                                  >
                                    <Save className="w-3 h-3 mr-1" />
                                    Simpan
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                  >
                                    Batal
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-blue-500">
                                  <pre className="text-sm whitespace-pre-wrap break-words dark:text-gray-300">
                                    {config.value}
                                  </pre>
                                </div>
                                {config.description && (
                                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                                    {config.description}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          
                          {editingConfig !== config.id && (
                            <div className="flex gap-2">
                              <Link href={`/dashboard/system-config/${config.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(config)}
                                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                Quick Edit
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground dark:text-gray-500">
                          Terakhir diupdate: {new Date(config.updatedAt).toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {Object.keys(filteredGroupedConfigs).length === 0 && (
            <div className="text-center py-8">
              <Settings className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Tidak ada konfigurasi ditemukan
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Mulai dengan menambahkan konfigurasi sistem baru.'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
