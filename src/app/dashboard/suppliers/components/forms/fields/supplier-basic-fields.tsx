'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
    <div className="space-y-6">
      {title && (
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Supplier *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: PT Sumber Makmur"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Name */}
        <FormField
          control={control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kontak *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Budi Santoso"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: 021-12345678"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: supplier@example.com"
                  type="email"
                  disabled={isSubmitting}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Address */}
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Masukkan alamat lengkap supplier..."
                rows={3}
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
