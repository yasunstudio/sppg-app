'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { Control } from 'react-hook-form'
import { StudentBasicFields, StudentAdditionalFields, StudentSchoolFields } from "./forms/fields"

export interface StudentFormLayoutProps {
  title: string
  description: string
  control: Control<any>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  submitButtonText: string
  submitButtonLoadingText: string
}

export function StudentFormLayout({
  title,
  description,
  control,
  isSubmitting,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText
}: StudentFormLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <StudentBasicFields 
              control={control} 
              isSubmitting={isSubmitting}
              title="Informasi Dasar"
              description="Data identitas dan demografis siswa"
            />
            
            <StudentSchoolFields 
              control={control} 
              isSubmitting={isSubmitting}
              title="Informasi Sekolah"
              description="Sekolah tempat siswa bersekolah"
            />
            
            <StudentAdditionalFields 
              control={control} 
              isSubmitting={isSubmitting}
              title="Informasi Tambahan"
              description="Catatan dan informasi tambahan"
            />
          </div>
          
          <div className="space-y-6">
            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle>Panduan Pengisian</CardTitle>
                <CardDescription>
                  Informasi untuk membantu Anda mengisi form dengan benar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>NISN:</strong> Nomor Induk Siswa Nasional (10-20 digit)
                  </p>
                  <p>
                    <strong>Nama:</strong> Masukkan nama lengkap siswa sesuai dokumen resmi
                  </p>
                  <p>
                    <strong>Usia:</strong> Usia siswa saat ini (5-18 tahun)
                  </p>
                  <p>
                    <strong>Kelas:</strong> Kelas siswa saat ini (contoh: 6A, 7B)
                  </p>
                  <p>
                    <strong>Orang Tua:</strong> Nama lengkap orang tua atau wali
                  </p>
                  <p>
                    <strong>Sekolah:</strong> Pilih sekolah tempat siswa bersekolah
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {submitButtonLoadingText}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {submitButtonText}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
