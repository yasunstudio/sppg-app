import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, Shield, UserPlus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "../../components/user-form"
import { UserAvatarUpload } from "../../components/user-avatar-upload"
import { getUser } from "../../actions"
import { PermissionGuard } from "@/hooks/use-permissions"

interface Props {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  return {
    title: `Edit User ${userId} | SPPG`,
    description: "Edit user account information and role assignment",
  }
}

export default async function EditUserPage({ params }: Props) {
  const { userId } = await params
  
  let user
  try {
    user = await getUser(userId)
  } catch (error) {
    notFound()
  }

  if (!user) {
    notFound()
  }

  return (
    <PermissionGuard 
      permission={["users.edit"]} 
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to edit users.</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard/users">
                <Users className="mr-2 h-4 w-4" />
                Back to Users
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              asChild
              className="h-10 w-10 rounded-full"
            >
              <Link href="/dashboard/users">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
              <p className="text-muted-foreground">
                Update {user.name || user.email}'s account information and role assignment.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Edit className="h-5 w-5 text-blue-600" />
                  Profile Picture
                </CardTitle>
                <CardDescription>
                  Update the profile photo for this user account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserAvatarUpload 
                  value={user.avatar}
                  userName={user.name}
                  userEmail={user.email}
                  userId={userId}
                />
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Edit className="h-5 w-5 text-blue-600" />
                  User Information
                </CardTitle>
                <CardDescription>
                  Update the user details below to modify the account. All required fields are marked with an asterisk (*).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm user={user} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
