import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "../components/user-form"
import { PermissionGuard } from "@/hooks/use-permissions"

export const metadata: Metadata = {
  title: "Create User | SPPG",
  description: "Create a new user account with comprehensive information and role assignment",
}

export default function CreateUserPage() {
  return (
    <PermissionGuard 
      permission={["users.create"]} 
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to create users.</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
            <p className="text-muted-foreground">
              Create a new user account with comprehensive information and role assignment.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Fill out the form below to create a new user account. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  )
}
