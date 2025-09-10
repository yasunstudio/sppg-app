'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CONFIG_CATEGORIES, CONFIG_DATA_TYPES } from "../../utils/system-config-schemas"

interface SystemConfigBasicFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
  isEdit?: boolean
}

export function SystemConfigBasicFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Dasar",
  description,
  isEdit = false
}: SystemConfigBasicFieldsProps) {
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
        {/* Config Key */}
        {!isEdit && (
          <FormField
            control={control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Konfigurasi *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: SITE_NAME"
                    disabled={isSubmitting}
                    {...field}
                    className="font-mono"
                  />
                </FormControl>
                <FormDescription>
                  Gunakan huruf besar dan underscore (A-Z, _)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Config Value */}
        <FormField
          control={control}
          name="value"
          render={({ field }) => (
            <FormItem className={!isEdit ? "" : "md:col-span-2"}>
              <FormLabel>Value *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan nilai konfigurasi..."
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

      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(CONFIG_CATEGORIES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data Type */}
          <FormField
            control={control}
            name="dataType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Data *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe data" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(CONFIG_DATA_TYPES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Description */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deskripsi</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Jelaskan kegunaan konfigurasi ini..."
                rows={3}
                disabled={isSubmitting}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Deskripsi opsional untuk menjelaskan kegunaan konfigurasi
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
