import { UserDetails } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

interface UserDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: UserDetailPageProps): Promise<Metadata> {
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
          title: `${user.fullName} - Detail Pengguna | SPPG Manajemen Pengguna`,
          description: `Informasi lengkap pengguna ${user.fullName} (${user.email}) dengan peran ${user.roles?.map((r: any) => r.role.name).join(', ')}. Lihat spesifikasi lengkap, riwayat aktivitas, status operasional, dan metrik kinerja untuk sistem SPPG.`,
          keywords: [
            // User specific
            "user details", "pengguna details", user.email, user.fullName,
            // Indonesian terms
            "detail pengguna", "informasi pengguna", "spesifikasi pengguna", "data pengguna",
            // SPPG specific
            "SPPG user", "SPPG pengguna", "sistem pengguna", "database pengguna",
            // Technical terms
            "user specifications", "activity history", "operational status", "user analytics",
            // Process terms
            "user tracking", "performance monitoring", "role management", "permission history",
            // Feature terms
            "user documentation", "activity records", "usage statistics", "operational metrics"
          ],
          openGraph: {
            title: `${user.fullName} - SPPG Detail Pengguna`,
            description: `${user.fullName} dengan email ${user.email}. Status: ${user.isActive ? 'Aktif' : 'Tidak Aktif'}. Informasi lengkap pengguna dan riwayat aktivitas.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
            url: `/dashboard/users/${id}`,
          },
          twitter: {
            card: "summary",
            title: `${user.fullName} - Detail Pengguna`,
            description: `${user.fullName} dengan spesifikasi lengkap dan riwayat aktivitas.`,
          },
          robots: {
            index: false, // Private admin page
            follow: false,
            noarchive: true,
            nosnippet: true,
          },
          alternates: {
            canonical: `/dashboard/users/${id}`,
          },
          other: {
            "application-name": "SPPG Management System",
            "format-detection": "telephone=no",
            "mobile-web-app-capable": "yes",
            "apple-mobile-web-app-capable": "yes",
            "apple-mobile-web-app-status-bar-style": "default",
            "apple-mobile-web-app-title": `${user.fullName} Details`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  // Fallback metadata
  return {
    title: "Detail Pengguna - SPPG Manajemen Pengguna",
    description: "Lihat informasi lengkap pengguna, spesifikasi, dan riwayat aktivitas dalam sistem manajemen SPPG.",
    keywords: ["detail pengguna", "manajemen pengguna", "informasi pengguna", "SPPG", "spesifikasi pengguna"],
    openGraph: {
      title: "Detail Pengguna - SPPG Manajemen Pengguna",
      description: "Lihat informasi lengkap pengguna dan spesifikasi dalam sistem manajemen SPPG.",
      type: "website",
      locale: "id_ID",
    },
    robots: {
      index: false,
      follow: false,
    }
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  
  return (
    <PermissionGuard permission="users.view" redirectTo="/dashboard/users">
      <PageContainer
        title="Detail Pengguna"
        description="Informasi lengkap pengguna dan riwayat aktivitas."
        showBreadcrumb={true}
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard/users">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Daftar
              </Button>
            </Link>
            <Link href={`/dashboard/users/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Ubah Pengguna
              </Button>
            </Link>
          </div>
        }
      >
        <UserDetails userId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}