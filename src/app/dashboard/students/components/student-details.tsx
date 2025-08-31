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
  User, 
  School, 
  Calendar, 
  Users, 
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle
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

interface Student {
  id: string
  nisn: string
  name: string
  age: number
  gender: "MALE" | "FEMALE"
  grade: string
  parentName: string
  notes?: string | null
  createdAt: string
  updatedAt: string
  school: {
    id: string
    name: string
    address: string
    type: string
  }
  nutritionConsultations: Array<{
    id: string
    date: string
    status: string
    consultationType: string
  }>
  feedback: Array<{
    id: string
    date: string
    type: string
    rating: number
  }>
  _count: {
    nutritionConsultations: number
    feedback: number
  }
}

interface StudentDetailsProps {
  studentId: string
}

export function StudentDetails({ studentId }: StudentDetailsProps) {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchStudent()
  }, [studentId])

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}`)
      if (response.ok) {
        const student = await response.json()
        setStudent(student)
      } else {
        toast.error('Student not found')
        router.push('/dashboard/students')
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      toast.error('Failed to fetch student details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!student) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete student')
      }

      toast.success('Student deleted successfully')
      router.push('/dashboard/students')
    } catch (error) {
      console.error('Error deleting student:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete student')
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

  const getGenderBadge = (gender: "MALE" | "FEMALE") => {
    return gender === "MALE" ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Laki-laki
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
        Perempuan
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      COMPLETED: "bg-green-50 text-green-700 border-green-200",
      SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
      CANCELLED: "bg-red-50 text-red-700 border-red-200",
      IN_PROGRESS: "bg-yellow-50 text-yellow-700 border-yellow-200",
    }
    
    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading student details...</span>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Student not found</h3>
          <p className="text-muted-foreground">The student you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => router.push('/dashboard/students')}>
            Back to Students
          </Button>
        </div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
            <p className="text-muted-foreground">
              NISN: {student.nisn} • Grade {student.grade} • {student.school.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/students/${student.id}/edit`)}
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
                <AlertDialogTitle>Delete Student</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong>{student.name}</strong>? 
                  This action cannot be undone and will remove all associated records.
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
          {/* Student Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
              <CardDescription>
                Basic details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NISN</label>
                  <p className="text-lg font-mono">{student.nisn}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg">{student.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Age</label>
                  <p className="text-lg">{student.age} years old</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <div className="mt-1">
                    {getGenderBadge(student.gender)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Grade</label>
                  <p className="text-lg">Grade {student.grade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Parent/Guardian</label>
                  <p className="text-lg">{student.parentName}</p>
                </div>
              </div>

              {student.notes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                    <p className="mt-1 text-sm leading-relaxed">{student.notes}</p>
                  </div>
                </>
              )}

              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-muted-foreground">Registered</label>
                  <p>{formatDate(student.createdAt)}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Last Updated</label>
                  <p>{formatDate(student.updatedAt)}</p>
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
                  <p className="text-lg">{student.school.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">School Type</label>
                  <p className="text-lg">{student.school.type}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm text-muted-foreground mt-1">{student.school.address}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/schools/${student.school.id}`)}
              >
                View School Details
              </Button>
            </CardContent>
          </Card>

          {/* Recent Nutrition Consultations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Nutrition Consultations
              </CardTitle>
              <CardDescription>
                Latest nutrition consultation records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {student.nutritionConsultations && student.nutritionConsultations.length > 0 ? (
                <div className="space-y-3">
                  {student.nutritionConsultations.slice(0, 5).map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{consultation.consultationType}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(consultation.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(consultation.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/nutrition-consultations/${consultation.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                  {student.nutritionConsultations.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/dashboard/nutrition-consultations?student=${student.id}`)}
                    >
                      View All Consultations ({student._count?.nutritionConsultations || 0})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Consultations</h3>
                  <p className="text-muted-foreground">No nutrition consultations recorded yet.</p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push(`/dashboard/nutrition-consultations/create?student=${student.id}`)}
                  >
                    Schedule Consultation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nutrition Consultations</span>
                <Badge variant="secondary">{student._count?.nutritionConsultations || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Feedback Records</span>
                <Badge variant="secondary">{student._count?.feedback || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Registration Status</span>
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
                onClick={() => router.push(`/dashboard/nutrition-consultations/create?student=${student.id}`)}
              >
                <Activity className="mr-2 h-4 w-4" />
                Schedule Consultation
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/dashboard/feedback/create?student=${student.id}`)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Add Feedback
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/dashboard/students/${student.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Student
              </Button>
            </CardContent>
          </Card>

          {/* Student Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border p-3">
                  <h4 className="font-medium mb-2">Nutrition Program</h4>
                  <p className="text-muted-foreground">
                    Students receive regular nutrition consultations and meal programs based on their age and grade level.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <h4 className="font-medium mb-2">Health Monitoring</h4>
                  <p className="text-muted-foreground">
                    Regular health check-ups and nutrition assessments to ensure optimal growth and development.
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
