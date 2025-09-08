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
          title: `Edit ${user.name} - User Management | SPPG User System`,
          description: `Edit comprehensive user information for ${user.name} (${user.email}). Update profile details, role assignments, account status, permissions, and security settings for SPPG system users.`,
          keywords: [
            // User specific
            "edit user", "update user", "user management", user.name, user.email, user.role,
            // Indonesian terms
            "edit pengguna", "update pengguna", "manajemen pengguna", "ubah data pengguna",
            // SPPG specific
            "SPPG user edit", "system user management", "user account update",
            // Technical terms
            "user management system", "user database update", "user profile update",
            // Process terms
            "user modification", "role assignment", "permission updates", "account settings",
            // Feature terms
            "user documentation", "status updates", "security settings", "profile management"
          ],
          openGraph: {
            title: `Edit ${user.name} - SPPG User Management`,
            description: `Edit user information for ${user.name} with ${user.role} role. Update profile, permissions, and account settings.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
            url: `/dashboard/users/${id}/edit`,
          },
          twitter: {
            card: "summary",
            title: `Edit ${user.name} - User Management`,
            description: `Update user profile and permissions for SPPG system.`,
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
            "apple-mobile-web-app-title": `Edit ${user.name}`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: "Edit User - SPPG Management System",
    description: "Edit and update user information in the SPPG user management system.",
    keywords: ["edit user", "update user", "user management", "SPPG", "user profile"],
    openGraph: {
      title: "Edit User - SPPG Management System",
      description: "Edit and update user information in the SPPG user management system.",
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
        title="Edit User"
        description="Update user information and account settings."
        showBreadcrumb={true}
        actions={
          <div className="flex gap-2">
            <Link href={`/dashboard/users/${id}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
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
