'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Users, Calendar, Hash } from "lucide-react"

export interface StudentBasicFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function StudentBasicFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Dasar",
  description
}: StudentBasicFieldsProps) {
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
        {/* NISN */}
        <FormField
          control={control}
          name="nisn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Hash className="w-4 h-4 inline mr-1" />
                NISN *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: 1234567890"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Nomor Induk Siswa Nasional (10-20 digit)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <User className="w-4 h-4 inline mr-1" />
                Nama Lengkap *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama lengkap siswa"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age */}
        <FormField
          control={control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Calendar className="w-4 h-4 inline mr-1" />
                Usia *
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Contoh: 12"
                  min={5}
                  max={18}
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Usia siswa (5-18 tahun)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Users className="w-4 h-4 inline mr-1" />
                Jenis Kelamin *
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MALE">Laki-laki</SelectItem>
                  <SelectItem value="FEMALE">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Grade */}
        <FormField
          control={control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kelas *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: 6A, 7B"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kelas siswa saat ini
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Parent Name */}
        <FormField
          control={control}
          name="parentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <User className="w-4 h-4 inline mr-1" />
                Nama Orang Tua *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama orang tua/wali"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
