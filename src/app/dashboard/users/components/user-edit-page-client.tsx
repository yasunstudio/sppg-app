"use client"

import { UserEditForm } from "./forms"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserEditPageClientProps {
  userId: string
}

export function UserEditPageClient({ userId }: UserEditPageClientProps) {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/users")
  }

  const handleCancel = () => {
    router.push("/dashboard/users")
  }

  return (
    <PageContainer
      title="Edit Pengguna"
      description="Ubah informasi pengguna dalam sistem manajemen SPPG."
      showBreadcrumb={true}
      actions={
        <Link href="/dashboard/users">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Link>
      }
    >
      <UserEditForm 
        userId={userId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </PageContainer>
  )
}
