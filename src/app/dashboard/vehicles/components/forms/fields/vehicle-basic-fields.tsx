'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { VehicleType, VehicleStatus } from "../../utils/vehicle-schemas"

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
        {/* Plate Number */}
        <FormField
          control={control}
          name="plateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Plat *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: B 1234 ABC"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Type */}
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Kendaraan *</FormLabel>
              <Select disabled={isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kendaraan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={VehicleType.TRUCK}>Truk</SelectItem>
                  <SelectItem value={VehicleType.VAN}>Van</SelectItem>
                  <SelectItem value={VehicleType.MOTORCYCLE}>Motor</SelectItem>
                  <SelectItem value={VehicleType.PICKUP}>Pickup</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Brand */}
        <FormField
          control={control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merek *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Toyota, Honda, Mitsubishi"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model */}
        <FormField
          control={control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Avanza, Brio, Canter"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Year */}
        <FormField
          control={control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2020"
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Capacity */}
        <FormField
          control={control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapasitas (kg) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1000"
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Kapasitas muatan maksimal dalam kilogram
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fuel Type */}
        <FormField
          control={control}
          name="fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Bahan Bakar *</FormLabel>
              <Select disabled={isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bahan bakar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GASOLINE">Bensin</SelectItem>
                  <SelectItem value="DIESEL">Solar</SelectItem>
                  <SelectItem value="ELECTRIC">Listrik</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <Select disabled={isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={VehicleStatus.ACTIVE}>Aktif</SelectItem>
                  <SelectItem value={VehicleStatus.MAINTENANCE}>Perawatan</SelectItem>
                  <SelectItem value={VehicleStatus.INACTIVE}>Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Notes */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catatan</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Catatan tambahan tentang kendaraan..."
                disabled={isSubmitting}
                {...field}
                rows={3}
              />
            </FormControl>
            <FormDescription>
              Informasi tambahan tentang kondisi atau spesifikasi khusus kendaraan
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
