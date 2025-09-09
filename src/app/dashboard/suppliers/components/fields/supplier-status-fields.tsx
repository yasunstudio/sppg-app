'use client'

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Control, Controller } from "react-hook-form"

interface SupplierStatusFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function SupplierStatusFields({ 
  control, 
  isSubmitting = false,
  title = "Status Supplier",
  description
}: SupplierStatusFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* Active Status */}
      <Controller
        control={control}
        name="isActive"
        render={({ field, fieldState }) => (
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting}
            />
            <Label htmlFor={field.name}>
              Supplier Aktif
            </Label>
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  )
}
