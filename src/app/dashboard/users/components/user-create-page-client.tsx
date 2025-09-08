"use client"

import { CreateUser } from "./create-user"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function UserCreatePageClient() {
  return (
    <PageContainer
      title="Add New User"
      description="Register a new user to your SPPG management system."
      showBreadcrumb={true}
      actions={
        <Link href="/dashboard/users">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </Link>
      }
    >
      <CreateUser />
    </PageContainer>
  )
}
