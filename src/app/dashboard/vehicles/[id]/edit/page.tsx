import { EditVehicle } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditVehiclePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditVehiclePageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    // Fetch vehicle data for dynamic metadata
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/vehicles/${id}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        const vehicle = result.data
        return {
          title: `Edit ${vehicle.plateNumber} - Vehicle Management | SPPG Fleet System`,
          description: `Edit comprehensive vehicle information for ${vehicle.plateNumber} (${vehicle.type}). Update specifications, maintenance schedules, operational status, documentation, and service records for SPPG food distribution network.`,
          keywords: [
            // Vehicle specific
            "edit vehicle", "update vehicle", "vehicle maintenance", vehicle.plateNumber, vehicle.type,
            // Indonesian terms
            "edit kendaraan", "update kendaraan", "maintenance kendaraan", "ubah data kendaraan",
            // SPPG specific
            "SPPG vehicle edit", "food distribution vehicle", "delivery vehicle update",
            // Technical terms
            "vehicle management system", "fleet database update", "vehicle specifications",
            // Process terms
            "vehicle modification", "maintenance scheduling", "operational updates", "service records",
            // Feature terms
            "vehicle documentation", "status updates", "capacity management", "route assignment"
          ],
          openGraph: {
            title: `Edit ${vehicle.plateNumber} - SPPG Vehicle Management`,
            description: `Edit vehicle information for ${vehicle.type} with ${vehicle.capacity} kg capacity. Update maintenance, operations, and specifications.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
            url: `/dashboard/vehicles/${id}/edit`,
          },
          twitter: {
            card: "summary",
            title: `Edit ${vehicle.plateNumber} - Vehicle Management`,
            description: `Update vehicle specifications and maintenance for SPPG fleet.`,
          },
          robots: {
            index: false,
            follow: false,
            noarchive: true,
            nosnippet: true,
          },
          alternates: {
            canonical: `/dashboard/vehicles/${id}/edit`,
          },
          other: {
            "application-name": "SPPG Management System",
            "format-detection": "telephone=no",
            "mobile-web-app-capable": "yes",
            "apple-mobile-web-app-capable": "yes",
            "apple-mobile-web-app-status-bar-style": "default",
            "apple-mobile-web-app-title": `Edit ${vehicle.plateNumber}`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: "Edit Vehicle - SPPG Management System",
    description: "Edit and update vehicle information in the SPPG fleet management system.",
    keywords: ["edit vehicle", "update vehicle", "vehicle management", "SPPG", "vehicle maintenance"],
    openGraph: {
      title: "Edit Vehicle - SPPG Management System",
      description: "Edit and update vehicle information in the SPPG fleet management system.",
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
      <PageContainer
        title="Edit Vehicle"
        description="Update vehicle information and maintenance settings."
        showBreadcrumb={true}
        actions={
          <div className="flex gap-2">
            <Link href={`/dashboard/vehicles/${id}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Detail
              </Button>
            </Link>
          </div>
        }
      >
        <EditVehicle vehicleId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
