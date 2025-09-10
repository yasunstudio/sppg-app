'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download, FileText, RefreshCw, Settings, MoreHorizontal, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface SystemConfigPageActionsProps {
  onRefresh?: () => void
  onExport?: () => void
  onImport?: () => void
}

export function SystemConfigPageActions({ 
  onRefresh, 
  onExport, 
  onImport 
}: SystemConfigPageActionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
      toast.success('Data konfigurasi diperbarui')
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (onExport) {
        onExport()
      } else {
        // Default export functionality
        const response = await fetch('/api/system-config/export')
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `system-config-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Konfigurasi berhasil diekspor')
      }
    } catch (error) {
      toast.error('Gagal mengekspor konfigurasi')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = () => {
    setIsImporting(true)
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          if (onImport) {
            onImport()
          } else {
            // Default import functionality
            const formData = new FormData()
            formData.append('file', file)
            const response = await fetch('/api/system-config/import', {
              method: 'POST',
              body: formData
            })
            if (response.ok) {
              toast.success('Konfigurasi berhasil diimpor')
              if (onRefresh) onRefresh()
            } else {
              toast.error('Gagal mengimpor konfigurasi')
            }
          }
        }
        setIsImporting(false)
      }
      input.click()
    } catch (error) {
      toast.error('Gagal mengimpor konfigurasi')
      setIsImporting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 dark:bg-gray-800 dark:border-gray-700"
        >
          <DropdownMenuItem 
            onClick={handleExport}
            disabled={isExporting}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Mengekspor...' : 'Ekspor Konfigurasi'}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleImport}
            disabled={isImporting}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? 'Mengimpor...' : 'Impor Konfigurasi'}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="dark:border-gray-600" />
          
          <DropdownMenuItem 
            onClick={() => toast.info('Fitur akan segera tersedia')}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Dokumentasi
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => toast.info('Fitur akan segera tersedia')}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan Lanjutan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
