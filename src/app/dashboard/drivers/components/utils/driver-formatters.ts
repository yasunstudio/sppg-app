import type { Driver } from './driver-types'

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateLong = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatPhoneNumber = (phone: string) => {
  // Format Indonesian phone number
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('62')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`
  }
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`
  }
  return phone
}

export const getStatusColor = (isActive: boolean) => {
  return isActive 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-red-100 text-red-800 border-red-200'
}

export const getStatusText = (isActive: boolean) => {
  return isActive ? 'Aktif' : 'Tidak Aktif'
}

export const formatLicenseType = (licenseType: string) => {
  switch (licenseType) {
    case 'SIM_A':
      return 'SIM A'
    case 'SIM_B1':
      return 'SIM B1'
    case 'SIM_B2':
      return 'SIM B2'
    case 'SIM_C':
      return 'SIM C'
    case 'SIM_D':
      return 'SIM D'
    default:
      return licenseType
  }
}

export const isLicenseExpiringSoon = (expiryDate: string, daysThreshold = 30) => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= daysThreshold && diffDays > 0
}

export const isLicenseExpired = (expiryDate: string) => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  return expiry < today
}

export const calculateStats = (drivers: Driver[]) => {
  const totalDrivers = drivers.length
  const activeDrivers = drivers.filter(d => d.isActive).length
  const inactiveDrivers = totalDrivers - activeDrivers
  const totalDeliveries = drivers.reduce((sum, d) => sum + d.totalDeliveries, 0)
  
  const expiringSoonCount = drivers.filter(d => isLicenseExpiringSoon(d.licenseExpiry)).length

  return {
    totalDrivers,
    activeDrivers,
    inactiveDrivers,
    totalDeliveries,
    expiringSoonCount
  }
}

export const filterDrivers = (drivers: Driver[], searchTerm: string) => {
  if (!searchTerm) return drivers
  
  const term = searchTerm.toLowerCase()
  return drivers.filter(driver =>
    driver.name.toLowerCase().includes(term) ||
    driver.employeeId.toLowerCase().includes(term) ||
    driver.phone.toLowerCase().includes(term) ||
    driver.email?.toLowerCase().includes(term) ||
    driver.licenseNumber.toLowerCase().includes(term)
  )
}

export const sortDrivers = (drivers: Driver[], sortBy: string, sortOrder: 'asc' | 'desc') => {
  return [...drivers].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'employeeId':
        aValue = a.employeeId
        bValue = b.employeeId
        break
      case 'totalDeliveries':
        aValue = a.totalDeliveries
        bValue = b.totalDeliveries
        break
      case 'licenseExpiry':
        aValue = new Date(a.licenseExpiry)
        bValue = new Date(b.licenseExpiry)
        break
      case 'createdAt':
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
      default:
        aValue = a.name
        bValue = b.name
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
}
