"use client"

import { Button } from "@/components/ui/button"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface RoleCreateActionsProps {
  onSave?: () => void
  isSubmitting?: boolean
}

export function RoleCreateActions({ onSave, isSubmitting }: RoleCreateActionsProps) {
  return (
    <div className="flex gap-2">
      <Link href="/dashboard/roles">
        <Button 
          variant="outline"
          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>
      <Button 
        onClick={onSave} 
        disabled={isSubmitting}
        className="dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 mr-2 animate-spin border-2 border-gray-300 border-t-white rounded-full" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Simpan Role
          </>
        )}
      </Button>
    </div>
  )
}
