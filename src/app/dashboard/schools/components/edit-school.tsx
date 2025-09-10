'use client'

import { SchoolEditForm } from "./forms/school-edit-form"

interface EditSchoolProps {
  schoolId: string
}

export function EditSchool({ schoolId }: EditSchoolProps) {
  return <SchoolEditForm schoolId={schoolId} />
}

export default EditSchool
