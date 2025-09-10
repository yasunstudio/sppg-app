'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Control, Controller } from "react-hook-form"

interface VehicleDocumentFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function VehicleDocumentFields({ 
  control, 
  isSubmitting = false,
  title = "Legal Documents",
  description
}: VehicleDocumentFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* Insurance Expiry */}
      <Controller
        control={control}
        name="insuranceExpiry"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Masa Berlaku Asuransi</Label>
            <Input
              {...field}
              type="date"
              disabled={isSubmitting}
              className={fieldState.error ? "border-red-500" : ""}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Registration Expiry */}
      <Controller
        control={control}
        name="registrationExpiry"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Masa Berlaku STNK</Label>
            <Input
              {...field}
              type="date"
              disabled={isSubmitting}
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
