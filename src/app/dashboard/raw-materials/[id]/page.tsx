import { Metadata } from "next"
import { PermissionGuard } from '@/components/guards/permission-guard'
import { RawMaterialDetails } from "../components/raw-material-details"
import { generateRawMaterialMetadata } from "../components/utils/raw-material-metadata"

// This would typically fetch data to get the raw material name
// For now using static metadata, but can be made dynamic
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  // In a real app, you'd fetch the raw material data here:
  // const rawMaterial = await getRawMaterial(id)
  
  return generateRawMaterialMetadata('detail', {
    id,
    // name: rawMaterial?.name,
    // category: rawMaterial?.category,
    // description: rawMaterial?.description
  })
}

export default async function RawMaterialDetailsPage() {
  return (
    <PermissionGuard permission="inventory.view">
      <RawMaterialDetails />
    </PermissionGuard>
  )
}
