'use client'

import { SystemConfigEditForm } from "./forms/system-config-edit-form"

interface EditSystemConfigProps {
  configId: string
}

export function EditSystemConfig({ configId }: EditSystemConfigProps) {
  return <SystemConfigEditForm configId={configId} />
}
