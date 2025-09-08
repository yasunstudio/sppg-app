"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload, RefreshCw } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserRolePageActionsProps {
  onRefresh?: () => void
  isLoading?: boolean
}

export function UserRolePageActions({ onRefresh, isLoading = false }: UserRolePageActionsProps) {
  const router = useRouter()

  const handleCreateUserRole = () => {
    router.push('/dashboard/user-roles/assign')
  }

  const handleExport = async () => {
    try {
      // Implement export functionality
      console.log('Exporting user roles...')
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleImport = () => {
    // Implement import functionality
    console.log('Import user roles...')
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="hidden sm:flex"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={handleCreateUserRole} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Tugaskan Role</span>
        <span className="sm:hidden">Assign</span>
      </Button>
    </div>
  )
}
