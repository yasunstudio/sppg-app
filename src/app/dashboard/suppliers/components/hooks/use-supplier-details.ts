'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface SupplierDetailsData {
  id: string
  name: string
  contactName: string
  phone: string
  email?: string | null
  address: string
  status: 'ACTIVE' | 'INACTIVE'
  notes?: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    purchaseOrders: number
    rawMaterials: number
  }
}

interface UseSupplierDetailsOptions {
  supplierId: string
  onSuccess?: (supplier: SupplierDetailsData) => void
  onError?: (error: string) => void
}

interface UseSupplierDetailsReturn {
  supplier: SupplierDetailsData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  deleteSupplier: () => Promise<void>
  isDeleting: boolean
}

export function useSupplierDetails({ 
  supplierId, 
  onSuccess, 
  onError 
}: UseSupplierDetailsOptions): UseSupplierDetailsReturn {
  const [supplier, setSupplier] = useState<SupplierDetailsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSupplier = async () => {
    if (!supplierId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/suppliers/${supplierId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch supplier details')
      }

      if (result.success && result.data) {
        setSupplier(result.data)
        onSuccess?.(result.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load supplier details'
      setError(errorMessage)
      onError?.(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSupplier = async (): Promise<void> => {
    if (!supplierId || !supplier) return

    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/suppliers/${supplierId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete supplier')
      }

      toast.success('Supplier berhasil dihapus')
      
      // Redirect will be handled by the component
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete supplier'
      toast.error(errorMessage)
      throw err // Re-throw to let component handle it
    } finally {
      setIsDeleting(false)
    }
  }

  const refetch = async (): Promise<void> => {
    await fetchSupplier()
  }

  useEffect(() => {
    fetchSupplier()
  }, [supplierId])

  return {
    supplier,
    isLoading,
    error,
    refetch,
    deleteSupplier,
    isDeleting
  }
}
