export interface School {
  id: string
  name: string
  principalName: string
  principalPhone: string
  address: string
  totalStudents: number
  notes?: string
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt: string
  _count?: {
    students: number
    classes: number
    deliveries: number
  }
  students?: Array<{
    id: string
    name: string
    grade: string
  }>
  classes?: Array<{
    id: string
    name: string
    grade: number
  }>
}

export interface SchoolFilters {
  searchTerm: string
  selectedGrade: 'all' | string
  selectedRegion: 'all' | string
}

export interface SchoolStats {
  totalSchools: number
  totalStudents: number
  totalClasses: number
  averageStudentsPerSchool: number
  schoolsWithClasses: number
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
  itemsPerPage: number
}

export interface SchoolsResponse {
  success: boolean
  data: School[]
  stats: SchoolStats
  pagination: PaginationData
  error?: string
}

export interface FilterState {
  searchTerm: string
  selectedGrade: string
  selectedRegion: string
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
}
