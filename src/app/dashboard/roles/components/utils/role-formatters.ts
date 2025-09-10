import type { Role } from './role-types'

// Role formatters
export const formatRoleName = (name: string): string => {
  // Capitalize first letter and format common role names
  const roleMap = {
    'admin': 'Administrator',
    'user': 'Pengguna',
    'chef': 'Chef',
    'nutritionist': 'Ahli Gizi',
    'manager': 'Manajer',
    'operator': 'Operator',
    'viewer': 'Pengamat'
  }
  
  const lowerName = name.toLowerCase()
  return roleMap[lowerName as keyof typeof roleMap] || 
         name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

// Permission formatters
export const formatPermission = (permission: string): string => {
  const permissionMap = {
    'manage_users': 'Kelola Pengguna',
    'manage_roles': 'Kelola Role',
    'manage_schools': 'Kelola Sekolah', 
    'manage_students': 'Kelola Siswa',
    'manage_suppliers': 'Kelola Supplier',
    'manage_vehicles': 'Kelola Kendaraan',
    'manage_waste_records': 'Kelola Data Sampah',
    'manage_system_config': 'Kelola Konfigurasi Sistem',
    'view_reports': 'Lihat Laporan',
    'view_analytics': 'Lihat Analitik'
  }
  
  return permissionMap[permission as keyof typeof permissionMap] || 
         permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Role type formatter
export const formatRoleType = (role: Role): string => {
  // Determine if it's a system role or custom role
  const systemRoles = ['admin', 'chef', 'nutritionist', 'user']
  const isSystemRole = systemRoles.includes(role.name.toLowerCase())
  
  return isSystemRole ? 'System Role' : 'Custom Role'
}

// Permission count formatter
export const formatPermissionCount = (count: number): string => {
  if (count === 0) return 'Tidak ada permission'
  if (count === 1) return '1 permission'
  return `${count} permissions`
}

// User count formatter
export const formatUserCount = (count: number): string => {
  if (count === 0) return 'Tidak ada pengguna'
  if (count === 1) return '1 pengguna'
  return `${count} pengguna`
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

// Time ago formatter
export const formatTimeAgo = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) return 'Baru saja'
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays < 7) return `${diffDays} hari yang lalu`
  
  return formatDate(dateObj)
}

// Permission badge variant
export const getPermissionBadgeVariant = (permission: string): "default" | "secondary" | "destructive" => {
  if (permission.includes('manage_')) return 'default'
  if (permission.includes('view_')) return 'secondary'
  return 'default'
}

// Role badge variant based on type
export const getRoleBadgeVariant = (role: Role): "default" | "secondary" | "outline" => {
  const type = formatRoleType(role)
  if (type === 'System Role') return 'default'
  return 'secondary'
}
