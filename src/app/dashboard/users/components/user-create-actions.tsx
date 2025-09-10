"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, RotateCcw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserCreateActionsProps {
  onSave?: () => void
  onReset?: () => void
  isSaving?: boolean
  hasUnsavedChanges?: boolean
}

export function UserCreateActions({ 
  onSave, 
  onReset, 
  isSaving = false,
  hasUnsavedChanges = false 
}: UserCreateActionsProps) {
  const router = useRouter()
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true)
    } else {
      router.push('/dashboard/users')
    }
  }

  const confirmLeave = () => {
    setShowUnsavedWarning(false)
    router.push('/dashboard/users')
  }

  const cancelLeave = () => {
    setShowUnsavedWarning(false)
  }

  return (
    <div className="space-y-4">
      {showUnsavedWarning && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ada perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="destructive" onClick={confirmLeave}>
                Ya, Tinggalkan
              </Button>
              <Button size="sm" variant="outline" onClick={cancelLeave}>
                Batal
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar
        </Button>
        
        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            onClick={onReset}
            disabled={isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Menyimpan...' : 'Simpan Pengguna'}
          </Button>
        </div>
      </div>
    </div>
  )
}
