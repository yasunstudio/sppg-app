'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { Control } from 'react-hook-form'
import { WasteRecordBasicFields } from "./forms"

interface WasteRecordFormLayoutProps {
  title: string
  description: string
  control: Control<any>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  submitButtonText: string
  submitButtonLoadingText: string
}

export function WasteRecordFormLayout({
  title,
  description,
  control,
  isSubmitting,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText
}: WasteRecordFormLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <WasteRecordBasicFields 
            form={{ control }}
          />
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
