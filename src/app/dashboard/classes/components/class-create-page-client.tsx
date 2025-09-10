"use client"

import { CreateClass } from "./create-class"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ClassCreatePageClient() {
  return (
    <PageContainer
      title="Tambah Kelas Baru"
      description="Buat kelas baru dalam sistem manajemen sekolah."
      showBreadcrumb={true}
      actions={
        <Link href="/dashboard/classes">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Link>
      }
    >
      <CreateClass />
    </PageContainer>
  )
}
