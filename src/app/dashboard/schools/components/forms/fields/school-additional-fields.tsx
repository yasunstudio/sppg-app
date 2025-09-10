'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin } from "lucide-react"

export interface SchoolAdditionalFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function SchoolAdditionalFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Tambahan",
  description
}: SchoolAdditionalFieldsProps) {
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
        {/* Latitude */}
        <FormField
          control={control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <MapPin className="w-4 h-4 inline mr-1" />
                Latitude
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="Contoh: -6.2088"
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                />
              </FormControl>
              <FormDescription>
                Koordinat lintang lokasi sekolah
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Longitude */}
        <FormField
          control={control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <MapPin className="w-4 h-4 inline mr-1" />
                Longitude
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="Contoh: 106.8456"
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                />
              </FormControl>
              <FormDescription>
                Koordinat bujur lokasi sekolah
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Notes - Full width */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catatan</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tambahkan catatan atau informasi tambahan tentang sekolah..."
                className="min-h-[100px]"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Opsional: Catatan tambahan tentang sekolah (maksimal 1000 karakter)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
