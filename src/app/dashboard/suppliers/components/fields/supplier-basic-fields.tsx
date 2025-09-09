'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Control, Controller } from "react-hook-form"

interface SupplierBasicFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function SupplierBasicFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Dasar",
  description
}: SupplierBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* Supplier Name */}
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nama Supplier *</Label>
            <Input
              {...field}
              disabled={isSubmitting}
              placeholder="Contoh: PT Sumber Makmur"
              className={fieldState.error ? "border-red-500" : ""}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Contact Name */}
      <Controller
        control={control}
        name="contactName"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nama Kontak *</Label>
            <Input
              {...field}
              disabled={isSubmitting}
              placeholder="Contoh: Budi Santoso"
              className={fieldState.error ? "border-red-500" : ""}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Phone */}
      <Controller
        control={control}
        name="phone"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nomor Telepon *</Label>
            <Input
              {...field}
              disabled={isSubmitting}
              placeholder="Contoh: 021-12345678"
              className={fieldState.error ? "border-red-500" : ""}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              {...field}
              value={field.value || ""}
              type="email"
              disabled={isSubmitting}
              placeholder="Contoh: supplier@example.com"
              className={fieldState.error ? "border-red-500" : ""}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Address */}
      <Controller
        control={control}
        name="address"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Alamat *</Label>
            <Textarea
              {...field}
              disabled={isSubmitting}
              placeholder="Masukkan alamat lengkap supplier..."
              rows={3}
              className={fieldState.error ? "border-red-500" : ""}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  )
}
