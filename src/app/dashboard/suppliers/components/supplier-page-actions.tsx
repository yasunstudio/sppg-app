"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import Link from "next/link"

interface SupplierPageActionsProps {
  onRefresh?: () => void
}

export function SupplierPageActions({ onRefresh }: SupplierPageActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Muat Ulang
      </Button>
      <Link href="/suppliers/create">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Supplier
        </Button>
      </Link>
    </div>
  )
}
