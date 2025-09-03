import { Metadata } from "next"
import { PermissionGuard } from '@/components/guards/permission-guard'
import { RawMaterialEdit } from "../../components/raw-material-edit"
import { generateRawMaterialMetadata } from "../../components/utils/raw-material-metadata"

// Dynamic metadata generation for edit page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  // In a real app, you'd fetch the raw material data here:
  // const rawMaterial = await getRawMaterial(id)
  
  return generateRawMaterialMetadata('edit', {
    id,
    // name: rawMaterial?.name,
    // category: rawMaterial?.category
  })
}

export default async function RawMaterialEditPage() {
  return (
    <PermissionGuard permission="inventory.edit">
      <RawMaterialEdit />
    </PermissionGuard>
  )
}
