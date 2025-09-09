'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supplierUpdateSchema, type SupplierUpdateInput } from '../utils/supplier-schemas'

export function useSupplierEditForm(supplierId: string) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<SupplierUpdateInput>({
    resolver: zodResolver(supplierUpdateSchema),
    defaultValues: {
      id: supplierId,
      name: '',
      contactName: '',
      phone: '',
      address: '',
      email: null,
      isActive: true,
    }
  })

  // Fetch supplier data on mount
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`/api/suppliers/${supplierId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch supplier')
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Supplier not found')
        }

        const supplier = result.data
        
        // Reset form with fetched data
        form.reset({
          id: supplier.id,
          name: supplier.name,
          contactName: supplier.contactName,
          phone: supplier.phone,
          address: supplier.address,
          email: supplier.email || "",
          isActive: supplier.isActive,
        })

      } catch (error) {
        console.error('Error fetching supplier:', error)
        toast.error(error instanceof Error ? error.message : 'Gagal memuat data supplier')
        router.push('/suppliers')
      } finally {
        setIsLoading(false)
      }
    }

    if (supplierId) {
      fetchSupplier()
    }
  }, [supplierId, form, router])

  const onSubmit = async (data: SupplierUpdateInput) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
        email: data.email || null, // Convert empty string to null
      }

      const response = await fetch(`/api/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal memperbarui supplier')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Gagal memperbarui supplier')
      }

      toast.success('Supplier berhasil diperbarui')
      router.push('/suppliers')

    } catch (error) {
      console.error('Error updating supplier:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui supplier')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = form.handleSubmit(onSubmit)

  return {
    form,
    isSubmitting,
    isLoading,
    onSubmit: handleSubmit,
    reset: form.reset,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    formState: form.formState
  }
}
