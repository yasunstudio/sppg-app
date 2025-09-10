'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Control, Controller } from "react-hook-form"
import { User, Role } from "../../utils/user-role-types"

interface UserRoleBasicFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
  users?: User[]
  roles?: Role[]
}

export function UserRoleBasicFields({ 
  control, 
  isSubmitting = false,
  title = "Basic Assignment",
  description,
  users = [],
  roles = []
}: UserRoleBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* User Selection */}
      <Controller
        control={control}
        name="userId"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>User</Label>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className={fieldState.error ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">({user.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Role Selection */}
      <Controller
        control={control}
        name="roleId"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Role</Label>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className={fieldState.error ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex flex-col">
                      <span>{role.name}</span>
                      {role.description && (
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  )
}
