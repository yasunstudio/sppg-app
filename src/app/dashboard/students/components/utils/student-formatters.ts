import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

/**
 * Format student name with proper capitalization
 */
export function formatStudentName(name: string): string {
  if (!name) return '-'
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format NISN with proper spacing
 */
export function formatNISN(nisn: string): string {
  if (!nisn) return '-'
  
  // Add spacing every 4 digits: 1234567890 -> 1234 5678 90
  return nisn.replace(/(\d{4})(?=\d)/g, '$1 ')
}

/**
 * Format parent name
 */
export function formatParentName(parentName: string): string {
  if (!parentName) return '-'
  
  return formatStudentName(parentName)
}

/**
 * Format student age with unit
 */
export function formatAge(age: number): string {
  if (!age || age < 0) return '-'
  
  return `${age} tahun`
}

/**
 * Format grade display
 */
export function formatGrade(grade: string): string {
  if (!grade) return '-'
  
  // Handle various grade formats
  if (grade.match(/^\d+$/)) {
    return `Kelas ${grade}`
  }
  
  if (grade.match(/^\d+[A-Z]$/)) {
    return `Kelas ${grade}`
  }
  
  return grade
}

/**
 * Format gender display
 */
export function formatGender(gender: 'MALE' | 'FEMALE'): string {
  const genderMap = {
    MALE: 'Laki-laki',
    FEMALE: 'Perempuan'
  }
  
  return genderMap[gender] || '-'
}

/**
 * Format allergies for display
 */
export function formatAllergies(allergies: string): string {
  if (!allergies) return 'Tidak ada alergi'
  
  // Split by common separators and clean up
  const allergyList = allergies
    .split(/[,;|\n]/)
    .map(allergy => allergy.trim())
    .filter(allergy => allergy.length > 0)
    .map(allergy => allergy.charAt(0).toUpperCase() + allergy.slice(1).toLowerCase())
  
  if (allergyList.length === 0) return 'Tidak ada alergi'
  
  return allergyList.join(', ')
}

/**
 * Format school name with truncation
 */
export function formatSchoolName(schoolName: string, maxLength: number = 30): string {
  if (!schoolName) return '-'
  
  if (schoolName.length <= maxLength) {
    return schoolName
  }
  
  return `${schoolName.substring(0, maxLength)}...`
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  if (!date) return '-'
  
  try {
    return format(new Date(date), 'dd MMM yyyy', { locale: idLocale })
  } catch {
    return '-'
  }
}

/**
 * Format datetime for display
 */
export function formatDateTime(date: string | Date): string {
  if (!date) return '-'
  
  try {
    return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: idLocale })
  } catch {
    return '-'
  }
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: string | Date): string {
  if (!date) return '-'
  
  try {
    const now = new Date()
    const targetDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Baru saja'
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24)
      return `${days} hari yang lalu`
    } else {
      return formatDate(date)
    }
  } catch {
    return '-'
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text) return '-'
  
  if (text.length <= maxLength) {
    return text
  }
  
  return `${text.substring(0, maxLength)}...`
}

/**
 * Get student initials for avatar
 */
export function getStudentInitials(name: string): string {
  if (!name) return '??'
  
  const names = name.trim().split(' ')
  
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase()
  }
  
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
}

/**
 * Format consultation status
 */
export function formatConsultationStatus(status: string): {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
} {
  const statusMap = {
    PENDING: { label: 'Menunggu', variant: 'outline' as const },
    IN_PROGRESS: { label: 'Berlangsung', variant: 'default' as const },
    COMPLETED: { label: 'Selesai', variant: 'secondary' as const },
    CANCELLED: { label: 'Dibatalkan', variant: 'destructive' as const }
  }
  
  return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' }
}

/**
 * Format feedback rating
 */
export function formatRating(rating: number | null | undefined): string {
  if (!rating || rating < 1 || rating > 5) return '-'
  
  return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
}

/**
 * Format count with proper pluralization
 */
export function formatCount(count: number, singular: string, plural: string): string {
  if (count === 0) return `Tidak ada ${singular}`
  if (count === 1) return `1 ${singular}`
  return `${count.toLocaleString('id-ID')} ${plural}`
}

/**
 * Format student summary for cards
 */
export function formatStudentSummary(student: any): {
  title: string
  subtitle: string
  details: string[]
} {
  return {
    title: formatStudentName(student.name),
    subtitle: `${formatNISN(student.nisn)} • ${formatGrade(student.grade)}`,
    details: [
      formatAge(student.age),
      formatGender(student.gender),
      student.school?.name ? formatSchoolName(student.school.name, 20) : 'Sekolah tidak diketahui'
    ]
  }
}

/**
 * Determine age group for filtering
 */
export function getAgeGroup(age: number): string {
  if (age >= 5 && age <= 6) return '5-6'
  if (age >= 7 && age <= 8) return '7-8'
  if (age >= 9 && age <= 10) return '9-10'
  if (age >= 11 && age <= 12) return '11-12'
  if (age >= 13) return '13+'
  return 'unknown'
}

/**
 * Parse age range from filter
 */
export function parseAgeRange(ageRange: string): { min: number; max: number } | null {
  if (ageRange === 'all' || !ageRange) return null
  
  const ageRangeMap = {
    '5-6': { min: 5, max: 6 },
    '7-8': { min: 7, max: 8 },
    '9-10': { min: 9, max: 10 },
    '11-12': { min: 11, max: 12 },
    '13+': { min: 13, max: 99 }
  }
  
  return ageRangeMap[ageRange as keyof typeof ageRangeMap] || null
}
