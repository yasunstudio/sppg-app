// Class types - Updated to match Prisma schema and API
export interface Class {
  id: string
  name: string
  grade: number
  capacity: number
  currentCount: number
  teacherName?: string | null
  notes?: string | null
  schoolId: string
  createdAt: string     // API returns ISO string
  updatedAt: string     // API returns ISO string
  deletedAt?: string | null
  school?: {            // Added to match API response with include
    id: string
    name: string
  }
}

export interface ClassStats {
  totalClasses: number
  totalStudents: number
  averageCapacity: number
  occupancyRate: number
}

export interface ClassFilters {
  searchTerm: string
  selectedGrade: string
  selectedSchool: string
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
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

// API response types - Updated to match actual API structure
export interface ClassesApiResponse {
  classes: Class[]
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
