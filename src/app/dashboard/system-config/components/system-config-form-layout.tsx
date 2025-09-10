'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { Control } from 'react-hook-form'
import { SystemConfigBasicFields, SystemConfigStatusFields } from "./forms/fields"

interface SystemConfigFormLayoutProps {
  title: string
  description: string
  control: Control<any>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  submitButtonText: string
  submitButtonLoadingText: string
  isEdit?: boolean
}

export function SystemConfigFormLayout({
  title,
  description,
  control,
  isSubmitting,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText,
  isEdit = false
}: SystemConfigFormLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">{title}</h2>
        <p className="text-muted-foreground dark:text-gray-400">{description}</p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <SystemConfigBasicFields 
                  control={control} 
                  isSubmitting={isSubmitting}
                  title="Informasi Konfigurasi"
                  description="Data dasar konfigurasi sistem"
                  isEdit={isEdit}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <SystemConfigStatusFields 
                  control={control} 
                  isSubmitting={isSubmitting}
                  title="Status & Aktivasi"
                  description="Pengaturan status konfigurasi"
                />
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                  💡 Tips Konfigurasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm dark:text-white">Format Key:</h4>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    Gunakan huruf besar dan underscore (contoh: SITE_NAME, MAX_UPLOAD_SIZE)
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm dark:text-white">Tipe Data:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 dark:text-gray-400">
                    <li>• STRING: Teks biasa</li>
                    <li>• INTEGER: Angka bulat</li>
                    <li>• BOOLEAN: true/false</li>
                    <li>• JSON: Object atau array</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm dark:text-white">Kategori:</h4>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    Pilih kategori yang sesuai untuk mempermudah pengelompokan konfigurasi
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
          <Button type="submit" disabled={isSubmitting} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {submitButtonLoadingText}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {submitButtonText}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
