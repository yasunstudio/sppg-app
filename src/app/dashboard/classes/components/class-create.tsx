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
import { ArrowLeft, Save, Users, School, GraduationCap, UserCheck } from "lucide-react"
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

interface School {
  id: string
  name: string
  address: string
}

const gradeOptions = Array.from({length: 12}, (_, i) => i + 1)

export function ClassCreate() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [schools, setSchools] = useState<School[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      capacity: 25,
      grade: 1,
    }
  })

  const watchedGrade = watch("grade")
  const watchedSchool = watch("schoolId")

  useEffect(() => {
    fetchSchools()
  }, [])

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
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create class')
      }

      const result = await response.json()
      toast.success('Class created successfully!')
      router.push(`/dashboard/classes/${result.id}`)
    } catch (error) {
      console.error('Error creating class:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create class')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSchoolInfo = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId)
    return school ? `${school.name} - ${school.address}` : ""
  }

  const generateClassName = () => {
    const grade = watchedGrade
    const randomNum = Math.floor(Math.random() * 26) + 1
    const letter = String.fromCharCode(64 + randomNum) // A-Z
    setValue('name', `${grade}${letter}`)
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
          <h1 className="text-3xl font-bold tracking-tight">Add New Class</h1>
          <p className="text-muted-foreground">
            Create a new classroom for student organization
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
              Basic information about the classroom
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Class Name <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g. 7A, 10B, etc."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateClassName}
                    disabled={!watchedGrade}
                  >
                    Generate
                  </Button>
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Unique identifier for the class (e.g. 7A, 10B)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">
                  Grade Level <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('grade', parseInt(value))}>
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
                <p className="text-xs text-muted-foreground">
                  Maximum number of students (1-50)
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
              Assign the class to a participating school
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schoolId">
                School <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue('schoolId', value)}>
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
                  Please add schools to the system before creating classes.
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

        {/* Class Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Class Management Guidelines
            </CardTitle>
            <CardDescription>
              Important information for classroom setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-medium text-sm">Required Information:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Unique class name (typically grade + letter, e.g. 7A)</li>
                  <li>• Grade level (1-12 for primary to secondary school)</li>
                  <li>• Maximum capacity (recommended 20-30 students)</li>
                  <li>• School assignment for program participation</li>
                  <li>• Teacher assignment (can be added later)</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Capacity Planning
                  </div>
                  <p className="text-muted-foreground">
                    Consider nutrition program logistics when setting capacity. Recommended 20-30 students per class.
                  </p>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    Teacher Assignment
                  </div>
                  <p className="text-muted-foreground">
                    Teacher can be assigned now or later. Teachers help coordinate nutrition programs within classes.
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
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Class
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
