"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar,
  Filter,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { PurchaseOrderExporter } from "@/lib/export-utils"

interface ExportOptions {
  format: 'excel' | 'pdf'
  dateRange: 'all' | '7days' | '30days' | '90days' | 'custom'
  status: 'all' | 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'PARTIALLY_RECEIVED'
  customStartDate?: string
  customEndDate?: string
  includeItems: boolean
}

interface PurchaseOrderExportProps {
  trigger?: React.ReactNode
}

export function PurchaseOrderExport({ trigger }: PurchaseOrderExportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'excel',
    dateRange: '30days',
    status: 'all',
    includeItems: true
  })

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Build query parameters
      const params = new URLSearchParams()
      
      // Date range
      if (exportOptions.dateRange !== 'all') {
        if (exportOptions.dateRange === 'custom') {
          if (exportOptions.customStartDate) params.append('startDate', exportOptions.customStartDate)
          if (exportOptions.customEndDate) params.append('endDate', exportOptions.customEndDate)
        } else {
          const days = exportOptions.dateRange === '7days' ? 7 : 
                      exportOptions.dateRange === '30days' ? 30 : 90
          const startDate = new Date()
          startDate.setDate(startDate.getDate() - days)
          params.append('startDate', startDate.toISOString().split('T')[0])
        }
      }
      
      // Status filter
      if (exportOptions.status !== 'all') {
        params.append('status', exportOptions.status)
      }
      
      // Include items
      if (exportOptions.includeItems) {
        params.append('include', 'items,supplier,orderedByUser,receivedByUser')
      } else {
        params.append('include', 'supplier,orderedByUser,receivedByUser')
      }
      
      // Set high limit for export
      params.append('limit', '1000')

      // Fetch data
      const response = await fetch(`/api/purchase-orders?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch purchase orders')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      // Transform data for export
      const exportData = result.data.map((po: any) => ({
        id: po.id,
        orderNumber: po.orderNumber,
        supplier: {
          name: po.supplier?.name || 'Unknown Supplier',
          contactName: po.supplier?.contactName || '-',
          email: po.supplier?.email || '-',
          phone: po.supplier?.phone || '-'
        },
        totalAmount: po.totalAmount || 0,
        status: po.status,
        expectedDelivery: po.expectedDelivery,
        actualDelivery: po.actualDelivery,
        createdAt: po.createdAt,
        createdBy: po.orderedByUser 
          ? `${po.orderedByUser.name || po.orderedByUser.firstName || ''} ${po.orderedByUser.lastName || ''}`.trim() 
          : po.user 
            ? `${po.user.name || po.user.firstName || ''} ${po.user.lastName || ''}`.trim()
            : 'Unknown User',
        items: po.items || [],
        notes: po.notes || ''
      }))

      // Export based on format
      if (exportOptions.format === 'excel') {
        PurchaseOrderExporter.exportToExcel(exportData)
        toast.success('Excel file downloaded successfully!')
      } else {
        await PurchaseOrderExporter.exportToPDF(exportData)
        toast.success('PDF file downloaded successfully!')
      }

      setIsOpen(false)
      
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const updateExportOptions = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Purchase Orders
          </DialogTitle>
          <DialogDescription>
            Export purchase orders data to Excel or PDF format with custom filters
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer transition-colors ${
                  exportOptions.format === 'excel' ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => updateExportOptions('format', 'excel')}
              >
                <CardContent className="p-4 text-center">
                  <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-medium">Excel</div>
                  <div className="text-xs text-muted-foreground">Detailed data with multiple sheets</div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-colors ${
                  exportOptions.format === 'pdf' ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => updateExportOptions('format', 'pdf')}
              >
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <div className="font-medium">PDF</div>
                  <div className="text-xs text-muted-foreground">Formatted report for printing</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range</Label>
            <Select 
              value={exportOptions.dateRange} 
              onValueChange={(value) => updateExportOptions('dateRange', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {exportOptions.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={exportOptions.customStartDate || ''}
                  onChange={(e) => updateExportOptions('customStartDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={exportOptions.customEndDate || ''}
                  onChange={(e) => updateExportOptions('customEndDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status Filter</Label>
            <Select 
              value={exportOptions.status} 
              onValueChange={(value) => updateExportOptions('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="PARTIALLY_RECEIVED">Partially Received</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export {exportOptions.format.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
