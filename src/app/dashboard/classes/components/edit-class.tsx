'use client'

import { ClassEditForm } from "./forms/class-edit-form"

interface EditClassProps {
  classId: string
}

export function EditClass({ classId }: EditClassProps) {
  return <ClassEditForm classId={classId} />
}
