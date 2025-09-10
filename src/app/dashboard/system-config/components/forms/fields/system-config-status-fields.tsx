'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

interface SystemConfigStatusFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function SystemConfigStatusFields({ 
  control, 
  isSubmitting = false,
  title = "Status & Pengaturan",
  description
}: SystemConfigStatusFieldsProps) {
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
      
      {/* Active Status */}
      <FormField
        control={control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-gray-700">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Status Aktif
              </FormLabel>
              <FormDescription className="dark:text-gray-400">
                Aktifkan atau nonaktifkan konfigurasi ini
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
