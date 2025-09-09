import { EditDriver } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditDriverPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditDriverPageProps): Promise<Metadata> {
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
          title: `Edit ${driver.name} - Driver Management | SPPG Transportation System`,
          description: `Edit comprehensive driver information for ${driver.name} (${driver.employeeId}). Update licenses, contact information, emergency contacts, operational status, and service records for SPPG food distribution network.`,
          keywords: [
            // Primary keywords
            "edit driver", "update driver information", "driver management", "transportation update",
            // Indonesian keywords
            "edit driver", "update informasi driver", "manajemen driver", "update transportasi",
            // SPPG specific
            `SPPG driver ${driver.name}`, `edit ${driver.employeeId}`, "food distribution driver update",
            // Technical keywords
            "driver database update", "license management", "emergency contact update",
            // Process keywords
            "driver profile editing", "transportation system update", "driver documentation edit",
            // Feature keywords
            "license renewal", "driver status change", "contact information update"
          ],
          openGraph: {
            title: `Edit Driver ${driver.name} - SPPG Transportation Management`,
            description: `Update comprehensive driver information for ${driver.name} in SPPG food distribution network.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
            url: `/dashboard/drivers/${id}/edit`,
          },
          twitter: {
            card: "summary",
            title: `Edit Driver ${driver.name} - SPPG Transportation`,
            description: `Update driver information for ${driver.name} in SPPG system.`,
          },
        }
      }
    }
  } catch (error) {
    console.error('Error fetching driver for metadata:', error)
  }

  // Fallback metadata
  return {
    title: "Edit Driver - Transportation Management | SPPG Management System",
    description: "Edit driver information in SPPG transportation management system. Update licenses, contact details, emergency information, and operational status for food distribution network.",
    robots: {
      index: false, // Private admin form
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
    alternates: {
      canonical: `/dashboard/drivers/${id}/edit`,
    },
  }
}

export default async function EditDriverPage({ params }: EditDriverPageProps) {
  const { id } = await params

  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard/drivers">
      <PageContainer
        title="Edit Driver"
        description="Perbarui informasi driver dalam sistem manajemen transportasi."
        showBreadcrumb={true}
        actions={
          <Link href="/dashboard/drivers">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar
            </Button>
          </Link>
        }
      >
        <EditDriver driverId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
