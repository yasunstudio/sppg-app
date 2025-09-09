'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2, Save, RotateCcw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DriverCreateActionsProps {
  onSave: () => void | Promise<void>
  onReset: () => void
  isSubmitting: boolean
  hasUnsavedChanges: boolean
  className?: string
}

export function DriverCreateActions({
  onSave,
  onReset,
  isSubmitting,
  hasUnsavedChanges,
  className = ""
}: DriverCreateActionsProps) {
  const router = useRouter()
  const [showUnsavedAlert, setShowUnsavedAlert] = useState(false)

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedAlert(true)
    } else {
      router.push('/dashboard/drivers')
    }
  }

  const confirmLeave = () => {
    router.push('/dashboard/drivers')
  }

  const cancelLeave = () => {
    setShowUnsavedAlert(false)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Unsaved Changes Alert */}
      {showUnsavedAlert && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={cancelLeave}>
                Batal
              </Button>
              <Button size="sm" variant="destructive" onClick={confirmLeave}>
                Keluar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Kembali
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isSubmitting || !hasUnsavedChanges}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        
        <Button
          type="button"
          onClick={onSave}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan Driver
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
