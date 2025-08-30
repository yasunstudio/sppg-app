import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "../../components/user-form"
import { getUser } from "../../actions"

interface Props {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  return {
    title: `Edit User ${userId}`,
    description: "Edit user account information",
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
            Update {user.name}'s account information
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Update the user details below to modify the account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
