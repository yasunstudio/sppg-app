import { EditUser } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditUserPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditUserPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    // Fetch user data for dynamic metadata
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/${id}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        const user = result.data
        return {
          title: `Edit ${user.fullName} - Manajemen Pengguna | SPPG Management System`,
          description: `Edit informasi lengkap pengguna ${user.fullName} (${user.email}). Perbarui profil, peran, izin, status operasional, dokumentasi, dan catatan aktivitas untuk sistem SPPG.`,
          keywords: [
            // User specific
            "edit user", "update user", "user management", user.email, user.fullName,
            // Indonesian terms
            "edit pengguna", "update pengguna", "management pengguna", "ubah data pengguna",
            // SPPG specific
            "SPPG user edit", "SPPG pengguna edit", "sistem pengguna SPPG",
            // Technical terms
            "user management system", "user database update", "user specifications",
            // Process terms
            "user modification", "role assignment", "permission updates", "activity records",
            // Feature terms
            "user documentation", "status updates", "profile management", "access control"
          ],
          openGraph: {
            title: `Edit ${user.fullName} - SPPG Manajemen Pengguna`,
            description: `Edit informasi pengguna ${user.fullName} dengan email ${user.email}. Perbarui peran, izin, dan pengaturan.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
            url: `/dashboard/users/${id}/edit`,
          },
          twitter: {
            card: "summary",
            title: `Edit ${user.fullName} - Manajemen Pengguna`,
            description: `Perbarui spesifikasi pengguna dan pengaturan untuk sistem SPPG.`,
          },
          robots: {
            index: false,
            follow: false,
            noarchive: true,
            nosnippet: true,
          },
          alternates: {
            canonical: `/dashboard/users/${id}/edit`,
          },
          other: {
            "application-name": "SPPG Management System",
            "format-detection": "telephone=no",
            "mobile-web-app-capable": "yes",
            "apple-mobile-web-app-capable": "yes",
            "apple-mobile-web-app-status-bar-style": "default",
            "apple-mobile-web-app-title": `Edit ${user.fullName}`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: "Edit Pengguna - SPPG Management System",
    description: "Edit dan perbarui informasi pengguna dalam sistem manajemen SPPG.",
    keywords: ["edit pengguna", "update pengguna", "manajemen pengguna", "SPPG", "pengguna maintenance"],
    openGraph: {
      title: "Edit Pengguna - SPPG Management System",
      description: "Edit dan perbarui informasi pengguna dalam sistem manajemen SPPG.",
      type: "website",
      locale: "id_ID",
    },
    robots: {
      index: false,
      follow: false,
    }
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  
  return (
    <PermissionGuard permission="users.edit" redirectTo="/dashboard/users">
      <PageContainer
        title="Edit Pengguna"
        description="Perbarui informasi pengguna dan pengaturan peran."
        showBreadcrumb={true}
        actions={
          <div className="flex gap-2">
            <Link href={`/dashboard/users/${id}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Detail
              </Button>
            </Link>
          </div>
        }
      >
        <EditUser userId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
