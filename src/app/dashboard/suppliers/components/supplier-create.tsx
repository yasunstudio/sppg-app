"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Building2, Phone, Mail, MapPin, User } from "lucide-react"
import { toast } from "sonner"

const supplierSchema = z.object({
  name: z.string().min(1, "Nama supplier wajib diisi").max(100, "Nama tidak boleh lebih dari 100 karakter"),
  contactName: z.string().min(1, "Nama kontak wajib diisi").max(100, "Nama kontak tidak boleh lebih dari 100 karakter"),
  phone: z.string().min(1, "Nomor telepon wajib diisi").regex(/^[+]?[\d\s\-\(\)]{8,20}$/, "Format nomor telepon tidak valid"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().min(1, "Alamat wajib diisi").max(500, "Alamat tidak boleh lebih dari 500 karakter"),
})

type SupplierFormData = z.infer<typeof supplierSchema>

export function SupplierCreate() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema)
  })

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

      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create supplier')
      }

      const result = await response.json()
      toast.success('Supplier berhasil dibuat!')
      router.push(`/dashboard/suppliers/${result.data.id}`)
    } catch (error) {
      console.error('Error creating supplier:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal membuat supplier')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
          Tambah Supplier Baru
        </h1>
        <p className="text-muted-foreground">
          Tambahkan supplier baru dengan informasi kontak yang lengkap
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
                Masukkan detail dasar supplier
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
                Detail kontak untuk komunikasi
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
              Alamat lengkap supplier untuk pengiriman dan komunikasi
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Supplier
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
