export interface Student {
  id: string
  nisn: string
  name: string
  age: number
  gender: 'MALE' | 'FEMALE'
  grade: string
  parentName: string
  notes?: string | null
  schoolId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  school?: {
    id: string
    name: string
    address?: string
    principalName?: string
  }
  _count?: {
    nutritionConsultations: number
    feedback: number
  }
  nutritionConsultations?: Array<{
    id: string
    question: string
    answer?: string
    status: string
    createdAt: string
  }>
  feedback?: Array<{
    id: string
    type: string
    rating?: number
    message: string
    createdAt: string
  }>
}

export interface StudentFilters {
  searchTerm: string
  selectedGrade: 'all' | string
  selectedGender: 'all' | 'MALE' | 'FEMALE'
  selectedSchool: 'all' | string
  selectedAge: 'all' | string
}

export interface StudentStats {
  totalStudents: number
  totalMaleStudents: number
  totalFemaleStudents: number
  averageAge: number
  totalSchools: number
  studentsWithConsultations: number
  recentConsultations: number
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
  itemsPerPage: number
}

export interface StudentsResponse {
  success: boolean
  data: Student[]
  pagination: PaginationData
  error?: string
}

export interface StudentStatsResponse {
  success: boolean
  data: StudentStats
  error?: string
}

export interface StudentResponse {
  success: boolean
  data: Student
  error?: string
}

// For forms
export interface StudentCreateInput {
  nisn: string
  name: string
  age: number
  gender: 'MALE' | 'FEMALE'
  grade: string
  parentName: string
  schoolId: string
  notes?: string | null
}

export interface StudentUpdateInput extends StudentCreateInput {
  id: string
}

// Grade options for forms
export const GRADE_OPTIONS = [
  { value: '1', label: 'Kelas 1' },
  { value: '2', label: 'Kelas 2' },
  { value: '3', label: 'Kelas 3' },
  { value: '4', label: 'Kelas 4' },
  { value: '5', label: 'Kelas 5' },
  { value: '6', label: 'Kelas 6' },
  { value: '1A', label: 'Kelas 1A' },
  { value: '1B', label: 'Kelas 1B' },
  { value: '2A', label: 'Kelas 2A' },
  { value: '2B', label: 'Kelas 2B' },
  { value: '3A', label: 'Kelas 3A' },
  { value: '3B', label: 'Kelas 3B' },
  { value: '4A', label: 'Kelas 4A' },
  { value: '4B', label: 'Kelas 4B' },
  { value: '5A', label: 'Kelas 5A' },
  { value: '5B', label: 'Kelas 5B' },
  { value: '6A', label: 'Kelas 6A' },
  { value: '6B', label: 'Kelas 6B' },
]

// Gender options for forms
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Laki-laki' },
  { value: 'FEMALE', label: 'Perempuan' },
]

// Age range options for filtering
export const AGE_OPTIONS = [
  { value: '5-6', label: '5-6 tahun' },
  { value: '7-8', label: '7-8 tahun' },
  { value: '9-10', label: '9-10 tahun' },
  { value: '11-12', label: '11-12 tahun' },
  { value: '13+', label: '13+ tahun' },
]
