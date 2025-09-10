'use client'

import { SupplierEditForm } from "./forms/supplier-edit-form"

interface EditSupplierProps {
  supplierId: string
}

export function EditSupplier({ supplierId }: EditSupplierProps) {
  return <SupplierEditForm supplierId={supplierId} />
}
