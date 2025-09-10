"use client"

import { useState, useEffect } from "react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, X } from "lucide-react"
import { useUserEditForm } from "../hooks/use-user-edit-form"
import { UserBasicFields, UserRoleFields } from "./fields"

interface UserEditFormProps {
  userId: string
  onCancel?: () => void
  onSuccess?: () => void
}

interface Role {
  id: string
  name: string
  description?: string | null
}

export function UserEditForm({ userId, onCancel, onSuccess }: UserEditFormProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoadingRoles, setIsLoadingRoles] = useState(true)

  const { form, isSubmitting, isLoading, onSubmit } = useUserEditForm(userId, {
    onSuccess
  })

  // Fetch available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setRoles(result.data)
          }
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
      } finally {
        setIsLoadingRoles(false)
      }
    }

    fetchRoles()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data pengguna...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Pengguna</h1>
          <p className="text-muted-foreground">
            Ubah informasi pengguna
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>
                Ubah informasi dasar pengguna
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserBasicFields 
                control={form.control} 
                isLoading={isSubmitting}
              />
            </CardContent>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Role & Permissions</CardTitle>
              <CardDescription>
                Ubah role yang diberikan kepada pengguna
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserRoleFields 
                control={form.control} 
                isLoading={isSubmitting || isLoadingRoles}
                roles={roles}
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
