"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  Trash2,
  TestTube,
  Calendar,
  Package,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
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
} from "@/components/ui/alert-dialog"

interface FoodSample {
  id: string
  menuName: string
  batchNumber: string
  sampleType: "RAW_MATERIAL" | "COOKED_FOOD" | "PACKAGED_MEAL"
  status: "STORED" | "TESTED" | "DISPOSED"
  sampleDate: string
  storageDays: number
  notes?: string
  disposedAt?: string
  createdAt: string
  updatedAt: string
}

interface FoodSampleDetailsProps {
  id: string
}

const sampleTypeConfig = {
  RAW_MATERIAL: {
    label: "Raw Material",
    icon: Package,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  COOKED_FOOD: {
    label: "Cooked Food",
    icon: TestTube,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  PACKAGED_MEAL: {
    label: "Packaged Meal",
    icon: Package,
    color: "bg-green-100 text-green-800 border-green-200",
  },
}

const statusConfig = {
  STORED: {
    label: "Stored",
    icon: Package,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  TESTED: {
    label: "Tested",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  DISPOSED: {
    label: "Disposed",
    icon: XCircle,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
}

export function FoodSampleDetails({ id }: FoodSampleDetailsProps) {
  const router = useRouter()
  const [foodSample, setFoodSample] = useState<FoodSample | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchFoodSample()
  }, [id])

  const fetchFoodSample = async () => {
    try {
      const response = await fetch(`/api/food-samples/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch food sample')
      }
      const result = await response.json()
      setFoodSample(result.data)
    } catch (error) {
      console.error('Error fetching food sample:', error)
      toast.error('Failed to load food sample details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/food-samples/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete food sample')
      }

      toast.success('Food sample deleted successfully')
      router.push('/dashboard/food-samples')
    } catch (error) {
      console.error('Error deleting food sample:', error)
      toast.error('Failed to delete food sample')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateDaysStored = () => {
    if (!foodSample) return 0
    const sampleDate = new Date(foodSample.sampleDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - sampleDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getStorageStatus = () => {
    if (!foodSample) return { status: 'unknown', message: '', color: 'text-gray-500' }
    
    const daysStored = calculateDaysStored()
    const targetDays = foodSample.storageDays
    
    if (foodSample.status === 'DISPOSED') {
      return { 
        status: 'disposed', 
        message: 'Sample has been disposed', 
        color: 'text-gray-500' 
      }
    }
    
    if (daysStored >= targetDays) {
      return { 
        status: 'expired', 
        message: `Storage period exceeded (${daysStored}/${targetDays} days)`, 
        color: 'text-red-500' 
      }
    }
    
    const remainingDays = targetDays - daysStored
    if (remainingDays <= 1) {
      return { 
        status: 'warning', 
        message: `${remainingDays} day(s) remaining`, 
        color: 'text-orange-500' 
      }
    }
    
    return { 
      status: 'active', 
      message: `${remainingDays} days remaining`, 
      color: 'text-green-500' 
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!foodSample) {
    return (
      <div className="text-center py-12">
        <TestTube className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Food sample not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The food sample you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push('/dashboard/food-samples')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Food Samples
          </Button>
        </div>
      </div>
    )
  }

  const sampleTypeInfo = sampleTypeConfig[foodSample.sampleType]
  const statusInfo = statusConfig[foodSample.status]
  const storageStatus = getStorageStatus()
  const SampleTypeIcon = sampleTypeInfo.icon
  const StatusIcon = statusInfo.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{foodSample.menuName}</h1>
            <p className="text-muted-foreground">
              Batch: {foodSample.batchNumber} • Sample ID: {foodSample.id}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/food-samples/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Food Sample</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this food sample? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Sample Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Sample Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Sample Type</p>
              <Badge variant="secondary" className={`${sampleTypeInfo.color} flex items-center gap-1 w-fit`}>
                <SampleTypeIcon className="h-3 w-3" />
                {sampleTypeInfo.label}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="secondary" className={`${statusInfo.color} flex items-center gap-1 w-fit`}>
                <StatusIcon className="h-3 w-3" />
                {statusInfo.label}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Sample Date</p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(foodSample.sampleDate)}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Storage Period</p>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {foodSample.storageDays} days
              </div>
            </div>
          </div>

          <Separator />

          {/* Storage Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Storage Status</h4>
              {storageStatus.status === 'expired' && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              {storageStatus.status === 'warning' && (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Days Stored</p>
                <p className="text-lg font-semibold">{calculateDaysStored()} days</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Target Storage</p>
                <p className="text-lg font-semibold">{foodSample.storageDays} days</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`text-lg font-semibold ${storageStatus.color}`}>
                  {storageStatus.message}
                </p>
              </div>
            </div>
          </div>

          {foodSample.disposedAt && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Disposal Information</p>
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-gray-500" />
                  Disposed on {formatDateTime(foodSample.disposedAt)}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {foodSample.notes ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {foodSample.notes}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No notes available for this sample
              </p>
            )}
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm">{formatDateTime(foodSample.createdAt)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm">{formatDateTime(foodSample.updatedAt)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Sample ID</p>
              <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {foodSample.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Guidelines</CardTitle>
          <CardDescription>
            Important information for handling this type of food sample
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {foodSample.sampleType === "RAW_MATERIAL" && (
              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-600" />
                  Raw Material Guidelines
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground ml-6">
                  <li>• Store at 0-4°C in refrigerated conditions</li>
                  <li>• Monitor for signs of spoilage or deterioration</li>
                  <li>• Recommended storage period: 1-3 days</li>
                  <li>• Check freshness and quality regularly</li>
                </ul>
              </div>
            )}

            {foodSample.sampleType === "COOKED_FOOD" && (
              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <TestTube className="h-4 w-4 text-blue-600" />
                  Cooked Food Guidelines
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground ml-6">
                  <li>• Store at 0-4°C immediately after sampling</li>
                  <li>• Use sealed, sterile containers</li>
                  <li>• Recommended storage period: 3-7 days</li>
                  <li>• Monitor for bacterial growth or spoilage</li>
                </ul>
              </div>
            )}

            {foodSample.sampleType === "PACKAGED_MEAL" && (
              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  Packaged Meal Guidelines
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground ml-6">
                  <li>• Follow original packaging storage requirements</li>
                  <li>• Maintain cold chain if required</li>
                  <li>• Recommended storage period: 5-7 days</li>
                  <li>• Check packaging integrity regularly</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
