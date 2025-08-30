import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Users, Shield, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "../components/user-form"
import { UserAvatarUpload } from "../components/user-avatar-upload"
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
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to create users.</p>
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
              <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
              <p className="text-muted-foreground">
                Add a new team member with complete profile information and role permissions.
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
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  Profile Picture
                </CardTitle>
                <CardDescription>
                  Upload a profile photo for the new user account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserAvatarUpload />
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  User Information
                </CardTitle>
                <CardDescription>
                  Complete the form below to create a new user account. All required fields are marked with an asterisk (*).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
