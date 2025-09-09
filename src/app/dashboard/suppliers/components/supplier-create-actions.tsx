"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, RotateCcw, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SupplierCreateActionsProps {
  onSave?: () => void
  onReset?: () => void
  isSaving?: boolean
  hasUnsavedChanges?: boolean
}

export function SupplierCreateActions({ 
  onSave, 
  onReset, 
  isSaving = false,
  hasUnsavedChanges = false 
}: SupplierCreateActionsProps) {
  const router = useRouter()
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true)
    } else {
      router.push('/suppliers')
    }
  }

  const confirmLeave = () => {
    router.push('/suppliers')
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
              >
                Batal
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={confirmLeave}
              >
                Tinggalkan
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={onReset}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Supplier
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
