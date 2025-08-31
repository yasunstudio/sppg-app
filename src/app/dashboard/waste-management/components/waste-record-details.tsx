'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  Trash2, 
  Calendar, 
  Weight, 
  Building,
  FileText,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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
  const [deleteLoading, setDeleteLoading] = useState(false)

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
          toast.error('Waste record not found')
          router.push('/dashboard/waste-management')
        }
      } else {
        toast.error('Failed to fetch waste record details')
        router.push('/dashboard/waste-management')
      }
    } catch (error) {
      console.error('Error fetching waste record:', error)
      toast.error('Failed to fetch waste record details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/waste-records/${recordId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Waste record deleted successfully')
        router.push('/dashboard/waste-management')
      } else {
        toast.error(result.error || 'Failed to delete waste record')
      }
    } catch (error) {
      console.error('Error deleting waste record:', error)
      toast.error('Failed to delete waste record')
    } finally {
      setDeleteLoading(false)
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Waste Record Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The waste record you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/dashboard/waste-management">
          <Button>Back to Waste Management</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/waste-management">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Waste Management
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Waste Record Details</h1>
            <p className="text-muted-foreground">
              Record from {new Date(record.recordDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/waste-management/${record.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Waste Record</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this waste record? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Record'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Waste Information */}
        <Card>
          <CardHeader>
            <CardTitle>Waste Information</CardTitle>
            <CardDescription>Details about the waste record</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Record Date</p>
                <p className="text-lg">{new Date(record.recordDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium">Waste Type</p>
                <Badge className={getWasteTypeColor(record.wasteType)}>
                  {formatWasteType(record.wasteType)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">Source</p>
                <Badge className={getSourceColor(record.source)}>
                  {formatSource(record.source)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Weight className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Weight</p>
                <p className="text-2xl font-bold">{record.weight} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>School association and notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Associated School</p>
                {record.school ? (
                  <div className="mt-1">
                    <p className="font-medium">{record.school.name}</p>
                    <p className="text-sm text-muted-foreground">{record.school.address}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-1">No school associated</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Notes</p>
                {record.notes ? (
                  <p className="mt-1 text-sm">{record.notes}</p>
                ) : (
                  <p className="text-muted-foreground mt-1">No notes provided</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Record Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Record Metadata</CardTitle>
          <CardDescription>Creation and modification timestamps</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created At</p>
            <p className="mt-1">{new Date(record.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <p className="mt-1">{new Date(record.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
