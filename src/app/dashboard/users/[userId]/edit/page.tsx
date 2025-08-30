import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "../../components/user-form"
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
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to edit users.</p>
            <Button asChild>
              <Link href="/dashboard/users">
                Back to Users
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            <p className="text-muted-foreground">
              Update {user.name || user.email}'s account information and role assignment
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update the user details below to modify the account. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm user={user} />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  )
}
}
}
