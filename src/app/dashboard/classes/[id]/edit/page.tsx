import { ClassEdit } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ClassEditPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ClassEditPageProps): Promise<Metadata> {
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
          title: `Edit ${classData.name} - Class Management | SPPG School System`,
          description: `Edit comprehensive class information for ${classData.name} (Grade ${classData.grade}). Update class details, enrollment capacity, teacher assignments, academic status, and student records for SPPG school system.`,
          keywords: [
            // Class specific
            "edit class", "update class", "class management", classData.name, `grade ${classData.grade}`,
            // Indonesian terms
            "edit kelas", "update kelas", "manajemen kelas", "ubah data kelas",
            // SPPG specific
            "SPPG class edit", "school class management", "student enrollment update",
            // Technical terms
            "class management system", "school database update", "class specifications",
            // Process terms
            "class modification", "enrollment management", "academic updates", "student records",
            // Feature terms
            "class documentation", "status updates", "capacity management", "teacher assignment"
          ],
          openGraph: {
            title: `Edit ${classData.name} - SPPG Class Management`,
            description: `Edit class information for Grade ${classData.grade} with ${classData.capacity} student capacity. Update enrollment, assignments, and specifications.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
            url: `/dashboard/classes/${id}/edit`,
          },
          twitter: {
            card: "summary",
            title: `Edit ${classData.name} - Class Management`,
            description: `Update class specifications and enrollment for SPPG school system.`,
          },
          robots: {
            index: false,
            follow: false,
            noarchive: true,
            nosnippet: true,
          },
          alternates: {
            canonical: `/dashboard/classes/${id}/edit`,
          },
          other: {
            "application-name": "SPPG Management System",
            "format-detection": "telephone=no",
            "mobile-web-app-capable": "yes",
            "apple-mobile-web-app-capable": "yes",
            "apple-mobile-web-app-status-bar-style": "default",
            "apple-mobile-web-app-title": `Edit ${classData.name}`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: "Edit Class - SPPG Management System",
    description: "Edit and update class information in the SPPG school management system.",
    keywords: ["edit class", "update class", "class management", "SPPG", "class maintenance"],
    openGraph: {
      title: "Edit Class - SPPG Management System",
      description: "Edit and update class information in the SPPG school management system.",
      type: "website",
      locale: "id_ID",
    },
    robots: {
      index: false,
      follow: false,
    }
  }
}

export default async function ClassEditPage({ params }: ClassEditPageProps) {
  const { id } = await params
  
  return (
    <PermissionGuard permission="schools.view" redirectTo="/dashboard/classes">
      <PageContainer
        title="Edit Kelas"
        description="Update informasi kelas dan pengaturan pendaftaran."
        showBreadcrumb={true}
        actions={
          <div className="flex gap-2">
            <Link href={`/dashboard/classes/${id}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Detail
              </Button>
            </Link>
          </div>
        }
      >
        <ClassEdit classId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
