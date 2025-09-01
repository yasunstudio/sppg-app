'use client'

import { MenuCreateHeader } from './menu-create-header'
import { MenuCreateForm } from './menu-create-form'
import { MenuCreateGuidelines } from './menu-create-guidelines'

export function MenuCreateManagement() {
  return (
    <div className="space-y-6">
      <MenuCreateHeader />
      <MenuCreateForm />
      <MenuCreateGuidelines />
    </div>
  )
}
