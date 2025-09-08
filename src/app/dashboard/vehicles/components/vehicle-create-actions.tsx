"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, RotateCcw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VehicleCreateActionsProps {
  onSave?: () => void
  onReset?: () => void
  isSaving?: boolean
  hasUnsavedChanges?: boolean
}

export function VehicleCreateActions({ 
  onSave, 
  onReset, 
  isSaving = false,
  hasUnsavedChanges = false 
}: VehicleCreateActionsProps) {
  const router = useRouter()
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true)
    } else {
      router.push('/dashboard/vehicles')
    }
  }

  const confirmLeave = () => {
    router.push('/dashboard/vehicles')
  }

  return (
    <div className="space-y-4">
      {/* Unsaved Changes Warning */}
      {showUnsavedWarning && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?
            <div className="mt-2 flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowUnsavedWarning(false)}
                className="h-7"
              >
                Batal
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={confirmLeave}
                className="h-7"
              >
                Tinggalkan Tanpa Menyimpan
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={handleBackClick}
          disabled={isSaving}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar
        </Button>
        
        {onReset && (
          <Button 
            variant="outline" 
            onClick={onReset}
            disabled={isSaving}
            className="text-muted-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Form
          </Button>
        )}
        
        {onSave && (
          <Button 
            onClick={onSave}
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Kendaraan
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
