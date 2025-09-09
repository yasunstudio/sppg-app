'use client'

import { Control } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

interface DriverContactFieldsProps {
  control: Control<any>
  isSubmitting: boolean
  title: string
  description: string
}

export function DriverContactFields({ control, isSubmitting, title, description }: DriverContactFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant="secondary">Opsional</Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Lengkap</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota, Provinsi"
                  disabled={isSubmitting}
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="emergencyContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kontak Darurat (Nama)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nama kontak darurat" 
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
            name="emergencyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telepon Kontak Darurat</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+62812345678" 
                    disabled={isSubmitting}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
