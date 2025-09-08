'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Control, Controller } from "react-hook-form"

interface VehicleServiceFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function VehicleServiceFields({ 
  control, 
  isSubmitting = false,
  title = "Service & Maintenance",
  description
}: VehicleServiceFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* Last Service */}
      <Controller
        control={control}
        name="lastService"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Terakhir Service</Label>
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

      {/* Next Service */}
      <Controller
        control={control}
        name="nextService"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Service Berikutnya</Label>
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

      {/* Mileage */}
      <Controller
        control={control}
        name="mileage"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Kilometer (km)</Label>
            <Input
              {...field}
              type="number"
              min="0"
              disabled={isSubmitting}
              placeholder="Masukkan kilometer saat ini"
              className={fieldState.error ? "border-red-500" : ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
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
