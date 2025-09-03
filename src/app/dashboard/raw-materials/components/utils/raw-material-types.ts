export interface RawMaterial {
  id: string
  name: string
  category: string
  unit: string
  minimumStock: number
  currentStock: number
  costPerUnit: number
  supplier?: {
    id: string
    name: string
  }
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    inventory: number
    menuItemIngredients: number
  }
}

export interface RawMaterialStats {
  total: number
  lowStock: number
  categories: number
  totalValue: number
}

export interface FilterState {
  searchTerm: string
  selectedCategory: string
  selectedStatus: string
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
}

export interface PaginationData {
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  limit: number
}

export type ViewMode = 'table' | 'grid'

export interface UseRawMaterialsParams {
  filters: FilterState
  pagination: PaginationState
}

export interface UseRawMaterialsReturn {
  rawMaterials: RawMaterial[]
  stats: RawMaterialStats | null
  paginationData: PaginationData | null
  loading: boolean
  isFiltering: boolean
  deleteRawMaterial: (id: string) => Promise<boolean>
  refetch: () => void
}
