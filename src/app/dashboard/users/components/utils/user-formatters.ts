import type { User } from './user-types'

export const formatUserRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    'SUPER_ADMIN': 'Super Admin',
    'ADMIN': 'Admin',
    'CHEF': 'Chef',
    'NUTRITIONIST': 'Nutritionist',
    'VIEWER': 'Viewer'
  }
  return roleMap[role] || role
}

export const formatUserStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'Aktif',
    'INACTIVE': 'Tidak Aktif',
    'SUSPENDED': 'Ditangguhkan'
  }
  return statusMap[status] || status
}

export const getUserRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    'SUPER_ADMIN': 'bg-purple-100 text-purple-800 border-purple-200',
    'ADMIN': 'bg-blue-100 text-blue-800 border-blue-200',
    'CHEF': 'bg-green-100 text-green-800 border-green-200',
    'NUTRITIONIST': 'bg-orange-100 text-orange-800 border-orange-200',
    'VIEWER': 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colorMap[role] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export const getUserStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'ACTIVE': 'bg-green-100 text-green-800 border-green-200',
    'INACTIVE': 'bg-gray-100 text-gray-800 border-gray-200',
    'SUSPENDED': 'bg-red-100 text-red-800 border-red-200'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return dateString
  }
}

export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    return dateString
  }
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
