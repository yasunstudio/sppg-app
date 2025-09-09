'use client'

import { Control } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, AlertTriangle } from 'lucide-react'

interface DriverLicenseFieldsProps {
  control: Control<any>
  isSubmitting: boolean
  title: string
  description: string
}

export function DriverLicenseFields({ control, isSubmitting, title, description }: DriverLicenseFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant="outline">Wajib</Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor SIM *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="1234567890123456" 
                    disabled={isSubmitting}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="licenseType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis SIM *</FormLabel>
                <FormControl>
                  <Select 
                    disabled={isSubmitting}
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis SIM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SIM_A">SIM A - Mobil</SelectItem>
                      <SelectItem value="SIM_B1">SIM B1 - Truk Ringan</SelectItem>
                      <SelectItem value="SIM_B2">SIM B2 - Truk Berat</SelectItem>
                      <SelectItem value="SIM_C">SIM C - Motor</SelectItem>
                      <SelectItem value="SIM_D">SIM D - Kendaraan Khusus</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="licenseExpiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tanggal Berakhir SIM *
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  disabled={isSubmitting}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Penting</span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Pastikan SIM masih berlaku minimal 30 hari ke depan. Driver dengan SIM yang akan habis dalam 7 hari tidak bisa melakukan pengiriman.
          </p>
        </div>

        <FormField
          control={control}
          name="totalDeliveries"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Pengiriman</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="0" 
                  disabled={isSubmitting}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
