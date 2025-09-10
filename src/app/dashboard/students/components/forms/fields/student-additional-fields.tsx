'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"

export interface StudentAdditionalFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function StudentAdditionalFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Tambahan",
  description
}: StudentAdditionalFieldsProps) {
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
      
      {/* Notes - Full width */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FileText className="w-4 h-4 inline mr-1" />
              Catatan
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tambahkan catatan atau informasi tambahan tentang siswa..."
                className="min-h-[100px]"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Opsional: Catatan tambahan tentang siswa (maksimal 500 karakter)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
