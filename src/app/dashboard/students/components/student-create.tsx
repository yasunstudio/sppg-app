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
import { ArrowLeft, Save, User, School, Users, Calendar } from "lucide-react"
import { toast } from "sonner"

const studentSchema = z.object({
  nisn: z.string().min(10, "NISN must be at least 10 digits").max(10, "NISN must be exactly 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(5, "Age must be at least 5 years").max(18, "Age must be at most 18 years"),
  gender: z.enum(["MALE", "FEMALE"], {
    message: "Gender is required",
  }),
  grade: z.string().min(1, "Grade is required"),
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  schoolId: z.string().min(1, "School is required"),
  notes: z.string().optional(),
})

type StudentFormData = z.infer<typeof studentSchema>

interface School {
  id: string
  name: string
  address: string
}

const genderOptions = [
  { value: "MALE", label: "Laki-laki" },
  { value: "FEMALE", label: "Perempuan" },
]

const gradeOptions = [
  "1", "2", "3", "4", "5", "6", // SD
  "7", "8", "9", // SMP
  "10", "11", "12", // SMA
]

export function StudentCreate() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [schools, setSchools] = useState<School[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      age: 7,
    }
  })

  const watchedGender = watch("gender")
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

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create student')
      }

      const result = await response.json()
      toast.success('Student created successfully!')
      router.push(`/dashboard/students/${result.id}`)
    } catch (error) {
      console.error('Error creating student:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create student')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateNISN = () => {
    // Generate random 10-digit NISN
    const randomNISN = Math.floor(Math.random() * 9000000000) + 1000000000
    setValue('nisn', randomNISN.toString())
  }

  const getSchoolInfo = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId)
    return school ? `${school.name} - ${school.address}` : ""
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
          <h1 className="text-3xl font-bold tracking-tight">Add New Student</h1>
          <p className="text-muted-foreground">
            Register a new student in the system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
            <CardDescription>
              Basic information about the student
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nisn">
                  NISN (Student ID) <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="nisn"
                    {...register('nisn')}
                    placeholder="Enter 10-digit NISN"
                    maxLength={10}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateNISN}
                  >
                    Generate
                  </Button>
                </div>
                {errors.nisn && (
                  <p className="text-sm text-red-500">{errors.nisn.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Nomor Induk Siswa Nasional (10 digits)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter student's full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">
                  Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="5"
                  max="18"
                  {...register('age', { valueAsNumber: true })}
                  placeholder="Enter age"
                />
                {errors.age && (
                  <p className="text-sm text-red-500">{errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('gender', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">
                  Grade <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('grade', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={grade} value={grade}>
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
                <Label htmlFor="parentName">
                  Parent/Guardian Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="parentName"
                  {...register('parentName')}
                  placeholder="Enter parent or guardian name"
                />
                {errors.parentName && (
                  <p className="text-sm text-red-500">{errors.parentName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Any additional information about the student (allergies, special needs, etc.)"
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* School Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              School Assignment
            </CardTitle>
            <CardDescription>
              Assign the student to a school
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
                  Please add schools to the system before registering students.
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

        {/* Registration Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Registration Guidelines
            </CardTitle>
            <CardDescription>
              Important information for student registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-medium text-sm">Required Information:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Valid 10-digit NISN (Nomor Induk Siswa Nasional)</li>
                  <li>• Complete student name as per official documents</li>
                  <li>• Accurate age and gender information</li>
                  <li>• Current grade level</li>
                  <li>• Parent or guardian contact information</li>
                  <li>• School assignment</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Age Requirements
                  </div>
                  <p className="text-muted-foreground">
                    Students must be between 5-18 years old to be eligible for school nutrition programs.
                  </p>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <School className="h-4 w-4 text-green-600" />
                    School Assignment
                  </div>
                  <p className="text-muted-foreground">
                    Students must be assigned to a participating school to access nutrition services.
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
                Create Student
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
