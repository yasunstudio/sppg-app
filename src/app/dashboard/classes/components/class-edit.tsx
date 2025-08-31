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
import { ArrowLeft, Save, Users, School, GraduationCap, UserCheck, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

const classSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  grade: z.number().min(1, "Grade must be at least 1").max(12, "Grade must be at most 12"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(50, "Capacity cannot exceed 50"),
  teacherName: z.string().optional(),
  notes: z.string().optional(),
  schoolId: z.string().min(1, "School is required"),
})

type ClassFormData = z.infer<typeof classSchema>

interface ClassData {
  id: string
  name: string
  grade: number
  capacity: number
  currentCount: number
  teacherName?: string | null
  notes?: string | null
  schoolId: string
  school: {
    id: string
    name: string
    address: string
  }
}

interface School {
  id: string
  name: string
  address: string
}

interface ClassEditProps {
  classId: string
}

const gradeOptions = Array.from({length: 12}, (_, i) => i + 1)

export function ClassEdit({ classId }: ClassEditProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [schools, setSchools] = useState<School[]>([])
  const [classData, setClassData] = useState<ClassData | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
  })

  const watchedGrade = watch("grade")
  const watchedSchool = watch("schoolId")
  const watchedCapacity = watch("capacity")

  useEffect(() => {
    fetchClass()
    fetchSchools()
  }, [classId])

  const fetchClass = async () => {
    try {
      const response = await fetch(`/api/classes/${classId}`)
      if (response.ok) {
        const result = await response.json()
        setClassData(result)
        
        // Populate form with existing data
        reset({
          name: result.name,
          grade: result.grade,
          capacity: result.capacity,
          teacherName: result.teacherName || "",
          notes: result.notes || "",
          schoolId: result.schoolId,
        })
      } else {
        toast.error('Class not found')
        router.push('/dashboard/classes')
      }
    } catch (error) {
      console.error('Error fetching class:', error)
      toast.error('Failed to fetch class details')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools?limit=100')
      if (response.ok) {
        const result = await response.json()
        setSchools(result.data || result)
      } else {
        toast.error('Failed to fetch schools')
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
      toast.error('Failed to fetch schools')
    }
  }

  const onSubmit = async (data: ClassFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update class')
      }

      const result = await response.json()
      toast.success('Class updated successfully!')
      router.push(`/dashboard/classes/${result.id}`)
    } catch (error) {
      console.error('Error updating class:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update class')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSchoolInfo = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId)
    return school ? `${school.name} - ${school.address}` : ""
  }

  const isCapacityReduced = () => {
    if (!classData || !watchedCapacity) return false
    return watchedCapacity < classData.currentCount
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading class details...</span>
        </div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Class not found</h3>
          <p className="text-muted-foreground">The class you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => router.push('/dashboard/classes')}>
            Back to Classes
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Class</h1>
          <p className="text-muted-foreground">
            Update information for {classData.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Class Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Class Information
            </CardTitle>
            <CardDescription>
              Update basic information about the classroom
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Class Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g. 7A, 10B, etc."
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">
                  Grade Level <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={watchedGrade?.toString()} 
                  onValueChange={(value) => setValue('grade', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.grade && (
                  <p className="text-sm text-red-500">{errors.grade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Class Capacity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="50"
                  {...register('capacity', { valueAsNumber: true })}
                  placeholder="Maximum number of students"
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500">{errors.capacity.message}</p>
                )}
                {isCapacityReduced() && (
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <div className="flex items-center gap-2 text-orange-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Capacity Warning</span>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      New capacity ({watchedCapacity}) is less than current enrollment ({classData.currentCount}). 
                      Some students may need to be reassigned.
                    </p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Current enrollment: {classData.currentCount} students
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherName">
                  Teacher Name
                </Label>
                <Input
                  id="teacherName"
                  {...register('teacherName')}
                  placeholder="Enter teacher's name (optional)"
                />
                {errors.teacherName && (
                  <p className="text-sm text-red-500">{errors.teacherName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Any additional information about the class (special programs, requirements, etc.)"
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* School Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              School Assignment
            </CardTitle>
            <CardDescription>
              Update the school assignment for this class
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schoolId">
                School <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={watchedSchool} 
                onValueChange={(value) => setValue('schoolId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{school.name}</span>
                        <span className="text-sm text-muted-foreground">{school.address}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.schoolId && (
                <p className="text-sm text-red-500">{errors.schoolId.message}</p>
              )}
              {watchedSchool && (
                <p className="text-sm text-muted-foreground">
                  Selected: {getSchoolInfo(watchedSchool)}
                </p>
              )}
            </div>

            {schools.length === 0 && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <School className="h-4 w-4" />
                  <span className="font-medium">No schools available</span>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Please add schools to the system before updating class assignments.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => router.push('/dashboard/schools')}
                >
                  Manage Schools
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Update Guidelines
            </CardTitle>
            <CardDescription>
              Important information when updating class records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-medium text-sm">Important Notes:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Capacity changes may affect current student enrollment</li>
                  <li>• School changes will update nutrition program assignments</li>
                  <li>• Grade changes may affect program eligibility</li>
                  <li>• All existing student assignments will remain linked</li>
                  <li>• Changes are logged for audit purposes</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Capacity Management
                  </div>
                  <p className="text-muted-foreground">
                    If reducing capacity below current enrollment, some students may need reassignment.
                  </p>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    Teacher Changes
                  </div>
                  <p className="text-muted-foreground">
                    Teacher assignments help coordinate nutrition programs within classes.
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
          <Button type="submit" disabled={isSubmitting || schools.length === 0}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Class
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
