'use client'

import { Control } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

interface DriverBasicFieldsProps {
  control: Control<any>
  isSubmitting: boolean
  title: string
  description: string
}

export function DriverBasicFields({ control, isSubmitting, title, description }: DriverBasicFieldsProps) {
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
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Karyawan *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="SPG-DRV-001" 
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nama lengkap driver" 
                    disabled={isSubmitting}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon *</FormLabel>
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

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="driver@example.com" 
                    disabled={isSubmitting}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir</FormLabel>
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

          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Driver</FormLabel>
                <FormControl>
                  <Select 
                    disabled={isSubmitting}
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Aktif</SelectItem>
                      <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                      <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Alamat lengkap driver..."
                  disabled={isSubmitting}
                  rows={2}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select 
                  disabled={isSubmitting}
                  onValueChange={(value) => field.onChange(value === 'true')} 
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Catatan tambahan tentang driver..."
                  disabled={isSubmitting}
                  rows={3}
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
