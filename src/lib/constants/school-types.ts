// School types constants
export const SCHOOL_TYPES = {
  SD: 'SD',
  SMP: 'SMP', 
  SMA: 'SMA',
  SMK: 'SMK'
} as const

export const SCHOOL_TYPE_LABELS = {
  SD: 'Sekolah Dasar',
  SMP: 'SMP',
  SMA: 'SMA',
  SMK: 'SMK'
} as const

export const SCHOOL_TYPE_COLORS = {
  SD: 'bg-blue-100 text-blue-800',
  SMP: 'bg-purple-100 text-purple-800',
  SMA: 'bg-indigo-100 text-indigo-800',
  SMK: 'bg-orange-100 text-orange-800'
} as const

// School status constants
export const SCHOOL_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING'
} as const

export const SCHOOL_STATUS_LABELS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Tidak Aktif',
  PENDING: 'Pending'
} as const

export const SCHOOL_STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-red-100 text-red-800',
  PENDING: 'bg-yellow-100 text-yellow-800'
} as const

// Student status constants
export const STUDENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  GRADUATED: 'GRADUATED'
} as const

export const STUDENT_STATUS_LABELS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Tidak Aktif',
  GRADUATED: 'Lulus'
} as const

export const STUDENT_STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-red-100 text-red-800',
  GRADUATED: 'bg-blue-100 text-blue-800'
} as const

// Student gender constants
export const STUDENT_GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
} as const

export const STUDENT_GENDER_LABELS = {
  MALE: 'Laki-laki',
  FEMALE: 'Perempuan'
} as const

// Class status constants
export const CLASS_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const

export const CLASS_STATUS_LABELS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Tidak Aktif'
} as const

export const CLASS_STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-red-100 text-red-800'
} as const

// Grade levels
export const GRADE_LEVELS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Kelas ${i + 1}`
}))

// Helper functions
export function getSchoolTypeLabel(type: keyof typeof SCHOOL_TYPE_LABELS) {
  return SCHOOL_TYPE_LABELS[type] || type
}

export function getSchoolTypeColor(type: keyof typeof SCHOOL_TYPE_COLORS) {
  return SCHOOL_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800'
}

export function getSchoolStatusLabel(status: keyof typeof SCHOOL_STATUS_LABELS) {
  return SCHOOL_STATUS_LABELS[status] || status
}

export function getSchoolStatusColor(status: keyof typeof SCHOOL_STATUS_COLORS) {
  return SCHOOL_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
}

export function getStudentStatusLabel(status: keyof typeof STUDENT_STATUS_LABELS) {
  return STUDENT_STATUS_LABELS[status] || status
}

export function getStudentStatusColor(status: keyof typeof STUDENT_STATUS_COLORS) {
  return STUDENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
}

export function getStudentGenderLabel(gender: keyof typeof STUDENT_GENDER_LABELS) {
  return STUDENT_GENDER_LABELS[gender] || gender
}

export function getClassStatusLabel(status: keyof typeof CLASS_STATUS_LABELS) {
  return CLASS_STATUS_LABELS[status] || status
}

export function getClassStatusColor(status: keyof typeof CLASS_STATUS_COLORS) {
  return CLASS_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
}
