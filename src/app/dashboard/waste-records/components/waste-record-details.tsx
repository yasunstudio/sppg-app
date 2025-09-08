'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Weight, 
  Building,
  FileText,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

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

interface WasteRecordDetailsProps {
  recordId: string
}

export function WasteRecordDetails({ recordId }: WasteRecordDetailsProps) {
  const router = useRouter()
  const [record, setRecord] = useState<WasteRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (recordId) {
      fetchRecordDetails()
    }
  }, [recordId])

  const fetchRecordDetails = async () => {
    try {
      const response = await fetch(`/api/waste-records/${recordId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setRecord(result.data)
        } else {
          toast.error('Catatan limbah tidak ditemukan')
          router.push('/dashboard/waste-management')
        }
      } else {
        toast.error('Gagal mengambil detail catatan limbah')
        router.push('/dashboard/waste-management')
      }
    } catch (error) {
      console.error('Error fetching waste record:', error)
      toast.error('Gagal mengambil detail catatan limbah')
    } finally {
      setLoading(false)
    }
  }

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case 'ORGANIC':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      case 'INORGANIC':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      case 'PACKAGING':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'PREPARATION':
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
      case 'PRODUCTION':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
      case 'PACKAGING':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800'
      case 'SCHOOL_LEFTOVER':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
      case 'EXPIRED_MATERIAL':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    }
  }

  const formatWasteType = (type: string) => {
    switch (type) {
      case 'ORGANIC':
        return 'Organik'
      case 'INORGANIC':
        return 'Anorganik'
      case 'PACKAGING':
        return 'Kemasan'
      default:
        return type
    }
  }

  const formatSource = (source: string) => {
    switch (source) {
      case 'PREPARATION':
        return 'Persiapan Makanan'
      case 'PRODUCTION':
        return 'Proses Produksi'
      case 'PACKAGING':
        return 'Proses Pengemasan'
      case 'SCHOOL_LEFTOVER':
        return 'Sisa Sekolah'
      case 'EXPIRED_MATERIAL':
        return 'Bahan Kadaluarsa'
      default:
        return source
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded-md w-1/3" />
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Catatan limbah tidak ditemukan atau telah dihapus.
          </p>
          <Link href="/dashboard/waste-management">
            <Button 
              variant="outline" 
              size="icon"
              className="mt-4 h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/waste-management">
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-full flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detail Catatan Limbah</h1>
          <p className="text-muted-foreground">
            Catatan dari {new Date(record.recordDate).toLocaleDateString('id-ID')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Waste Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informasi Limbah
            </CardTitle>
            <CardDescription>
              Detail tentang catatan limbah
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground dark:text-slate-400" />
              <div>
                <p className="text-sm font-medium dark:text-slate-300">Tanggal Catatan</p>
                <p className="text-lg dark:text-slate-100">{new Date(record.recordDate).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium dark:text-slate-300">Jenis Limbah</p>
                <Badge className={getWasteTypeColor(record.wasteType)}>
                  {formatWasteType(record.wasteType)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium dark:text-slate-300">Sumber</p>
                <Badge className={getSourceColor(record.source)}>
                  {formatSource(record.source)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Weight className="h-5 w-5 text-muted-foreground dark:text-slate-400" />
              <div>
                <p className="text-sm font-medium dark:text-slate-300">Berat</p>
                <p className="text-2xl font-bold dark:text-slate-100">{record.weight} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informasi Tambahan
            </CardTitle>
            <CardDescription>
              Catatan dan detail lainnya
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {record.school && (
              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-muted-foreground dark:text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium dark:text-slate-300">Sekolah</p>
                  <p className="text-lg dark:text-slate-100">{record.school.name}</p>
                  <p className="text-sm text-muted-foreground dark:text-slate-400">{record.school.address}</p>
                </div>
              </div>
            )}

            {record.notes && (
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground dark:text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium dark:text-slate-300">Catatan</p>
                  <p className="text-sm text-muted-foreground dark:text-slate-400 whitespace-pre-wrap">{record.notes}</p>
                </div>
              </div>
            )}

            <div className="border-t dark:border-slate-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground dark:text-slate-400">
                <div>
                  <p className="font-medium">Dibuat</p>
                  <p>{new Date(record.createdAt).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="font-medium">Diperbarui</p>
                  <p>{new Date(record.updatedAt).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
