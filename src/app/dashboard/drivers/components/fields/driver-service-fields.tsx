'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Control, Controller } from "react-hook-form"

interface DriverServiceFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function DriverServiceFields({ 
  control, 
  isSubmitting = false,
  title = "Data Pengiriman",
  description
}: DriverServiceFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* Total Deliveries */}
      <Controller
        control={control}
        name="totalDeliveries"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Total Pengiriman</Label>
            <Input
              {...field}
              type="number"
              min="0"
              placeholder="Jumlah pengiriman yang telah dilakukan"
              disabled={isSubmitting}
              className={fieldState.error ? "border-red-500" : ""}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Notes */}
      <Controller
        control={control}
        name="notes"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Catatan</Label>
            <Textarea
              {...field}
              placeholder="Catatan tambahan tentang driver (opsional)"
              disabled={isSubmitting}
              className={fieldState.error ? "border-red-500" : ""}
              rows={3}
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
