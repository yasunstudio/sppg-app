'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Trash2, Building } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface School {
  id: string
  name: string
  address: string
}

export function CreateWasteRecord() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [schoolsLoading, setSchoolsLoading] = useState(false)
  const [schools, setSchools] = useState<School[]>([])
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [formData, setFormData] = useState({
    recordDate: new Date().toISOString().split('T')[0],
    wasteType: '' as 'ORGANIC' | 'INORGANIC' | 'PACKAGING' | '',
    source: '' as 'PREPARATION' | 'PRODUCTION' | 'PACKAGING' | 'SCHOOL_LEFTOVER' | 'EXPIRED_MATERIAL' | '',
    weight: 0,
    notes: '',
    schoolId: ''
  })

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    // Auto fetch schools when SCHOOL_LEFTOVER is selected
    if (formData.source === 'SCHOOL_LEFTOVER' && schools.length === 0) {
      fetchSchools()
    }
  }, [formData.source, schools.length])

  useEffect(() => {
    // Update selected school when formData.schoolId changes and schools are available
    if (formData.schoolId && schools.length > 0) {
      const school = schools.find(s => s.id === formData.schoolId)
      setSelectedSchool(school || null)
    } else {
      setSelectedSchool(null)
    }
  }, [formData.schoolId, schools])

  const fetchSchools = async () => {
    try {
      setSchoolsLoading(true)
      console.log('Fetching schools from API...')
      
      const response = await fetch('/api/schools?limit=100')
      console.log('Schools API response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Schools API response:', result)
        
        // Check if the response has data property (schools API structure)
        if (result.data && Array.isArray(result.data)) {
          console.log('Successfully fetched schools:', result.data.length)
          setSchools(result.data)
        } else if (result.error) {
          console.error('Failed to fetch schools:', result.error)
          // Set empty array as fallback
          setSchools([])
        } else {
          console.error('Invalid schools API response structure:', result)
          // Set empty array as fallback
          setSchools([])
        }
      } else {
        console.error('Failed to fetch schools, status:', response.status)
        // Set empty array as fallback
        setSchools([])
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
      // Set empty array as fallback
      setSchools([])
    } finally {
      setSchoolsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.wasteType || !formData.source || formData.weight <= 0) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/waste-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordDate: formData.recordDate,
          wasteType: formData.wasteType,
          source: formData.source,
          weight: formData.weight,
          notes: formData.notes || null,
          schoolId: formData.schoolId || null
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Catatan limbah berhasil dibuat')
        router.push('/dashboard/waste-management')
      } else {
        toast.error(result.error || 'Gagal membuat catatan limbah')
      }
    } catch (error) {
      console.error('Error creating waste record:', error)
      toast.error('Gagal membuat catatan limbah')
    } finally {
      setLoading(false)
    }
  }

  const wasteTypes = [
    { value: 'ORGANIC', label: 'Organik' },
    { value: 'INORGANIC', label: 'Anorganik' },
    { value: 'PACKAGING', label: 'Kemasan' }
  ]

  const wasteSources = [
    { value: 'PREPARATION', label: 'Persiapan Makanan' },
    { value: 'PRODUCTION', label: 'Proses Produksi' },
    { value: 'PACKAGING', label: 'Proses Pengemasan' },
    { value: 'SCHOOL_LEFTOVER', label: 'Sisa Sekolah' },
    { value: 'EXPIRED_MATERIAL', label: 'Bahan Kadaluarsa' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buat Catatan Limbah</h1>
        <p className="text-muted-foreground">
          Tambahkan catatan pelacakan limbah baru
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Informasi Limbah
              </CardTitle>
              <CardDescription>
                Detail dasar tentang catatan limbah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recordDate">
                  Tanggal Catatan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="recordDate"
                  type="date"
                  value={formData.recordDate}
                  onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                  className="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wasteType">
                  Jenis Limbah <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.wasteType}
                  onValueChange={(value: 'ORGANIC' | 'INORGANIC' | 'PACKAGING') => 
                    setFormData({ ...formData, wasteType: value })
                  }
                >
                  <SelectTrigger className="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    <SelectValue placeholder="Pilih jenis limbah" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">
                  Sumber Limbah <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.source}
                  onValueChange={(value: 'PREPARATION' | 'PRODUCTION' | 'PACKAGING' | 'SCHOOL_LEFTOVER' | 'EXPIRED_MATERIAL') => 
                    setFormData({ ...formData, source: value })
                  }
                >
                  <SelectTrigger className="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    <SelectValue placeholder="Pilih sumber limbah" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteSources.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">
                  Berat (kg) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  placeholder="0.0"
                  className="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informasi Tambahan
              </CardTitle>
              <CardDescription>
                Catatan dan informasi sekolah (opsional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.source === 'SCHOOL_LEFTOVER' && (
                <div className="space-y-2">
                  <Label htmlFor="school">Sekolah</Label>
                  <Select
                    value={formData.schoolId}
                    onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
                  >
                    <SelectTrigger className="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                      <SelectValue 
                        placeholder={
                          schoolsLoading 
                            ? "Memuat sekolah..." 
                            : schools.length === 0 
                              ? "Tidak ada sekolah tersedia" 
                              : "Pilih sekolah"
                        } 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedSchool && (
                    <div className="p-3 bg-muted dark:bg-slate-700 rounded-md">
                      <p className="text-sm font-medium dark:text-slate-200">{selectedSchool.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-slate-400">{selectedSchool.address}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan tambahan tentang limbah..."
                  rows={4}
                  className="resize-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
                />
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  Detail tambahan tentang catatan limbah
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/dashboard/waste-management')}
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            {loading ? 'Membuat...' : 'Buat Catatan Limbah'}
          </Button>
        </div>
      </form>
    </div>
  )
}
