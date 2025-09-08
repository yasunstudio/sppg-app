'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Control, Controller } from "react-hook-form"
import { VehicleType, VehicleStatus } from "../utils/vehicle-schemas"

interface VehicleBasicFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function VehicleBasicFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Dasar",
  description
}: VehicleBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* Plate Number */}
      <Controller
        control={control}
        name="plateNumber"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nomor Plat *</Label>
            <Input
              {...field}
              disabled={isSubmitting}
              placeholder="Contoh: B 1234 ABC"
              className={fieldState.error ? "border-red-500" : ""}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Vehicle Type */}
      <Controller
        control={control}
        name="type"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label>Jenis Kendaraan *</Label>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className={fieldState.error ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih jenis kendaraan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VehicleType.TRUCK}>Truk</SelectItem>
                <SelectItem value={VehicleType.VAN}>Van</SelectItem>
                <SelectItem value={VehicleType.MOTORCYCLE}>Motor</SelectItem>
                <SelectItem value={VehicleType.PICKUP}>Pickup</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Capacity */}
      <Controller
        control={control}
        name="capacity"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Kapasitas (kg) *</Label>
            <Input
              {...field}
              type="number"
              min="0"
              disabled={isSubmitting}
              placeholder="Masukkan kapasitas dalam kg"
              className={fieldState.error ? "border-red-500" : ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Brand */}
      <Controller
        control={control}
        name="brand"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Merek</Label>
            <Input
              {...field}
              disabled={isSubmitting}
              placeholder="Contoh: Toyota, Honda, Mitsubishi"
              className={fieldState.error ? "border-red-500" : ""}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Model */}
      <Controller
        control={control}
        name="model"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Model</Label>
            <Input
              {...field}
              disabled={isSubmitting}
              placeholder="Contoh: Avanza, Jazz, L300"
              className={fieldState.error ? "border-red-500" : ""}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Year */}
      <Controller
        control={control}
        name="year"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Tahun Pembuatan</Label>
            <Input
              {...field}
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              disabled={isSubmitting}
              placeholder="Contoh: 2020"
              className={fieldState.error ? "border-red-500" : ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Fuel Type */}
      <Controller
        control={control}
        name="fuelType"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label>Jenis Bahan Bakar</Label>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className={fieldState.error ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih jenis bahan bakar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GASOLINE">Bensin</SelectItem>
                <SelectItem value="DIESEL">Solar</SelectItem>
                <SelectItem value="ELECTRIC">Listrik</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Status */}
      <Controller
        control={control}
        name="status"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label>Status Kendaraan</Label>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className={fieldState.error ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih status kendaraan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VehicleStatus.ACTIVE}>Aktif</SelectItem>
                <SelectItem value={VehicleStatus.INACTIVE}>Tidak Aktif</SelectItem>
                <SelectItem value={VehicleStatus.MAINTENANCE}>Maintenance</SelectItem>
                <SelectItem value={VehicleStatus.RETIRED}>Pensiun</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={isSubmitting}
              placeholder="Catatan tambahan tentang kendaraan..."
              rows={3}
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
