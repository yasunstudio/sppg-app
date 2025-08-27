import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "../components/user-form"

export const metadata: Metadata = {
  title: "Create User",
  description: "Create a new user account",
}

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="hover:bg-muted">
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New User</h1>
          <p className="text-muted-foreground">
            Create a new user account with the required information.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl bg-card border-border">
        <CardHeader className="bg-card">
          <CardTitle className="text-foreground">User Information</CardTitle>
          <CardDescription className="text-muted-foreground">
            Fill out the form below to create a new user account.
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-card">
          <UserForm />
        </CardContent>
      </Card>
    </div>
  )
}
