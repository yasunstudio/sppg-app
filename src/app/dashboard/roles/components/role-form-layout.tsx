'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Save, Loader2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { RoleBasicFields, RolePermissionFields } from "./forms/fields"

interface RoleFormLayoutProps {
  title: string
  description: string
  form: UseFormReturn<any>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  submitButtonText: string
  submitButtonLoadingText: string
}

export function RoleFormLayout({
  title,
  description,
  form,
  isSubmitting,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText
}: RoleFormLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Form */}
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <RoleBasicFields 
                control={form.control} 
                isSubmitting={isSubmitting}
                title="Informasi Dasar"
                description="Data identitas dan deskripsi role"
              />
            </div>
            
            <div className="space-y-6">
              <RolePermissionFields 
                control={form.control} 
                isSubmitting={isSubmitting}
                title="Permissions & Akses"
                description="Atur hak akses dan permission untuk role ini"
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
      </Form>
    </div>
  )
}
