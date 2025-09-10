"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { WasteRecord } from "../utils"

interface UseWasteRecordDetailsOptions {
  wasteRecordId: string
  enabled?: boolean
}

export function useWasteRecordDetails({ wasteRecordId, enabled = true }: UseWasteRecordDetailsOptions) {
  const [wasteRecord, setWasteRecord] = useState<WasteRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWasteRecord = async () => {
    if (!enabled || !wasteRecordId) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/waste-records/${wasteRecordId}`)
      
      if (!response.ok) {
        throw new Error("Gagal memuat data pencatatan limbah")
      }

      const data = await response.json()
      setWasteRecord(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat memuat pencatatan limbah"
      setError(errorMessage)
      toast.error("Gagal memuat pencatatan limbah", {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshWasteRecord = () => {
    fetchWasteRecord()
  }

  const deleteWasteRecord = async () => {
    try {
      const response = await fetch(`/api/waste-records/${wasteRecordId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Gagal menghapus pencatatan limbah")
      }

      toast.success("Pencatatan limbah berhasil dihapus")
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus pencatatan limbah"
      toast.error("Gagal menghapus pencatatan limbah", {
        description: errorMessage
      })
      return false
    }
  }

  useEffect(() => {
    fetchWasteRecord()
  }, [wasteRecordId, enabled])

  return {
    wasteRecord,
    isLoading,
    error,
    refreshWasteRecord,
    deleteWasteRecord,
  }
}
