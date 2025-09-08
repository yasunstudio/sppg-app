"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, Download } from "lucide-react"
import Link from "next/link"

interface WastePageActionsProps {
  onRefresh?: () => void
}

export function WastePageActions({ onRefresh }: WastePageActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Link href="/dashboard/waste-management/create">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Catatan
        </Button>
      </Link>
    </div>
  )
}
