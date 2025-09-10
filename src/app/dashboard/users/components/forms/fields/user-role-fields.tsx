"use client"

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Role {
  id: string
  name: string
  description?: string | null
}

interface UserRoleFieldsProps {
  control: Control<any>
  isLoading?: boolean
  roles?: Role[]
}

export function UserRoleFields({ control, isLoading, roles = [] }: UserRoleFieldsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="roleIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role Pengguna</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {roles.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-4 border rounded-lg">
                    Tidak ada role yang tersedia. Silakan buat role terlebih dahulu.
                  </div>
                ) : (
                  <div className="h-48 w-full border rounded-lg p-4 overflow-y-auto">
                    <div className="space-y-3">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={field.value?.includes(role.id) || false}
                            onCheckedChange={(checked) => {
                              const currentRoles = field.value || []
                              if (checked) {
                                field.onChange([...currentRoles, role.id])
                              } else {
                                field.onChange(
                                  currentRoles.filter((id: string) => id !== role.id)
                                )
                              }
                            }}
                            disabled={isLoading}
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{role.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {role.id}
                              </Badge>
                            </div>
                            {role.description && (
                              <p className="text-sm text-muted-foreground">
                                {role.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {field.value && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm font-medium">Role terpilih:</span>
                    {field.value.map((roleId: string) => {
                      const role = roles.find(r => r.id === roleId)
                      return role ? (
                        <Badge key={roleId} variant="secondary">
                          {role.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
