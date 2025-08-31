"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, TestTube, Calendar, Package, Clock, XCircle } from "lucide-react"
import { toast } from "sonner"

const foodSampleSchema = z.object({
  menuName: z.string().min(1, "Menu name is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  sampleType: z.enum(["RAW_MATERIAL", "COOKED_FOOD", "PACKAGED_MEAL"], {
    message: "Sample type is required",
  }),
  status: z.enum(["STORED", "TESTED", "DISPOSED"], {
    message: "Status is required",
  }),
  sampleDate: z.string().min(1, "Sample date is required"),
  storageDays: z.number().min(1, "Storage days must be at least 1").max(30, "Storage days cannot exceed 30"),
  notes: z.string().optional(),
})

type FoodSampleFormData = z.infer<typeof foodSampleSchema>

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
}

interface FoodSampleEditProps {
  id: string
}

const sampleTypeOptions = [
  { value: "RAW_MATERIAL", label: "Raw Material", icon: Package },
  { value: "COOKED_FOOD", label: "Cooked Food", icon: TestTube },
  { value: "PACKAGED_MEAL", label: "Packaged Meal", icon: Package },
]

const statusOptions = [
  { value: "STORED", label: "Stored", description: "Sample is currently stored" },
  { value: "TESTED", label: "Tested", description: "Sample has been tested" },
  { value: "DISPOSED", label: "Disposed", description: "Sample has been disposed" },
]

export function FoodSampleEdit({ id }: FoodSampleEditProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [foodSample, setFoodSample] = useState<FoodSample | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FoodSampleFormData>({
    resolver: zodResolver(foodSampleSchema),
  })

  const watchedSampleType = watch("sampleType")
  const watchedStatus = watch("status")

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
      const sample = result.data
      setFoodSample(sample)
      
      // Format date for input field
      const formattedDate = new Date(sample.sampleDate).toISOString().split('T')[0]
      
      reset({
        menuName: sample.menuName,
        batchNumber: sample.batchNumber,
        sampleType: sample.sampleType,
        status: sample.status,
        sampleDate: formattedDate,
        storageDays: sample.storageDays,
        notes: sample.notes || "",
      })
    } catch (error) {
      console.error('Error fetching food sample:', error)
      toast.error('Failed to load food sample details')
      router.push('/dashboard/food-samples')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FoodSampleFormData) => {
    setIsSubmitting(true)
    
    try {
      const submitData = {
        ...data,
        sampleDate: new Date(data.sampleDate).toISOString(),
      }

      const response = await fetch(`/api/food-samples/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update food sample')
      }

      toast.success('Food sample updated successfully!')
      router.push(`/dashboard/food-samples/${id}`)
    } catch (error) {
      console.error('Error updating food sample:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update food sample')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStorageRecommendation = (sampleType: string) => {
    switch (sampleType) {
      case "RAW_MATERIAL":
        return "Recommended storage: 1-3 days in refrigerated conditions"
      case "COOKED_FOOD":
        return "Recommended storage: 3-7 days in refrigerated conditions"
      case "PACKAGED_MEAL":
        return "Recommended storage: 5-7 days according to packaging requirements"
      default:
        return ""
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
          The food sample you're trying to edit doesn't exist.
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Food Sample</h1>
          <p className="text-muted-foreground">
            Update information for {foodSample.menuName} (Batch: {foodSample.batchNumber})
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Sample Information
            </CardTitle>
            <CardDescription>
              Update basic information about the food sample
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="menuName">
                  Menu Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="menuName"
                  {...register('menuName')}
                  placeholder="Enter menu name"
                />
                {errors.menuName && (
                  <p className="text-sm text-red-500">{errors.menuName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchNumber">
                  Batch Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="batchNumber"
                  {...register('batchNumber')}
                  placeholder="Enter batch number"
                />
                {errors.batchNumber && (
                  <p className="text-sm text-red-500">{errors.batchNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleType">
                  Sample Type <span className="text-red-500">*</span>
                </Label>
                <Select 
                  onValueChange={(value) => setValue('sampleType', value as any)}
                  defaultValue={foodSample.sampleType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sample type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleTypeOptions.map((option) => {
                      const IconComponent = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {errors.sampleType && (
                  <p className="text-sm text-red-500">{errors.sampleType.message}</p>
                )}
                {watchedSampleType && (
                  <p className="text-sm text-muted-foreground">
                    {getStorageRecommendation(watchedSampleType)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select 
                  onValueChange={(value) => setValue('status', value as any)}
                  defaultValue={foodSample.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="space-y-1">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
                {watchedStatus === "DISPOSED" && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    <XCircle className="h-4 w-4" />
                    Setting status to "Disposed" will mark the sample as disposed
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleDate">
                  Sample Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sampleDate"
                    type="date"
                    {...register('sampleDate')}
                    className="pl-10"
                  />
                </div>
                {errors.sampleDate && (
                  <p className="text-sm text-red-500">{errors.sampleDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageDays">
                  Storage Days <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="storageDays"
                    type="number"
                    min="1"
                    max="30"
                    {...register('storageDays', { valueAsNumber: true })}
                    className="pl-10"
                  />
                </div>
                {errors.storageDays && (
                  <p className="text-sm text-red-500">{errors.storageDays.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Number of days to store the sample (1-30 days)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes about the sample (optional)"
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Information */}
        <Card>
          <CardHeader>
            <CardTitle>Current Information</CardTitle>
            <CardDescription>
              Information about the sample's current state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">Sample ID</p>
                <p className="font-mono bg-muted px-2 py-1 rounded text-xs">
                  {foodSample.id}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">Created</p>
                <p>{new Date(foodSample.sampleDate).toLocaleDateString()}</p>
              </div>

              {foodSample.disposedAt && (
                <div className="space-y-1">
                  <p className="font-medium text-muted-foreground">Disposed</p>
                  <p>{new Date(foodSample.disposedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Storage Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Storage Guidelines
            </CardTitle>
            <CardDescription>
              Important information about food sample storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-medium text-sm">General Storage Requirements:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Store samples in properly labeled, sealed containers</li>
                  <li>• Maintain appropriate temperature (refrigerated for most samples)</li>
                  <li>• Record storage date and expected disposal date</li>
                  <li>• Follow HACCP guidelines for food safety</li>
                  <li>• Document any changes in sample condition</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <Package className="h-4 w-4 text-orange-600" />
                    Raw Material
                  </div>
                  <p className="text-muted-foreground">
                    Store at 0-4°C for 1-3 days. Monitor for freshness and quality deterioration.
                  </p>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <TestTube className="h-4 w-4 text-blue-600" />
                    Cooked Food
                  </div>
                  <p className="text-muted-foreground">
                    Store at 0-4°C for 3-7 days. Check for signs of spoilage regularly.
                  </p>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <Package className="h-4 w-4 text-green-600" />
                    Packaged Meal
                  </div>
                  <p className="text-muted-foreground">
                    Follow packaging requirements. Store 5-7 days under proper conditions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Food Sample
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
