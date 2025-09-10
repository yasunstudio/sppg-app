'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { Control } from 'react-hook-form'
import { UserRoleBasicFields, UserRoleStatusFields } from "./forms/fields"

interface UserRoleFormLayoutProps {
  title: string
  description: string
  control: Control<any>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  submitButtonText: string
  submitButtonLoadingText: string
  isEditMode?: boolean
}

export function UserRoleFormLayout({
  title,
  description,
  control,
  isSubmitting,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText,
  isEditMode = false
}: UserRoleFormLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <UserRoleBasicFields 
              control={control} 
              isSubmitting={isSubmitting}
              title="Detail Penugasan"
              description="Pilih user dan role yang akan ditugaskan"
            />
          </div>
          
          <div className="space-y-6">
            <UserRoleStatusFields 
              control={control} 
              isSubmitting={isSubmitting}
              title="Status & Catatan"
              description="Atur status dan tambahkan catatan"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[140px]"
              >
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
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
