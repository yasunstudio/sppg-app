"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  X,
  Download,
  School,
  GraduationCap,
  UserCheck,
  Building
} from "lucide-react"
import { toast } from "sonner"

interface ClassData {
  id: string
  name: string
  grade: number
  capacity: number
  currentCount: number
  teacherName?: string | null
  notes?: string | null
  schoolId: string
  createdAt: string
  updatedAt: string
  school: {
    id: string
    name: string
  }
}

interface School {
  id: string
  name: string
}

const itemsPerPage = 10

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

export function ClassesManagement() {
  const router = useRouter()
  const [classes, setClasses] = useState<ClassData[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [schoolFilter, setSchoolFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Stats state
  const [totalClasses, setTotalClasses] = useState(0)
  const [totalCapacity, setTotalCapacity] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalSchools, setTotalSchools] = useState(0)

  useEffect(() => {
    fetchClasses()
    fetchSchools()
  }, [currentPage, searchTerm, schoolFilter, gradeFilter])

  useEffect(() => {
    calculateStats()
  }, [classes])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
      })

      // Only add filter params if they're not "all"
      if (schoolFilter && schoolFilter !== "all") {
        params.append('schoolId', schoolFilter)
      }
      if (gradeFilter && gradeFilter !== "all") {
        params.append('grade', gradeFilter)
      }

      const response = await fetch(`/api/classes?${params}`)
      if (response.ok) {
        const result = await response.json()
        setClasses(result.classes)
        setTotalPages(result.pagination.pages)
        setTotalCount(result.pagination.total)
      } else {
        toast.error('Failed to fetch classes')
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      toast.error('Failed to fetch classes')
    } finally {
      setLoading(false)
    }
  }

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools?limit=100')
      if (response.ok) {
        const result = await response.json()
        setSchools(result.data || result)
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
    }
  }

  const calculateStats = () => {
    const uniqueSchools = new Set(classes.map(cls => cls.schoolId))
    setTotalClasses(classes.length)
    setTotalCapacity(classes.reduce((sum, cls) => sum + cls.capacity, 0))
    setTotalStudents(classes.reduce((sum, cls) => sum + cls.currentCount, 0))
    setTotalSchools(uniqueSchools.size)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete class "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Class deleted successfully')
        fetchClasses()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete class')
      }
    } catch (error) {
      console.error('Error deleting class:', error)
      toast.error('Failed to delete class')
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSchoolFilter("all")
    setGradeFilter("all")
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
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
      return <Badge variant="destructive">Full ({current}/{capacity})</Badge>
    } else if (percentage >= 75) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        Near Full ({current}/{capacity})
      </Badge>
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        Available ({current}/{capacity})
      </Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes Management</h1>
          <p className="text-muted-foreground">
            Manage classroom organization and student assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => {/* TODO: Export functionality */}}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/dashboard/classes/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Active classrooms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity}</div>
            <p className="text-xs text-muted-foreground">
              Maximum students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Current enrollment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSchools}</div>
            <p className="text-xs text-muted-foreground">
              Participating schools
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Classes</CardTitle>
          <CardDescription>
            Search and filter classes by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by class name or teacher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={schoolFilter} onValueChange={setSchoolFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {Array.from({length: 12}, (_, i) => i + 1).map((grade) => (
                  <SelectItem key={grade} value={grade.toString()}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || schoolFilter !== "all" || gradeFilter !== "all") && (
              <Button variant="outline" onClick={resetFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Classes List</CardTitle>
          <CardDescription>
            A comprehensive list of all registered classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Info</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading classes...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <span className="text-muted-foreground">No classes found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{classItem.name}</p>
                          {classItem.notes && (
                            <p className="text-sm text-muted-foreground">{classItem.notes}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getGradeBadge(classItem.grade)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{classItem.school.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {classItem.teacherName ? (
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{classItem.teacherName}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No teacher assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getCapacityStatus(classItem.currentCount, classItem.capacity)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(classItem.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/classes/${classItem.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/classes/${classItem.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit class
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(classItem.id, classItem.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete class
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalCount)} of{' '}
                {totalCount} classes
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
