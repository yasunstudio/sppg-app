"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Building2, Phone, Mail, MapPin, User, Loader2, ToggleLeft } from "lucide-react"
import { toast } from "sonner"

const supplierSchema = z.object({
  name: z.string().min(1, "Nama supplier wajib diisi").max(100, "Nama tidak boleh lebih dari 100 karakter"),
  contactName: z.string().min(1, "Nama kontak wajib diisi").max(100, "Nama kontak tidak boleh lebih dari 100 karakter"),
  phone: z.string().min(1, "Nomor telepon wajib diisi").regex(/^[+]?[\d\s\-\(\)]{8,20}$/, "Format nomor telepon tidak valid"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().min(1, "Alamat wajib diisi").max(500, "Alamat tidak boleh lebih dari 500 karakter"),
  isActive: z.boolean(),
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

interface SupplierEditProps {
  supplierId?: string
}

export function SupplierEdit({ supplierId }: SupplierEditProps) {
  const router = useRouter()
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get ID from props or URL
  const id = supplierId || (typeof window !== 'undefined' ? window.location.pathname.split('/').slice(-2)[0] : null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      isActive: true
    }
  })

  const isActive = watch("isActive")

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
            isActive: supplierData.isActive,
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
        contactName: data.contactName.trim(),
        isActive: data.isActive
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
      toast.success('Supplier berhasil diperbarui!')
      router.push('/dashboard/suppliers')
    } catch (error) {
      console.error('Error updating supplier:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui supplier')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted dark:bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted dark:bg-muted animate-pulse rounded" />
        </div>

        {/* Form Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="bg-card dark:bg-card border-border dark:border-border">
              <CardHeader>
                <div className="h-6 w-32 bg-muted dark:bg-muted animate-pulse rounded" />
                <div className="h-4 w-48 bg-muted dark:bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 w-24 bg-muted dark:bg-muted animate-pulse rounded" />
                    <div className="h-10 w-full bg-muted dark:bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !supplier) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {error === 'Supplier not found' ? 'Supplier Tidak Ditemukan' : 'Terjadi Kesalahan'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {error === 'Supplier not found' 
              ? 'Supplier yang ingin Anda edit tidak ditemukan atau telah dihapus.'
              : 'Gagal memuat data supplier. Silakan coba lagi.'
            }
          </p>
          <Button onClick={() => router.push('/dashboard/suppliers')}>
            Kembali ke Daftar Supplier
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
          Edit Supplier
        </h1>
        <p className="text-muted-foreground">
          Perbarui informasi dan detail kontak supplier &quot;{supplier.name}&quot;
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-foreground">
                <Building2 className="h-5 w-5" />
                Informasi Dasar
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Perbarui detail dasar supplier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground dark:text-foreground">
                  Nama Supplier *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Masukkan nama supplier"
                  className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-foreground dark:text-foreground">
                  Nama Kontak *
                </Label>
                <Input
                  id="contactName"
                  {...register("contactName")}
                  placeholder="Masukkan nama person in charge"
                  className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                />
                {errors.contactName && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.contactName.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-foreground">
                <Phone className="h-5 w-5" />
                Informasi Kontak
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Perbarui detail kontak untuk komunikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground dark:text-foreground">
                  Nomor Telepon *
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Contoh: +62 812-3456-7890"
                  className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground dark:text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="contoh@supplier.com (opsional)"
                  className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive" className="text-foreground dark:text-foreground">
                  Status Supplier
                </Label>
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                  />
                  <div className="flex items-center gap-2">
                    <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground dark:text-foreground">
                      {isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supplier aktif dapat menerima pesanan dan transaksi
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Address */}
        <Card className="bg-card dark:bg-card border-border dark:border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground dark:text-foreground">
              <MapPin className="h-5 w-5" />
              Alamat
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Perbarui alamat lengkap supplier untuk pengiriman dan komunikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground dark:text-foreground">
                Alamat Lengkap *
              </Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Masukkan alamat lengkap termasuk kota dan kode pos..."
                rows={4}
                className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input placeholder:text-muted-foreground"
              />
              {errors.address && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/dashboard/suppliers')}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
