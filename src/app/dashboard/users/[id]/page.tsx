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
          title: `${user.name} - User Details | SPPG User Management`,
          description: `Comprehensive user details for ${user.name} (${user.email}) with ${user.role} role. View complete profile information, account status, permissions, and activity history for SPPG system users.`,
          keywords: [
            'user management',
            'user profile',
            'account details',
            'user information',
            user.name,
            user.email,
            user.role,
            'SPPG users'
          ],
          openGraph: {
            title: `${user.name} - User Profile | SPPG`,
            description: `View detailed information for user ${user.name} including role, status, and account details.`,
            type: 'profile',
          },
        }
      }
    }
    
    // Fallback metadata if API call fails or returns invalid data
    return {
      title: 'User Details | SPPG User Management',
      description: 'View comprehensive user information including profile details, role permissions, and account status in the SPPG system.',
      keywords: [
        'user management',
        'user profile',
        'account details',
        'user information',
        'SPPG users'
      ],
      openGraph: {
        title: 'User Details | SPPG',
        description: 'View detailed user information and account management.',
        type: 'profile',
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'User Details | SPPG User Management',
      description: 'View comprehensive user information including profile details, role permissions, and account status in the SPPG system.',
      robots: {
        index: false,
        follow: false,
      }
    }
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params

  return (
    <PermissionGuard permission="users.view" redirectTo="/dashboard/users">
      <PageContainer
        title="User Details"
        description="View detailed information about this user and their account history."
        showBreadcrumb={true}
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard/users">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </Link>
            <PermissionGuard permission="users.edit" fallback={null}>
              <Link href={`/dashboard/users/${id}/edit`}>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
              </Link>
            </PermissionGuard>
          </div>
        }
      >
        <UserDetails userId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}