"use client"

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Save, X, Copy } from "lucide-react"
import { useRouter } from 'next/navigation'

interface ClassCreateActionsProps {
  onSave?: () => void
  onCancel?: () => void
  onSaveAsDraft?: () => void
  onDuplicate?: () => void
  isSubmitting?: boolean
}

export function ClassCreateActions({ 
  onSave, 
  onCancel, 
  onSaveAsDraft, 
  onDuplicate,
  isSubmitting = false 
}: ClassCreateActionsProps) {
  const router = useRouter()

  const handleSave = () => {
    if (onSave) {
      onSave()
    } else {
      // Default save logic
      console.log('Saving class...')
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push('/dashboard/classes')
    }
  }

  const handleSaveAsDraft = () => {
    if (onSaveAsDraft) {
      onSaveAsDraft()
    } else {
      // Default save as draft logic
      console.log('Saving as draft...')
    }
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate()
    } else {
      // Default duplicate logic
      console.log('Duplicating class...')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        <X className="h-4 w-4 mr-2" />
        Batal
      </Button>
      
      <Button 
        onClick={handleSave}
        disabled={isSubmitting}
      >
        <Save className="h-4 w-4 mr-2" />
        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isSubmitting}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSaveAsDraft}>
            <Save className="mr-2 h-4 w-4" />
            Simpan sebagai Draft
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplikasi
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
