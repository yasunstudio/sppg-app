import type { Class } from './class-types'

// Class name formatters
export const formatClassName = (name: string, grade: number): string => {
  return `${name} (Kelas ${grade})`
}

// Capacity formatters
export const formatCapacity = (currentCount: number, capacity: number): string => {
  return `${currentCount}/${capacity} siswa`
}

export const formatCapacityPercentage = (currentCount: number, capacity: number): number => {
  return Math.round((currentCount / capacity) * 100)
}

// Grade level formatter
export const formatGradeLevel = (grade: number): string => {
  return `Kelas ${grade}`
}

// Teacher name formatter
export const formatTeacherName = (teacherName?: string | null): string => {
  return teacherName || 'Belum ditentukan'
}

// Class status formatter based on capacity
export const formatClassStatus = (currentCount: number, capacity: number): 'active' | 'full' | 'available' => {
  if (currentCount >= capacity) return 'full'
  if (currentCount > 0) return 'active'
  return 'available'
}

export const formatClassStatusText = (status: 'active' | 'full' | 'available'): string => {
  switch (status) {
    case 'full':
      return 'Penuh'
    case 'active':
      return 'Aktif'
    case 'available':
      return 'Tersedia'
    default:
      return 'Tidak Diketahui'
  }
}

// Date formatters - Handle both Date objects and ISO strings
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// School name formatter
export const formatSchoolName = (school?: { id: string; name: string } | null): string => {
  return school?.name || 'Sekolah tidak diketahui'
}

// Notes formatter
export const formatNotes = (notes?: string | null): string => {
  return notes || 'Tidak ada catatan'
}

export const getCapacityColor = (enrolled: number, capacity: number): string => {
  const percentage = (enrolled / capacity) * 100
  if (percentage >= 90) return 'text-red-600'
  if (percentage >= 75) return 'text-yellow-600'
  return 'text-green-600'
}

export const getCapacityBgColor = (enrolled: number, capacity: number): string => {
  const percentage = (enrolled / capacity) * 100
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 75) return 'bg-yellow-500'
  return 'bg-green-500'
}

export const getStatusBadgeVariant = (status: 'active' | 'full' | 'available'): 'default' | 'destructive' | 'secondary' => {
  switch (status) {
    case 'full':
      return 'destructive'
    case 'active':
      return 'default'
    case 'available':
      return 'secondary'
    default:
      return 'secondary'
  }
}
