import { EditVehicle } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

interface EditVehiclePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditVehiclePageProps): Promise<Metadata> {
  const { id } = await params
  
  return {
    title: "Edit Kendaraan - SPPG Management System",
    description: "Edit dan perbarui informasi kendaraan dalam sistem manajemen SPPG",
    keywords: ["edit kendaraan", "update kendaraan", "manajemen kendaraan", "SPPG", "vehicle management"],
    openGraph: {
      title: "Edit Kendaraan - SPPG Management System",
      description: "Edit dan perbarui informasi kendaraan dalam sistem manajemen SPPG",
      type: "website",
      locale: "id_ID",
    },
    robots: {
      index: false,
      follow: false,
    }
  }
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params
  
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard/vehicles">
      <EditVehicle vehicleId={id} />
    </PermissionGuard>
  )
}
