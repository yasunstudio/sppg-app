"use client"

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, FileDown, FileUp, Settings } from "lucide-react"
import { useRouter } from 'next/navigation'

interface ClassPageActionsProps {
  onRefresh?: () => void
  onExport?: () => void
  onImport?: () => void
  onSettings?: () => void
}

export function ClassPageActions({ onRefresh, onExport, onImport, onSettings }: ClassPageActionsProps) {
  const router = useRouter()

  const handleCreateClass = () => {
    router.push('/dashboard/classes/create')
  }

  const handleExport = () => {
    if (onExport) {
      onExport()
    } else {
      // Default export logic
      console.log('Exporting class data...')
    }
  }

  const handleImport = () => {
    if (onImport) {
      onImport()
    } else {
      // Default import logic
      console.log('Importing class data...')
    }
  }

  const handleSettings = () => {
    if (onSettings) {
      onSettings()
    } else {
      // Default settings logic
      console.log('Opening class settings...')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleCreateClass} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Tambah Kelas
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImport}>
            <FileUp className="mr-2 h-4 w-4" />
            Import Data
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSettings}>
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
