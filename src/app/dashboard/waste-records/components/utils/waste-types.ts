// Waste Management Types
export interface WasteRecord {
  id: string
  recordDate: string
  wasteType: 'ORGANIC' | 'INORGANIC' | 'PACKAGING'
  source: 'PREPARATION' | 'PRODUCTION' | 'PACKAGING' | 'SCHOOL_LEFTOVER' | 'EXPIRED_MATERIAL'
  weight: number
  notes?: string | null
  school?: {
    id: string
    name: string
    address: string
  } | null
  createdAt: string
  updatedAt: string
}

// Keep alias for backward compatibility
export type Waste = WasteRecord

export interface WasteStats {
  total: number
  totalWeight: number
  byType: Record<string, { count: number; weight: number }>
  bySource: Record<string, { count: number; weight: number }>
  recent30Days: number
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  limit: number
}

export interface WasteRecordsResponse {
  success: boolean
  data: WasteRecord[]
  stats: WasteStats
  pagination: PaginationData
}

// Keep alias for backward compatibility
export type WastesResponse = WasteRecordsResponse

export interface FilterState {
  searchTerm: string
  selectedWasteType: string
  selectedSource: string
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
}
