'use client'

import { UserEditForm } from "./forms/user-edit-form"

interface EditUserProps {
  userId: string
}

export function EditUser({ userId }: EditUserProps) {
  return <UserEditForm userId={userId} />
}
