'use client'

import { RoleCreateForm } from './forms/role-create-form'

export function CreateRole() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-gray-100">Tambah Role Baru</h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Buat role baru dengan mengatur permissions dan akses pengguna
        </p>
      </div>
      
      <RoleCreateForm />
    </div>
  )
}
