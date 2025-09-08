import { VehicleDetails } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

interface VehicleDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: VehicleDetailPageProps): Promise<Metadata> {
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
          title: `${vehicle.plateNumber} - Vehicle Details | SPPG Fleet Management`,
          description: `Comprehensive vehicle details for ${vehicle.plateNumber} (${vehicle.type}) with ${vehicle.capacity} kg capacity. View complete specifications, maintenance history, operational status, and performance metrics for SPPG food distribution fleet.`,
          keywords: [
            // Vehicle specific
            "vehicle details", "fleet management", vehicle.plateNumber, vehicle.type,
            // Indonesian terms
            "detail kendaraan", "informasi kendaraan", "spesifikasi kendaraan", "data kendaraan",
            // SPPG specific
            "SPPG vehicle", "food distribution vehicle", "delivery fleet", "vehicle database",
            // Technical terms
            "vehicle specifications", "maintenance history", "operational status", "fleet analytics",
            // Process terms
            "vehicle tracking", "performance monitoring", "delivery capacity", "route history",
            // Feature terms
            "vehicle documentation", "service records", "usage statistics", "operational metrics"
          ],
          openGraph: {
            title: `${vehicle.plateNumber} - SPPG Vehicle Details`,
            description: `${vehicle.type} with ${vehicle.capacity} kg capacity. Status: ${vehicle.isActive ? 'Active' : 'Inactive'}. Complete vehicle information and maintenance history.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
            url: `/dashboard/vehicles/${id}`,
          },
          twitter: {
            card: "summary",
            title: `${vehicle.plateNumber} - Vehicle Details`,
            description: `${vehicle.type} vehicle with detailed specifications and maintenance history.`,
          },
          robots: {
            index: false, // Private admin page
            follow: false,
            noarchive: true,
            nosnippet: true,
          },
          alternates: {
            canonical: `/dashboard/vehicles/${id}`,
          },
          other: {
            "application-name": "SPPG Management System",
            "format-detection": "telephone=no",
            "mobile-web-app-capable": "yes",
            "apple-mobile-web-app-capable": "yes",
            "apple-mobile-web-app-status-bar-style": "default",
            "apple-mobile-web-app-title": `${vehicle.plateNumber} Details`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  // Fallback metadata
  return {
    title: "Vehicle Details - SPPG Fleet Management",
    description: "View detailed vehicle information, specifications, and maintenance history in the SPPG fleet management system.",
    keywords: ["vehicle details", "fleet management", "vehicle information", "SPPG", "vehicle specifications"],
    openGraph: {
      title: "Vehicle Details - SPPG Fleet Management",
      description: "View detailed vehicle information and specifications in the SPPG management system.",
      type: "website",
      locale: "id_ID",
    },
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
      <PageContainer
        title="Vehicle Details"
        description="View detailed information about this vehicle and its maintenance history."
        showBreadcrumb={true}
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard/vehicles">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </Link>
            <Link href={`/dashboard/vehicles/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Vehicle
              </Button>
            </Link>
          </div>
        }
      >
        <VehicleDetails vehicleId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
