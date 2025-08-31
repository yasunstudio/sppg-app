"use client"

import { useState } from "react"
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
import { ArrowLeft, Save, Package, Info, Zap } from "lucide-react"
import { toast } from "sonner"

const materialCategories = [
  { value: 'PROTEIN', label: 'Protein' },
  { value: 'VEGETABLE', label: 'Sayuran' },
  { value: 'FRUIT', label: 'Buah' },
  { value: 'GRAIN', label: 'Biji-bijian' },
  { value: 'DAIRY', label: 'Susu' },
  { value: 'SPICE', label: 'Bumbu' },
  { value: 'OIL', label: 'Minyak' },
  { value: 'BEVERAGE', label: 'Minuman' },
  { value: 'OTHER', label: 'Lainnya' }
]

const units = [
  'kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'sachet', 'bottle', 'can', 'box'
]

const rawMaterialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  category: z.enum(['PROTEIN', 'VEGETABLE', 'FRUIT', 'GRAIN', 'DAIRY', 'SPICE', 'OIL', 'BEVERAGE', 'OTHER']),
  unit: z.string().min(1, "Unit is required"),
  description: z.string().optional(),
  caloriesPer100g: z.number().min(0, "Calories must be non-negative").optional(),
  proteinPer100g: z.number().min(0, "Protein must be non-negative").optional(),
  fatPer100g: z.number().min(0, "Fat must be non-negative").optional(),
  carbsPer100g: z.number().min(0, "Carbohydrates must be non-negative").optional(),
  fiberPer100g: z.number().min(0, "Fiber must be non-negative").optional(),
})

type RawMaterialFormData = z.infer<typeof rawMaterialSchema>

export function RawMaterialCreate() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RawMaterialFormData>({
    resolver: zodResolver(rawMaterialSchema)
  })

  const selectedCategory = watch('category')

  const onSubmit = async (data: RawMaterialFormData) => {
    setIsSubmitting(true)
    
    try {
      // Convert empty strings to null for optional numeric fields
      const submitData = {
        ...data,
        caloriesPer100g: data.caloriesPer100g || null,
        proteinPer100g: data.proteinPer100g || null,
        fatPer100g: data.fatPer100g || null,
        carbsPer100g: data.carbsPer100g || null,
        fiberPer100g: data.fiberPer100g || null,
        description: data.description?.trim() || null
      }

      const response = await fetch('/api/raw-materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create raw material')
      }

      const result = await response.json()
      toast.success('Raw material created successfully!')
      router.push(`/dashboard/raw-materials/${result.data.id}`)
    } catch (error) {
      console.error('Error creating raw material:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create raw material')
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Create Raw Material</h1>
          <p className="text-muted-foreground">
            Add a new raw material with nutritional information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of the raw material
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Rice, Chicken Breast, Tomato"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('category', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">
                  Unit <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="text-sm text-red-500">{errors.unit.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Optional description of the raw material"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nutritional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Nutritional Information
            </CardTitle>
            <CardDescription>
              Enter nutritional values per 100g (all fields are optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caloriesPer100g">Calories (per 100g)</Label>
                <Input
                  id="caloriesPer100g"
                  type="number"
                  step="0.1"
                  min="0"
                  {...register('caloriesPer100g', { valueAsNumber: true })}
                  placeholder="e.g., 150"
                />
                {errors.caloriesPer100g && (
                  <p className="text-sm text-red-500">{errors.caloriesPer100g.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="proteinPer100g">Protein (g per 100g)</Label>
                <Input
                  id="proteinPer100g"
                  type="number"
                  step="0.1"
                  min="0"
                  {...register('proteinPer100g', { valueAsNumber: true })}
                  placeholder="e.g., 20.5"
                />
                {errors.proteinPer100g && (
                  <p className="text-sm text-red-500">{errors.proteinPer100g.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatPer100g">Fat (g per 100g)</Label>
                <Input
                  id="fatPer100g"
                  type="number"
                  step="0.1"
                  min="0"
                  {...register('fatPer100g', { valueAsNumber: true })}
                  placeholder="e.g., 5.2"
                />
                {errors.fatPer100g && (
                  <p className="text-sm text-red-500">{errors.fatPer100g.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbsPer100g">Carbohydrates (g per 100g)</Label>
                <Input
                  id="carbsPer100g"
                  type="number"
                  step="0.1"
                  min="0"
                  {...register('carbsPer100g', { valueAsNumber: true })}
                  placeholder="e.g., 30.1"
                />
                {errors.carbsPer100g && (
                  <p className="text-sm text-red-500">{errors.carbsPer100g.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiberPer100g">Fiber (g per 100g)</Label>
                <Input
                  id="fiberPer100g"
                  type="number"
                  step="0.1"
                  min="0"
                  {...register('fiberPer100g', { valueAsNumber: true })}
                  placeholder="e.g., 2.8"
                />
                {errors.fiberPer100g && (
                  <p className="text-sm text-red-500">{errors.fiberPer100g.message}</p>
                )}
              </div>
            </div>

            {selectedCategory && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Category: {materialCategories.find(c => c.value === selectedCategory)?.label}</p>
                    <p>Make sure to enter accurate nutritional information for better meal planning calculations.</p>
                  </div>
                </div>
              </div>
            )}
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
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Raw Material
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
