"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface RolePageActionsProps {
  onRefresh?: () => void
}

export function RolePageActions({ onRefresh }: RolePageActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={onRefresh}
        className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Muat Ulang
      </Button>
      <Link href="/dashboard/roles/create">
        <Button className="dark:bg-blue-600 dark:hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Role
        </Button>
      </Link>
    </div>
  )
}
