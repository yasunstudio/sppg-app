"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface UserCreateActionsProps {
  isSubmitting?: boolean
  onSubmit?: () => void
  formId?: string
}

export function UserCreateActions({ 
  isSubmitting = false, 
  onSubmit,
  formId = "user-create-form"
}: UserCreateActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" asChild>
        <Link href="/dashboard/users">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Link>
      </Button>
      
      <Button
        type="submit"
        form={formId}
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Creating...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Create User
          </>
        )}
      </Button>
    </div>
  )
}
