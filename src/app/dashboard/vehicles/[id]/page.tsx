import { VehicleDetails } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

interface VehicleDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: VehicleDetailPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    // Fetch vehicle data for metadata
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/vehicles/${id}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        const vehicle = result.data
        return {
          title: `${vehicle.plateNumber} - Detail Kendaraan | SPPG System`,
          description: `Detail lengkap kendaraan ${vehicle.plateNumber} jenis ${vehicle.type} dengan kapasitas ${vehicle.capacity} kg. Status: ${vehicle.isActive ? 'Aktif' : 'Tidak Aktif'}.`,
          keywords: [
            'kendaraan', 'detail kendaraan', 'fleet management', 
            vehicle.plateNumber, vehicle.type, 'SPPG', 'sistem kendaraan'
          ],
          openGraph: {
            title: `${vehicle.plateNumber} - Detail Kendaraan`,
            description: `Kendaraan ${vehicle.type} dengan kapasitas ${vehicle.capacity} kg`,
            type: 'website',
          },
          robots: {
            index: false, // Private admin page
            follow: false,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  // Fallback metadata
  return {
    title: 'Detail Kendaraan | SPPG System',
    description: 'Informasi detail kendaraan dalam sistem manajemen SPPG',
    robots: {
      index: false,
      follow: false,
    }
  }
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { id } = await params
  
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard/vehicles">
      <VehicleDetails vehicleId={id} />
    </PermissionGuard>
  )
}
