import type { User } from './user-types'

// User name formatters
export const formatUserName = (user: User): string => {
  return user.name || 'Nama tidak tersedia'
}

// Add fullName for form compatibility
export const formatUserForForm = (user: User): User & { fullName: string } => {
  return {
    ...user,
    fullName: user.name
  }
}

// Convert form data to API data
export const mapFormToApiData = (formData: { fullName?: string; [key: string]: any }) => {
  const { fullName, ...rest } = formData
  return {
    ...rest,
    name: fullName
  }
}

// User status formatters
export const formatUserStatus = (isActive: boolean): string => {
  return isActive ? 'Aktif' : 'Tidak Aktif'
}

// Email verification formatter
export const formatEmailVerification = (emailVerified: string | null | undefined): string => {
  return emailVerified ? 'Terverifikasi' : 'Belum Terverifikasi'
}

// User role formatters
export const formatUserRole = (roles: User['roles']): string => {
  if (!roles || roles.length === 0) return 'Belum ada role'
  if (roles.length === 1) return roles[0].role.name
  return `${roles[0].role.name} +${roles.length - 1} lainnya`
}

export const formatUserRoles = (roles: User['roles']): string[] => {
  if (!roles || roles.length === 0) return []
  return roles.map(userRole => userRole.role.name)
}

// Phone number formatter
export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return '-'
  
  // Remove country code if exists and format
  const cleaned = phone.replace(/^\+62|^62/, '0')
  
  // Format: 0812-3456-7890
  if (cleaned.length >= 10) {
    return cleaned.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')
  }
  
  return cleaned
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

export const formatRelativeTime = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Baru saja'
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays < 30) return `${diffDays} hari yang lalu`
  
  return formatDate(dateObj)
}

// Get user initials for avatar
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Status color helpers
export const getStatusColor = (isActive: boolean): string => {
  return isActive 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-red-100 text-red-800 border-red-200'
}

export const getRoleColor = (roleName: string): string => {
  const roleColors = {
    'ADMIN': 'bg-purple-100 text-purple-800 border-purple-200',
    'CHEF': 'bg-orange-100 text-orange-800 border-orange-200',
    'NUTRITIONIST': 'bg-green-100 text-green-800 border-green-200',
    'SUPPLIER': 'bg-blue-100 text-blue-800 border-blue-200',
    'DRIVER': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'STAFF': 'bg-gray-100 text-gray-800 border-gray-200'
  }
  
  return roleColors[roleName as keyof typeof roleColors] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Format counts/statistics
export const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
