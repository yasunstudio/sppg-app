"use client"

import { CreateDriver } from "./create-driver"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function DriverCreatePageClient() {
  return (
    <PageContainer
      title="Tambah Driver Baru"
      description="Daftarkan driver baru ke dalam sistem manajemen transportasi."
      showBreadcrumb={true}
      actions={
        <Link href="/dashboard/drivers">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Link>
      }
    >
      <CreateDriver />
    </PageContainer>
  )
}
