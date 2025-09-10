"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import Link from "next/link"

interface SchoolPageActionsProps {
  onRefresh?: () => void
}

export function SchoolPageActions({ onRefresh }: SchoolPageActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Muat Ulang
      </Button>
      <Link href="/dashboard/schools/create">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Sekolah
        </Button>
      </Link>
    </div>
  )
}
