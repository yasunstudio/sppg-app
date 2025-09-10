'use client'

import { RoleEditForm } from './forms/role-edit-form'

interface EditRoleProps {
  roleId: string
}

export function EditRole({ roleId }: EditRoleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-gray-100">Edit Role</h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Perbarui informasi role dan permissions dalam sistem
        </p>
      </div>
      
      <RoleEditForm roleId={roleId} />
    </div>
  )
}
