'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { Control } from 'react-hook-form'
import { VehicleBasicFields, VehicleServiceFields, VehicleDocumentFields } from "./forms/fields"

interface VehicleFormLayoutProps {
  title: string
  description: string
  control: Control<any>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  submitButtonText: string
  submitButtonLoadingText: string
}

export function VehicleFormLayout({
  title,
  description,
  control,
  isSubmitting,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText
}: VehicleFormLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <VehicleBasicFields 
              control={control} 
              isSubmitting={isSubmitting}
              title="Informasi Dasar"
              description="Data identitas dan spesifikasi kendaraan"
            />
            
            <VehicleServiceFields 
              control={control} 
              isSubmitting={isSubmitting}
              title="Maintenance & Service"
              description="Informasi perawatan dan kondisi kendaraan"
            />
          </div>
          
          <div className="space-y-6">
            <VehicleDocumentFields 
              control={control} 
              isSubmitting={isSubmitting}
              title="Dokumen & Legalitas"
              description="Informasi dokumen dan masa berlaku"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="submit" disabled={isSubmitting}>
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
