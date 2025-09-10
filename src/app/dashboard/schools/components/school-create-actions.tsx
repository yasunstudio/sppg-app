"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, RotateCcw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SchoolCreateActionsProps {
  onSave?: () => void
  onReset?: () => void
  isSaving?: boolean
  hasUnsavedChanges?: boolean
}

export function SchoolCreateActions({ 
  onSave, 
  onReset, 
  isSaving = false,
  hasUnsavedChanges = false 
}: SchoolCreateActionsProps) {
  const router = useRouter()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleReset = () => {
    if (hasUnsavedChanges) {
      setShowResetConfirm(true)
    } else {
      onReset?.()
    }
  }

  const handleConfirmReset = () => {
    onReset?.()
    setShowResetConfirm(false)
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?'
      )
      if (!confirmed) return
    }
    router.push('/dashboard/schools')
  }

  return (
    <div className="space-y-4">
      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Anda memiliki perubahan yang belum disimpan. Pastikan untuk menyimpan sebelum meninggalkan halaman.
          </AlertDescription>
        </Alert>
      )}

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Yakin ingin mengatur ulang semua field? Perubahan akan hilang.</span>
            <div className="flex gap-2 ml-4">
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleConfirmReset}
              >
                Ya, Reset
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowResetConfirm(false)}
              >
                Batal
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={isSaving}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar
        </Button>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Sekolah
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
