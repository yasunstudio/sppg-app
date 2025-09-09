"use client"

import { CreateSupplier } from "./create-supplier"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function SupplierCreatePageClient() {
  return (
    <PageContainer
      title="Tambah Supplier Baru"
      description="Daftarkan supplier baru ke dalam sistem manajemen rantai pasok."
      showBreadcrumb={true}
      actions={
        <Link href="/suppliers">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Link>
      }
    >
      <CreateSupplier />
    </PageContainer>
  )
}
