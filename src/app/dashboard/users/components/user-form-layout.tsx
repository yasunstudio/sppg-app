'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { Control } from 'react-hook-form'
import { UserBasicFields, UserRoleFields, UserSecurityFields } from "./forms/fields"

interface UserFormLayoutProps {
  title: string
  description: string
  control: Control<any>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  submitButtonText: string
  submitButtonLoadingText: string
}

export function UserFormLayout({
  title,
  description,
  control,
  isSubmitting,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText
}: UserFormLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <UserBasicFields 
              control={control} 
              isLoading={isSubmitting}
            />
            
            <UserRoleFields 
              control={control} 
              isLoading={isSubmitting}
            />
          </div>
          
          <div className="space-y-6">
            <UserSecurityFields 
              control={control} 
              isLoading={isSubmitting}
              isEdit={title.includes('Edit')}
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
