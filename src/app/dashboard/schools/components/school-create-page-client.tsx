"use client"

import { CreateSchool } from "./create-school"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function SchoolCreatePageClient() {
  return (
    <PageContainer
      title="Tambah Sekolah Baru"
      description="Daftarkan sekolah baru ke dalam sistem manajemen pendidikan."
      showBreadcrumb={true}
      actions={
        <Link href="/dashboard/schools">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Link>
      }
    >
      <CreateSchool />
    </PageContainer>
  )
}
