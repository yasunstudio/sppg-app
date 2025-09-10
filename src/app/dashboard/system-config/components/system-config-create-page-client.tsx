"use client"

import { CreateSystemConfig } from "./create-system-config"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function SystemConfigCreatePageClient() {
  return (
    <PageContainer
      title="Tambah Konfigurasi Sistem"
      description="Buat konfigurasi sistem baru untuk mengatur pengaturan aplikasi."
      showBreadcrumb={true}
      actions={
        <Link href="/dashboard/system-config">
          <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Link>
      }
    >
      <CreateSystemConfig />
    </PageContainer>
  )
}
