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
  Users, 
  School, 
  GraduationCap, 
  UserCheck,
  Building,
  AlertTriangle,
  CheckCircle,
  Plus,
  Calendar
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

interface ClassData {
  id: string
  name: string
  grade: number
  capacity: number
  currentCount: number
  teacherName?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  school: {
    id: string
    name: string
    address: string
    type: string
  }
}

interface ClassDetailsProps {
  classId: string
}

const gradeColors = {
  1: "bg-red-100 text-red-800 border-red-200",
  2: "bg-orange-100 text-orange-800 border-orange-200", 
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-green-100 text-green-800 border-green-200",
  5: "bg-blue-100 text-blue-800 border-blue-200",
  6: "bg-purple-100 text-purple-800 border-purple-200",
  7: "bg-pink-100 text-pink-800 border-pink-200",
  8: "bg-indigo-100 text-indigo-800 border-indigo-200",
  9: "bg-cyan-100 text-cyan-800 border-cyan-200",
  10: "bg-teal-100 text-teal-800 border-teal-200",
  11: "bg-lime-100 text-lime-800 border-lime-200",
  12: "bg-amber-100 text-amber-800 border-amber-200",
}

export function ClassDetails({ classId }: ClassDetailsProps) {
  const router = useRouter()
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchClass()
  }, [classId])

  const fetchClass = async () => {
    try {
      const response = await fetch(`/api/classes/${classId}`)
      if (response.ok) {
        const result = await response.json()
        setClassData(result)
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

  const handleDelete = async () => {
    if (!classData) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/classes/${classData.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete class')
      }

      toast.success('Class deleted successfully')
      router.push('/dashboard/classes')
    } catch (error) {
      console.error('Error deleting class:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete class')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getGradeBadge = (grade: number) => {
    const colorClass = gradeColors[grade as keyof typeof gradeColors] || "bg-gray-100 text-gray-800 border-gray-200"
    
    return (
      <Badge variant="outline" className={colorClass}>
        Grade {grade}
      </Badge>
    )
  }

  const getCapacityStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    
    if (percentage >= 90) {
      return {
        badge: <Badge variant="destructive">Full ({current}/{capacity})</Badge>,
        status: "full"
      }
    } else if (percentage >= 75) {
      return {
        badge: <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Near Full ({current}/{capacity})
        </Badge>,
        status: "near-full"
      }
    } else {
      return {
        badge: <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Available ({current}/{capacity})
        </Badge>,
        status: "available"
      }
    }
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

  const capacityInfo = getCapacityStatus(classData.currentCount, classData.capacity)

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
            <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
            <p className="text-muted-foreground">
              {getGradeBadge(classData.grade)} • {classData.school.name} • {capacityInfo.badge}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/classes/${classData.id}/edit`)}
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
                <AlertDialogTitle>Delete Class</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete class <strong>{classData.name}</strong>? 
                  This action cannot be undone and will affect all associated records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Class Information
              </CardTitle>
              <CardDescription>
                Basic details and classroom configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Class Name</label>
                  <p className="text-lg font-semibold">{classData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Grade Level</label>
                  <div className="mt-1">
                    {getGradeBadge(classData.grade)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                  <p className="text-lg">{classData.capacity} students</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Enrollment</label>
                  <p className="text-lg">{classData.currentCount} students</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Teacher</label>
                  {classData.teacherName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <span className="text-lg">{classData.teacherName}</span>
                    </div>
                  ) : (
                    <p className="text-lg text-muted-foreground">No teacher assigned</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Availability</label>
                  <div className="mt-1">
                    {capacityInfo.badge}
                  </div>
                </div>
              </div>

              {classData.notes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                    <p className="mt-1 text-sm leading-relaxed">{classData.notes}</p>
                  </div>
                </>
              )}

              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-muted-foreground">Created</label>
                  <p>{formatDate(classData.createdAt)}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Last Updated</label>
                  <p>{formatDate(classData.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* School Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                School Information
              </CardTitle>
              <CardDescription>
                Details about the assigned school
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">School Name</label>
                  <p className="text-lg">{classData.school.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">School Type</label>
                  <p className="text-lg">{classData.school.type}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm text-muted-foreground mt-1">{classData.school.address}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/schools/${classData.school.id}`)}
              >
                View School Details
              </Button>
            </CardContent>
          </Card>

          {/* Student Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Student Management
              </CardTitle>
              <CardDescription>
                Manage students enrolled in this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Student Management</h3>
                <p className="text-muted-foreground">
                  Assign students to this class from the Students management section.
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/students?class=${classData.id}`)}
                  >
                    View All Students
                  </Button>
                  <Button
                    onClick={() => router.push(`/dashboard/students/create?class=${classData.id}`)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Students</span>
                <Badge variant="secondary">{classData.currentCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Maximum Capacity</span>
                <Badge variant="secondary">{classData.capacity}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available Spots</span>
                <Badge variant="secondary">{classData.capacity - classData.currentCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Occupancy Rate</span>
                <Badge variant="outline">
                  {Math.round((classData.currentCount / classData.capacity) * 100)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/dashboard/students/create?class=${classData.id}`)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/dashboard/students?class=${classData.id}`)}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                View Students
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/dashboard/classes/${classData.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Class
              </Button>
            </CardContent>
          </Card>

          {/* Class Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border p-3">
                  <h4 className="font-medium mb-2">Nutrition Program</h4>
                  <p className="text-muted-foreground">
                    All students in this class are eligible for the school nutrition program based on their grade level.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <h4 className="font-medium mb-2">Capacity Management</h4>
                  <p className="text-muted-foreground">
                    Monitor enrollment to ensure optimal class size for effective nutrition program delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
