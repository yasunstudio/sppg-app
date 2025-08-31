"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Truck, Phone, Mail } from "lucide-react"
import { toast } from "sonner"

const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required").max(100, "Name must be less than 100 characters"),
  contactName: z.string().min(1, "Contact name is required").max(100, "Contact name must be less than 100 characters"),
  phone: z.string().min(1, "Phone number is required").regex(/^[+]?[\d\s\-\(\)]{8,20}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required").max(500, "Address must be less than 500 characters"),
})

type SupplierFormData = z.infer<typeof supplierSchema>

interface Supplier {
  id: string
  name: string
  contactName: string
  phone: string
  email: string | null
  address: string
  isActive: boolean
}

export function SupplierEdit() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema)
  })

  useEffect(() => {
    if (!id) return

    const fetchSupplier = async () => {
      try {
        const response = await fetch(`/api/suppliers/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Supplier not found')
          }
          throw new Error('Failed to fetch supplier')
        }
        
        const data = await response.json()
        if (data.success) {
          const supplierData = data.data
          setSupplier(supplierData)
          
          // Reset form with fetched data
          reset({
            name: supplierData.name,
            contactName: supplierData.contactName,
            phone: supplierData.phone,
            email: supplierData.email || '',
            address: supplierData.address,
          })
        } else {
          throw new Error(data.error || 'Failed to fetch supplier')
        }
      } catch (error) {
        console.error('Error fetching supplier:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch supplier')
      } finally {
        setLoading(false)
      }
    }

    fetchSupplier()
  }, [id, reset])

  const onSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true)
    
    try {
      const submitData = {
        ...data,
        email: data.email?.trim() || null,
        phone: data.phone.replace(/\s/g, ''), // Remove spaces from phone
        address: data.address.trim(),
        name: data.name.trim(),
        contactName: data.contactName.trim()
      }

      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update supplier')
      }

      const result = await response.json()
      toast.success('Supplier updated successfully!')
      router.push(`/dashboard/suppliers/${id}`)
    } catch (error) {
      console.error('Error updating supplier:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update supplier')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !supplier) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Supplier Not Found</h3>
          <p className="text-muted-foreground">
            {error || "The supplier you're trying to edit doesn't exist."}
          </p>
          <Button className="mt-4" onClick={() => router.push('/dashboard/suppliers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Supplier</h1>
          <p className="text-muted-foreground">
            Update {supplier.name} information and contact details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Supplier Information
            </CardTitle>
            <CardDescription>
              Update the basic details of the supplier
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Supplier Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., PT Fresh Food Supplier"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">
                  Contact Person <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactName"
                  {...register('contactName')}
                  placeholder="e.g., John Doe"
                />
                {errors.contactName && (
                  <p className="text-sm text-red-500">{errors.contactName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                {...register('address')}
                placeholder="Complete address including city and postal code"
                rows={3}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Update contact details for communication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+62 812 3456 7890"
                    className="pl-10"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="supplier@example.com"
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Optional but recommended for better communication</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Supplier
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
