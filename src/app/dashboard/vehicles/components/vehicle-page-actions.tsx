"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface VehiclePageActionsProps {
  onRefresh?: () => void
}

export function VehiclePageActions({ onRefresh }: VehiclePageActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Link href="/dashboard/vehicles/create">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </Link>
    </div>
  )
}
