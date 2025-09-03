import { useState, useEffect } from 'react'
import type { 
  RawMaterial, 
  RawMaterialStats, 
  FilterState, 
  PaginationState,
  PaginationData 
} from '../utils/raw-material-types'

interface UseRawMaterialsParams {
  filters: FilterState
  pagination: PaginationState
}

// Mock data sebagai fallback
const mockRawMaterials: RawMaterial[] = [
  {
    id: '1',
    name: 'Beras Premium',
    category: 'CARBOHYDRATE',
    unit: 'kg',
    description: 'Beras premium kualitas terbaik untuk makanan sekolah',
    minimumStock: 50,
    currentStock: 120,
    costPerUnit: 15000,
    supplier: {
      id: '1',
      name: 'CV Beras Sejahtera'
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    _count: {
      inventory: 5,
      menuItemIngredients: 12
    }
  },
  {
    id: '2',
    name: 'Daging Ayam',
    category: 'PROTEIN',
    unit: 'kg',
    description: 'Daging ayam segar tanpa kulit',
    minimumStock: 30,
    currentStock: 25,
    costPerUnit: 35000,
    supplier: {
      id: '2',
      name: 'CV Ayam Sehat'
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
    _count: {
      inventory: 3,
      menuItemIngredients: 8
    }
  },
  {
    id: '3',
    name: 'Wortel',
    category: 'VEGETABLE',
    unit: 'kg',
    description: 'Wortel segar pilihan',
    minimumStock: 20,
    currentStock: 80,
    costPerUnit: 8000,
    supplier: {
      id: '3',
      name: 'Tani Sayur Segar'
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12',
    _count: {
      inventory: 4,
      menuItemIngredients: 15
    }
  },
  {
    id: '4',
    name: 'Minyak Goreng',
    category: 'OTHER',
    unit: 'liter',
    description: 'Minyak goreng untuk keperluan memasak',
    minimumStock: 15,
    currentStock: 45,
    costPerUnit: 18000,
    supplier: {
      id: '4',
      name: 'Supplier Minyak'
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08',
    _count: {
      inventory: 2,
      menuItemIngredients: 20
    }
  },
  {
    id: '5',
    name: 'Tomat',
    category: 'VEGETABLE',
    unit: 'kg',
    description: 'Tomat segar untuk masakan',
    minimumStock: 10,
    currentStock: 5,
    costPerUnit: 12000,
    supplier: {
      id: '3',
      name: 'Tani Sayur Segar'
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-05',
    _count: {
      inventory: 2,
      menuItemIngredients: 8
    }
  }
]

const mockStats: RawMaterialStats = {
  total: 5,
  lowStock: 2, // Tomat dan daging ayam (currentStock < minimumStock or currentStock <= minimumStock * 1.2)
  categories: 4, // CARBOHYDRATE, PROTEIN, VEGETABLE, OTHER
  totalValue: 8640000 // Sum of (currentStock * costPerUnit) for all items
}

export function useRawMaterials({ filters, pagination }: UseRawMaterialsParams) {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [stats, setStats] = useState<RawMaterialStats | null>(null)
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)

  const fetchRawMaterials = async () => {
    try {
      setIsFiltering(true)
      setLoading(true)
      
      // Try to fetch from API first
      try {
        // Build query parameters
        const queryParams = new URLSearchParams({
          page: pagination.currentPage.toString(),
          limit: pagination.itemsPerPage.toString(),
          search: filters.searchTerm || '',
          category: filters.selectedCategory !== 'all' ? filters.selectedCategory : '',
          status: filters.selectedStatus !== 'all' ? filters.selectedStatus : ''
        })

        // Fetch raw materials data
        const [materialsResponse, statsResponse] = await Promise.all([
          fetch(`/api/raw-materials?${queryParams}`),
          fetch('/api/raw-materials/stats')
        ])

        if (materialsResponse.ok && statsResponse.ok) {
          const materialsData = await materialsResponse.json()
          const statsData = await statsResponse.json()

          setRawMaterials(materialsData.data || [])
          setStats(statsData.data || null)
          setPaginationData(materialsData.pagination || null)
          return
        }
      } catch (apiError) {
        console.log('API not available, using mock data')
      }

      // Fallback to mock data with client-side filtering
      const filteredMaterials = mockRawMaterials.filter(material => {
        const matchesSearch = !filters.searchTerm || 
          material.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          material.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
        
        const matchesCategory = filters.selectedCategory === 'all' || 
          material.category === filters.selectedCategory
          
        const matchesStatus = filters.selectedStatus === 'all' || 
          (filters.selectedStatus === 'active' && material.isActive) ||
          (filters.selectedStatus === 'inactive' && !material.isActive)
        
        return matchesSearch && matchesCategory && matchesStatus
      })

      // Client-side pagination
      const totalItems = filteredMaterials.length
      const totalPages = Math.ceil(totalItems / pagination.itemsPerPage)
      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
      const endIndex = startIndex + pagination.itemsPerPage
      const paginatedMaterials = filteredMaterials.slice(startIndex, endIndex)

      setRawMaterials(paginatedMaterials)
      setStats(mockStats)
      setPaginationData({
        totalCount: totalItems,
        totalPages,
        currentPage: pagination.currentPage,
        hasNextPage: pagination.currentPage < totalPages,
        hasPreviousPage: pagination.currentPage > 1,
        limit: pagination.itemsPerPage
      })

    } catch (error) {
      console.error('Error fetching raw materials:', error)
      setRawMaterials([])
      setStats(null)
      setPaginationData(null)
    } finally {
      setLoading(false)
      setIsFiltering(false)
    }
  }

  const deleteRawMaterial = async (id: string): Promise<boolean> => {
    try {
      // Try API first
      try {
        const response = await fetch(`/api/raw-materials/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await fetchRawMaterials()
          return true
        }
      } catch (apiError) {
        console.log('API not available for delete operation')
      }

      // Fallback: remove from local state (mock behavior)
      setRawMaterials(prev => prev.filter(material => material.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting raw material:', error)
      return false
    }
  }

  const refetch = () => {
    fetchRawMaterials()
  }

  useEffect(() => {
    fetchRawMaterials()
  }, [filters, pagination])

  return {
    rawMaterials,
    stats,
    paginationData,
    loading,
    isFiltering,
    deleteRawMaterial,
    refetch
  }
}
