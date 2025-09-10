'use client'

import { Control } from "react-hook-form"

interface UserRoleStatusFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function UserRoleStatusFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Tambahan",
  description
}: UserRoleStatusFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        Penugasan role pengguna otomatis aktif saat dibuat. 
        Untuk mencabut akses, hapus penugasan tersebut.
      </p>
    </div>
  )
}
