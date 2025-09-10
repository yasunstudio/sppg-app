"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import Link from "next/link"

interface StudentPageActionsProps {
  onRefresh?: () => void
}

export function StudentPageActions({ onRefresh }: StudentPageActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Muat Ulang
      </Button>
      <Link href="/dashboard/students/create">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Siswa
        </Button>
      </Link>
    </div>
  )
}
