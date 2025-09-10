/**
 * Format phone number untuk display
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format Indonesian phone number
  if (cleaned.startsWith('62')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`
  }
  
  return phone
}

/**
 * Format date untuk display
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * Format date untuk display singkat
 */
export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * Format student count
 */
export const formatStudentCount = (count: number): string => {
  if (count === 0) return 'Belum ada siswa'
  if (count === 1) return '1 siswa'
  return `${count.toLocaleString('id-ID')} siswa`
}

/**
 * Format class count
 */
export const formatClassCount = (count: number): string => {
  if (count === 0) return 'Belum ada kelas'
  if (count === 1) return '1 kelas'
  return `${count.toLocaleString('id-ID')} kelas`
}

/**
 * Format coordinates
 */
export const formatCoordinates = (lat?: number | null, lng?: number | null): string => {
  if (!lat || !lng) return 'Koordinat tidak tersedia'
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

/**
 * Get grade badge variant
 */
export const getGradeBadgeVariant = (grade: string): string => {
  const gradeNum = parseInt(grade)
  if (gradeNum <= 2) return 'bg-green-100 text-green-800 border-green-200'
  if (gradeNum <= 4) return 'bg-blue-100 text-blue-800 border-blue-200'
  return 'bg-purple-100 text-purple-800 border-purple-200'
}

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Get school initials for avatar
 */
export const getSchoolInitials = (name: string): string => {
  if (!name) return 'S'
  
  const words = name.split(' ')
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  
  return words.slice(0, 2).map(word => word[0]).join('').toUpperCase()
}
