import * as XLSX from 'xlsx'

// Note: jsPDF dan jspdf-autotable akan di-import secara dinamis
// untuk menghindari masalah SSR dan memastikan kompatibilitas yang baik

export interface PurchaseOrderExportData {
  id: string
  orderNumber: string
  supplier: {
    name: string
    contactName: string
    email?: string
    phone?: string
  }
  totalAmount: number
  status: string
  expectedDelivery?: string
  actualDelivery?: string
  createdAt: string
  createdBy: string
  items: Array<{
    rawMaterial: {
      name: string
      category: string
      unit: string
    }
    quantity: number
    unit: string
    unitPrice: number
    totalPrice: number
    notes?: string
  }>
  notes?: string
}

export class PurchaseOrderExporter {
  static exportToExcel(data: PurchaseOrderExportData[], filename: string = 'purchase-orders') {
    // Flatten data for Excel export
    const flattenedData = data.flatMap(po => 
      po.items.map(item => ({
        'Order Number': po.orderNumber,
        'Supplier': po.supplier.name,
        'Contact Person': po.supplier.contactName,
        'Email': po.supplier.email || '',
        'Phone': po.supplier.phone || '',
        'Status': this.formatStatus(po.status),
        'Raw Material': item.rawMaterial.name,
        'Category': item.rawMaterial.category,
        'Quantity': item.quantity,
        'Unit': item.unit,
        'Unit Price': item.unitPrice,
        'Total Price': item.totalPrice,
        'Item Notes': item.notes || '',
        'Order Total': po.totalAmount,
        'Expected Delivery': po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString('id-ID') : '',
        'Actual Delivery': po.actualDelivery ? new Date(po.actualDelivery).toLocaleDateString('id-ID') : '',
        'Created Date': new Date(po.createdAt).toLocaleDateString('id-ID'),
        'Created By': po.createdBy,
        'Order Notes': po.notes || ''
      }))
    )

    // Create summary sheet
    const summaryData = data.map(po => ({
      'Order Number': po.orderNumber,
      'Supplier': po.supplier.name,
      'Status': this.formatStatus(po.status),
      'Items Count': po.items.length,
      'Total Amount': po.totalAmount,
      'Expected Delivery': po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString('id-ID') : '',
      'Created Date': new Date(po.createdAt).toLocaleDateString('id-ID'),
      'Created By': po.createdBy
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // Add summary sheet
    const summaryWs = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')
    
    // Add detailed sheet
    const detailWs = XLSX.utils.json_to_sheet(flattenedData)
    XLSX.utils.book_append_sheet(wb, detailWs, 'Detailed Items')

    // Generate file
    const timestamp = new Date().toISOString().split('T')[0]
    XLSX.writeFile(wb, `${filename}-${timestamp}.xlsx`)
  }

  static async exportToPDF(data: PurchaseOrderExportData[], filename: string = 'purchase-orders') {
    // Dynamic import dengan explicit plugin loading
    const jsPDF = (await import('jspdf')).default
    await import('jspdf-autotable')
    
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('Purchase Orders Report', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString('id-ID')}`, 20, 30)
    doc.text(`Total Orders: ${data.length}`, 20, 38)
    doc.text(`Total Amount: Rp ${data.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString('id-ID')}`, 20, 46)
    
    // Summary table
    const summaryTableData = data.map(po => [
      po.orderNumber,
      po.supplier.name,
      this.formatStatus(po.status),
      `Rp ${po.totalAmount.toLocaleString('id-ID')}`,
      po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString('id-ID') : '-',
      new Date(po.createdAt).toLocaleDateString('id-ID')
    ])

    // Check jika autoTable tersedia sebelum menggunakan
    if (typeof (doc as any).autoTable === 'function') {
      ;(doc as any).autoTable({
        head: [['Order Number', 'Supplier', 'Status', 'Amount', 'Expected Delivery', 'Created']],
        body: summaryTableData,
        startY: 55,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 }
        }
      })
    } else {
      // Fallback jika autoTable tidak tersedia - buat tabel manual
      let yPosition = 60
      doc.setFontSize(10)
      
      // Header tabel manual
      const headers = ['Order Number', 'Supplier', 'Status', 'Amount', 'Expected Delivery', 'Created']
      let xPosition = 20
      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition)
        xPosition += 30
      })
      
      yPosition += 10
      
      // Data rows
      summaryTableData.forEach(row => {
        xPosition = 20
        row.forEach((cell, index) => {
          doc.text(cell.toString(), xPosition, yPosition)
          xPosition += 30
        })
        yPosition += 8
      })
    }

    // Generate file
    const timestamp = new Date().toISOString().split('T')[0]
    doc.save(`${filename}-${timestamp}.pdf`)
  }

  static async exportSinglePurchaseOrderToPDF(data: PurchaseOrderExportData) {
    // Dynamic import dengan explicit plugin loading
    const jsPDF = (await import('jspdf')).default
    await import('jspdf-autotable')
    
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('Purchase Order', 20, 20)
    
    // Order details
    doc.setFontSize(12)
    doc.text(`Order Number: ${data.orderNumber}`, 20, 35)
    doc.text(`Status: ${this.formatStatus(data.status)}`, 20, 43)
    doc.text(`Created: ${new Date(data.createdAt).toLocaleDateString('id-ID')}`, 20, 51)
    doc.text(`Created By: ${data.createdBy}`, 20, 59)
    
    // Supplier details
    doc.setFontSize(14)
    doc.text('Supplier Information', 20, 75)
    doc.setFontSize(10)
    doc.text(`Company: ${data.supplier.name}`, 25, 83)
    doc.text(`Contact Person: ${data.supplier.contactName}`, 25, 89)
    if (data.supplier.email) doc.text(`Email: ${data.supplier.email}`, 25, 95)
    if (data.supplier.phone) doc.text(`Phone: ${data.supplier.phone}`, 25, 101)
    
    // Items table
    const itemsTableData = data.items.map(item => [
      item.rawMaterial.name,
      item.rawMaterial.category,
      item.quantity.toString(),
      item.unit,
      `Rp ${item.unitPrice.toLocaleString('id-ID')}`,
      `Rp ${item.totalPrice.toLocaleString('id-ID')}`,
      item.notes || '-'
    ])

    let finalY = 120
    
    // Check jika autoTable tersedia
    if (typeof (doc as any).autoTable === 'function') {
      ;(doc as any).autoTable({
        head: [['Raw Material', 'Category', 'Qty', 'Unit', 'Unit Price', 'Total', 'Notes']],
        body: itemsTableData,
        startY: 110,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      })
      
      finalY = (doc as any).lastAutoTable.finalY + 10
    } else {
      // Fallback manual table
      let yPosition = 110
      doc.setFontSize(10)
      
      // Header items table
      const headers = ['Raw Material', 'Category', 'Qty', 'Unit', 'Unit Price', 'Total', 'Notes']
      let xPosition = 20
      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition)
        xPosition += 25
      })
      
      yPosition += 10
      
      // Data rows
      itemsTableData.forEach(row => {
        xPosition = 20
        row.forEach((cell, index) => {
          const cellText = cell.toString()
          if (cellText.length > 15) {
            doc.text(cellText.substring(0, 12) + '...', xPosition, yPosition)
          } else {
            doc.text(cellText, xPosition, yPosition)
          }
          xPosition += 25
        })
        yPosition += 8
      })
      
      finalY = yPosition + 10
    }

    // Total
    doc.setFontSize(12)
    doc.text(`Total Amount: Rp ${data.totalAmount.toLocaleString('id-ID')}`, 20, finalY)
    
    if (data.notes) {
      doc.text('Notes:', 20, finalY + 10)
      doc.setFontSize(10)
      doc.text(data.notes, 20, finalY + 18)
    }

    // Generate file
    doc.save(`purchase-order-${data.orderNumber}.pdf`)
  }

  private static formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'SHIPPED': 'Shipped',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled',
      'PARTIALLY_RECEIVED': 'Partially Received'
    }
    return statusMap[status] || status
  }
}
