// Waste Data Formatters & Utilities

export const getWasteTypeColor = (type: string) => {
  switch (type) {
    case 'ORGANIC':
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
    case 'INORGANIC':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
    case 'PACKAGING':
      return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
  }
}

export const getSourceColor = (source: string) => {
  switch (source) {
    case 'PREPARATION':
      return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
    case 'PRODUCTION':
      return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
    case 'PACKAGING':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800'
    case 'SCHOOL_LEFTOVER':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
    case 'EXPIRED_MATERIAL':
      return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
  }
}

export const formatWasteType = (type: string) => {
  switch (type) {
    case 'ORGANIC':
      return 'Organik'
    case 'INORGANIC':
      return 'Anorganik'
    case 'PACKAGING':
      return 'Kemasan'
    default:
      return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }
}

export const formatSource = (source: string) => {
  switch (source) {
    case 'PREPARATION':
      return 'Persiapan'
    case 'PRODUCTION':
      return 'Produksi'
    case 'PACKAGING':
      return 'Pengemasan'
    case 'SCHOOL_LEFTOVER':
      return 'Sisa Sekolah'
    case 'EXPIRED_MATERIAL':
      return 'Bahan Kadaluarsa'
    default:
      return source.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID')
}
