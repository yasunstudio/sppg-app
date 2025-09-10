'use client'

import { StudentEditForm } from "./forms/student-edit-form"

interface EditStudentProps {
  studentId: string
}

export function EditStudent({ studentId }: EditStudentProps) {
  return <StudentEditForm studentId={studentId} />
}
