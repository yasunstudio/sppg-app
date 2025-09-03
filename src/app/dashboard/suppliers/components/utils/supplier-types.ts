export interface Supplier {
  id: string
  name: string
  contactName: string
  phone: string
  email: string | null
  address: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    purchaseOrders: number
    inventory: number
  }
}

export interface SupplierStats {
  totalSuppliers: number
  activeSuppliers: number
  inactiveSuppliers: number
  totalPurchaseOrders: number
  averageOrdersPerSupplier: number
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
}

export interface SuppliersResponse {
  success: boolean
  data: Supplier[]
  stats: SupplierStats
  pagination: PaginationData
}

export interface FilterState {
  searchTerm: string
  selectedStatus: string
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
}
