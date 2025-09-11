// Class types - Updated to match API schema and vehicles pattern
export interface Class {
  id: string
  name: string
  grade: number
  capacity: number
  teacherName?: string | null
  notes?: string | null
  schoolId: string
  createdAt: string     // API returns ISO string
  updatedAt: string     // API returns ISO string
  school?: {            // Added to match API response with include
    id: string
    name: string
  }
}

export interface ClassStats {
  totalClasses: number
  totalStudents: number
  totalCapacity: number
  averageCapacity: number
  occupancyRate: number
  gradeBreakdown?: Array<{
    grade: string
    count: number
    percentage: number
  }>
}

export interface ClassFilters {
  searchTerm: string
  selectedGrade: string
  selectedSchool: string
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
  itemsPerPage: number
}

// Class form types
export interface CreateClassData {
  name: string
  grade: number
  schoolId: string
  capacity?: number    // Optional with default 25
  teacherName?: string | null
  notes?: string | null
}

export interface UpdateClassData extends Partial<CreateClassData> {
  id: string
}

// API response types - Updated to match vehicles pattern
export interface ClassesApiResponse {
  success: boolean
  data: Class[]
  stats: ClassStats
  pagination: PaginationData
}

export interface ClassApiResponse {
  success: boolean
  data: Class
}

export interface ClassDeleteResponse {
  success: boolean
  message: string
}
