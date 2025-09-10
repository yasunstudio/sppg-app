import { ClassDetails } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

interface ClassDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ClassDetailPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    // Fetch class data for dynamic metadata
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/classes/${id}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result && result.name) {
        const classData = result
        return {
          title: `${classData.name} - Class Details | SPPG School Management`,
          description: `Comprehensive class details for ${classData.name} (Grade ${classData.grade}) with ${classData.capacity} student capacity. View complete class information, enrollment status, teacher assignment, and academic performance metrics for SPPG school system.`,
          keywords: [
            // Class specific
            "class details", "school management", classData.name, `grade ${classData.grade}`,
            // Indonesian terms
            "detail kelas", "informasi kelas", "data kelas", "manajemen kelas",
            // SPPG specific
            "SPPG class", "school class management", "student enrollment", "academic system",
            // Technical terms
            "class specifications", "enrollment history", "academic status", "class analytics",
            // Process terms
            "class tracking", "student monitoring", "enrollment capacity", "academic history",
            // Feature terms
            "class documentation", "enrollment records", "academic statistics", "class metrics"
          ],
          openGraph: {
            title: `${classData.name} - SPPG Class Details`,
            description: `Grade ${classData.grade} class with ${classData.capacity} student capacity. Current enrollment: ${classData.currentCount}. Complete class information and academic history.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
            url: `/dashboard/classes/${id}`,
          },
          twitter: {
            card: "summary",
            title: `${classData.name} - Class Details`,
            description: `Grade ${classData.grade} class with detailed enrollment and academic information.`,
          },
          robots: {
            index: false, // Private admin page
            follow: false,
            noarchive: true,
            nosnippet: true,
          },
          alternates: {
            canonical: `/dashboard/classes/${id}`,
          },
          other: {
            "application-name": "SPPG Management System",
            "format-detection": "telephone=no",
            "mobile-web-app-capable": "yes",
            "apple-mobile-web-app-capable": "yes",
            "apple-mobile-web-app-status-bar-style": "default",
            "apple-mobile-web-app-title": `${classData.name} Details`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  // Fallback metadata
  return {
    title: "Class Details - SPPG School Management",
    description: "View detailed class information, enrollment status, and academic history in the SPPG school management system.",
    keywords: ["class details", "school management", "class information", "SPPG", "class specifications"],
    openGraph: {
      title: "Class Details - SPPG School Management",
      description: "View detailed class information and specifications in the SPPG management system.",
      type: "website",
      locale: "id_ID",
    },
    robots: {
      index: false,
      follow: false,
    }
  }
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = await params
  
  return (
    <PermissionGuard permission="schools.view" redirectTo="/dashboard/classes">
      <PageContainer
        title="Detail Kelas"
        description="Informasi lengkap kelas dan riwayat pendaftaran siswa."
        showBreadcrumb={true}
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard/classes">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Daftar
              </Button>
            </Link>
            <Link href={`/dashboard/classes/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Ubah Kelas
              </Button>
            </Link>
          </div>
        }
      >
        <ClassDetails classId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
