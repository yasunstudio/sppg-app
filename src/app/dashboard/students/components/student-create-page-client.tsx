"use client"

import { CreateStudent } from "./create-student"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function StudentCreatePageClient() {
  return (
    <PageContainer
      title="Tambah Siswa Baru"
      description="Daftarkan siswa baru ke dalam sistem manajemen pendidikan."
      showBreadcrumb={true}
      actions={
        <Link href="/dashboard/students">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Link>
      }
    >
      <CreateStudent />
    </PageContainer>
  )
}
