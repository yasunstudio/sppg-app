import { DriverDetails } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

interface DriverDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: DriverDetailPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    // Fetch driver data for dynamic metadata
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/drivers/${id}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        const driver = result.data
        return {
          title: `${driver.name} (${driver.employeeId}) - Driver Details | SPPG Transportation System`,
          description: `View comprehensive driver information for ${driver.name}. Check licenses, contact details, emergency information, delivery history, performance metrics, and operational status for SPPG food distribution network.`,
          keywords: [
            // Primary keywords
            "driver details", "driver profile", "transportation management", "driver information",
            // Indonesian keywords
            "detail driver", "profil driver", "manajemen transportasi", "informasi driver",
            // SPPG specific
            `SPPG driver ${driver.name}`, `driver ${driver.employeeId}`, "food distribution driver profile",
            // Technical keywords
            "driver database", "license information", "emergency contacts", "delivery history",
            // Process keywords
            "driver profile view", "transportation system", "driver documentation review",
            // Feature keywords
            "performance metrics", "license status", "delivery tracking", "contact management"
          ],
          openGraph: {
            title: `Driver ${driver.name} - SPPG Transportation Management`,
            description: `View comprehensive driver information for ${driver.name} in SPPG food distribution network.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
            url: `/dashboard/drivers/${id}`,
          },
          twitter: {
            card: "summary",
            title: `Driver ${driver.name} - SPPG Transportation`,
            description: `View driver information for ${driver.name} in SPPG system.`,
          },
        }
      }
    }
  } catch (error) {
    console.error('Error fetching driver for metadata:', error)
  }

  // Fallback metadata
  return {
    title: "Driver Details - Transportation Management | SPPG Management System",
    description: "View driver information in SPPG transportation management system. Check licenses, contact details, emergency information, and delivery history for food distribution network.",
    keywords: [
      // Primary keywords
      "driver details", "driver profile", "transportation management", "driver view",
      // Indonesian keywords
      "detail driver", "profil driver", "manajemen transportasi", "lihat driver",
      // SPPG specific
      "SPPG driver profile", "food distribution driver details", "delivery driver information",
      // Technical keywords
      "driver database", "license management", "emergency contacts", "delivery tracking",
      // Process keywords
      "driver profile view", "transportation system", "driver information review",
      // Feature keywords
      "performance metrics", "status monitoring", "contact information", "delivery history"
    ],
    openGraph: {
      title: "Driver Details - SPPG Transportation Management",
      description: "View driver information in SPPG food distribution network.",
      type: "website",
      siteName: "SPPG Management System",
      locale: "id_ID",
    },
    twitter: {
      card: "summary",
      title: "Driver Details - SPPG Transportation",
      description: "View driver information in SPPG system.",
    },
    robots: {
      index: false, // Private admin view
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
    alternates: {
      canonical: `/dashboard/drivers/${id}`,
    },
    other: {
      "application-name": "SPPG Management System",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": "SPPG Driver Details",
    }
  }
}

export default async function DriverDetailPage({ params }: DriverDetailPageProps) {
  const { id } = await params

  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard/drivers">
      <PageContainer
        title="Detail Driver"
        description="Lihat informasi lengkap driver dalam sistem manajemen transportasi."
        showBreadcrumb={true}
        actions={
          <div className="flex gap-2">
            <Link href={`/dashboard/drivers/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Driver
              </Button>
            </Link>
            <Link href="/dashboard/drivers">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Daftar
              </Button>
            </Link>
          </div>
        }
      >
        <DriverDetails driverId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
