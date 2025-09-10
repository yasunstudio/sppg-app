"use client"

import { UserCreateForm } from "./forms"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function UserCreatePageClient() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/users")
  }

  const handleCancel = () => {
    router.push("/dashboard/users")
  }

  return (
    <PageContainer
      title="Tambah Pengguna Baru"
      description="Daftarkan pengguna baru ke dalam sistem manajemen SPPG."
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
      <UserCreateForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </PageContainer>
  )
}
