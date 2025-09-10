'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { School, Map, Phone, Mail } from "lucide-react"

export interface SchoolBasicFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function SchoolBasicFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Dasar",
  description
}: SchoolBasicFieldsProps) {
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
        {/* School Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Sekolah *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama sekolah"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Principal Name */}
        <FormField
          control={control}
          name="principalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kepala Sekolah *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama kepala sekolah"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Principal Phone */}
        <FormField
          control={control}
          name="principalPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon Kepala Sekolah *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: 08123456789"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total Students */}
        <FormField
          control={control}
          name="totalStudents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Siswa *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="10000"
                  placeholder="Masukkan jumlah siswa"
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Address - Full width */}
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat Sekolah *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Masukkan alamat lengkap sekolah..."
                className="min-h-[100px]"
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
