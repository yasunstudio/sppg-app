import { Badge } from '@/components/ui/badge'

export const formatSupplierStatus = (isActive: boolean) => {
  return isActive ? (
    <Badge variant="default" className="bg-green-500 dark:bg-green-600 text-white">
      Aktif
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-red-500 dark:bg-red-600 text-white">
      Tidak Aktif
    </Badge>
  )
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const formatPhone = (phone: string) => {
  // Format phone number to Indonesian format
  if (phone.startsWith('0')) {
    return phone.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  if (phone.startsWith('+62')) {
    return phone.replace(/(\+62)(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')
  }
  return phone
}

export const truncateText = (text: string, maxLength: number = 30) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const SUPPLIER_STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak Aktif' }
]
