import type { UserRole } from './user-role-types'

export const formatRoleName = (roleName: string): string => {
  const roleMap: Record<string, string> = {
    'SUPER_ADMIN': 'Super Admin',
    'ADMIN': 'Admin',
    'CHEF': 'Chef',
    'NUTRITIONIST': 'Nutritionist',
    'PRODUCTION_STAFF': 'Production Staff',
    'QUALITY_CONTROL': 'Quality Control',
    'WAREHOUSE_MANAGER': 'Warehouse Manager',
    'VIEWER': 'Viewer'
  }
  return roleMap[roleName] || roleName
}

export const formatUserRoleStatus = (isActive: boolean): string => {
  return isActive ? 'Aktif' : 'Tidak Aktif'
}

export const getRoleColor = (roleName: string): string => {
  const colorMap: Record<string, string> = {
    'SUPER_ADMIN': 'bg-purple-100 text-purple-800 border-purple-200',
    'ADMIN': 'bg-blue-100 text-blue-800 border-blue-200',
    'CHEF': 'bg-green-100 text-green-800 border-green-200',
    'NUTRITIONIST': 'bg-orange-100 text-orange-800 border-orange-200',
    'PRODUCTION_STAFF': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'QUALITY_CONTROL': 'bg-red-100 text-red-800 border-red-200',
    'WAREHOUSE_MANAGER': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'VIEWER': 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colorMap[roleName] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export const getStatusColor = (isActive: boolean): string => {
  return isActive 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-red-100 text-red-800 border-red-200'
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

export const formatPermissionCount = (permissions: string[]): string => {
  const count = permissions.length
  return `${count} ${count === 1 ? 'permission' : 'permissions'}`
}
