"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, RotateCcw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WasteCreateActionsProps {
  onSave?: () => void
  onReset?: () => void
  isSaving?: boolean
  hasUnsavedChanges?: boolean
}

export function WasteCreateActions({ 
  onSave, 
  onReset, 
  isSaving = false,
  hasUnsavedChanges = false 
}: WasteCreateActionsProps) {
  const router = useRouter()
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true)
    } else {
      router.push('/dashboard/waste-management')
    }
  }

  const handleConfirmLeave = () => {
    router.push('/dashboard/waste-management')
  }

  const handleCancelLeave = () => {
    setShowUnsavedWarning(false)
  }

  return (
    <div className="space-y-4">
      {showUnsavedWarning && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Are you sure you want to leave this page?
            <div className="flex gap-2 mt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmLeave}
              >
                Leave without saving
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelLeave}
              >
                Stay on page
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Waste Management
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={isSaving}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Form
          </Button>
          
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Creating...' : 'Create Waste Record'}
          </Button>
        </div>
      </div>
    </div>
  )
}
