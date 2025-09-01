# Automatic Stock Deduction System

## Overview
Sistem automatic stock deduction telah berhasil diimplementasikan untuk memastikan bahwa stok inventory secara otomatis terkurangi ketika production batch dimulai. Sistem ini menggunakan metode FIFO (First In First Out) untuk konsumsi inventory dan dilengkapi dengan audit logging serta rollback mechanism.

## Fitur Utama

### 1. Automatic Stock Deduction
- **Trigger**: Ketika production batch status berubah ke `IN_PROGRESS`
- **Method**: FIFO consumption (First In First Out)
- **Audit**: Semua perubahan stok dicatat dalam audit log
- **Rollback**: Otomatis rollback ketika production dibatalkan

### 2. Inventory Impact Preview
- **Lokasi**: `/dashboard/production/batches/from-recipe`
- **Fungsi**: Preview dampak inventory sebelum membuat production batch
- **Info**: Menampilkan material requirements, availability, dan estimasi biaya

### 3. Consumption History Tracking
- **Lokasi**: Tab "Inventory Consumption" di detail production batch
- **Fungsi**: Menampilkan history konsumsi inventory untuk setiap batch
- **Detail**: Transaction logs, rollback history, material breakdown

## File-file yang Diimplementasikan

### 1. Core Utilities
```
/src/lib/inventory-utils.ts
```
- `checkInventoryAvailability()`: Cek ketersediaan inventory
- `deductInventoryForProduction()`: FIFO deduction dengan audit logging
- `rollbackInventoryDeductions()`: Rollback mechanism
- `calculateMaterialsForBatch()`: Kalkulasi material requirements

### 2. API Endpoints
```
/src/app/api/production/batches/[id]/route.ts (enhanced)
/src/app/api/production/batches/preview-impact/route.ts (new)
/src/app/api/production/batches/[id]/inventory-consumption/route.ts (new)
```

### 3. UI Components
```
/src/components/production/inventory-impact-preview.tsx (new)
/src/components/production/inventory-consumption-history.tsx (new)
```

### 4. Enhanced Pages
```
/src/app/dashboard/production/batches/[id]/page.tsx (enhanced with tabs)
/src/app/dashboard/production/batches/from-recipe/page.tsx (enhanced with preview)
```

## Workflow

### Production Batch Creation
1. **Form Input**: User mengisi form production batch
2. **Preview Impact**: Sistem menampilkan preview inventory impact
3. **Confirmation**: User confirm untuk create batch
4. **Batch Created**: Production batch dibuat dengan status `PLANNED`

### Stock Deduction Process
1. **Status Change**: Ketika batch status berubah ke `IN_PROGRESS`
2. **Inventory Check**: Sistem cek ketersediaan material
3. **FIFO Deduction**: Konsumsi inventory menggunakan metode FIFO
4. **Audit Logging**: Catat semua perubahan di audit log
5. **Update Inventory**: Update current stock di database

### Rollback Process
1. **Trigger**: Ketika production batch dibatalkan
2. **Reverse Deduction**: Kembalikan stok yang sudah dikurangi
3. **Audit Logging**: Catat rollback di audit log
4. **Restore Stock**: Restore inventory ke kondisi sebelumnya

## Database Schema Changes

### AuditLog Enhancement
Sistem menggunakan existing `AuditLog` table untuk tracking:
- **entityType**: `INVENTORY_ITEM`
- **action**: `DEDUCT`, `ROLLBACK`
- **details**: JSON dengan info deduction/rollback
- **relatedEntityType**: `PRODUCTION_BATCH`
- **relatedEntityId**: ID production batch

## API Documentation

### Preview Inventory Impact
```
POST /api/production/batches/preview-impact
Body: {
  recipeId: string,
  servings: number,
  notes?: string
}
Response: {
  materials: Array<{
    materialId: string,
    materialName: string,
    requiredQuantity: number,
    unit: string,
    availableQuantity: number,
    isAvailable: boolean,
    estimatedCost: number
  }>,
  totalEstimatedCost: number,
  canProduce: boolean
}
```

### Get Inventory Consumption
```
GET /api/production/batches/[id]/inventory-consumption
Response: {
  consumptions: Array<{
    materialName: string,
    quantity: number,
    unit: string,
    cost: number,
    timestamp: string,
    auditLogId: string
  }>,
  rollbacks: Array<{
    materialName: string,
    quantity: number,
    unit: string,
    timestamp: string,
    reason: string
  }>,
  totalCost: number
}
```

## Testing Guide

### 1. Manual Testing
1. Login ke dashboard
2. Buka `/dashboard/production/batches/from-recipe`
3. Pilih recipe dan isi form
4. Klik "Preview Inventory Impact"
5. Review preview dan klik "Create Production Batch"
6. Buka detail batch dan ubah status ke "In Progress"
7. Check tab "Inventory Consumption" untuk melihat deduction
8. Check inventory list untuk confirm stock berkurang

### 2. Error Scenarios
- **Insufficient Stock**: Sistem akan prevent batch creation
- **Invalid Recipe**: Error handling untuk recipe tidak valid
- **Database Error**: Rollback transaction jika terjadi error

## Monitoring & Maintenance

### Audit Trail
- Semua inventory changes tercatat di audit log
- Dapat difilter by entity type dan action
- Timestamp dan user info disimpan

### Performance Considerations
- FIFO calculation optimized dengan proper indexing
- Batch operations untuk multiple material deduction
- Audit logging asynchronous untuk performance

### Future Enhancements
1. **Real-time Notifications**: Alert ketika stock rendah
2. **Automated Purchase Orders**: Auto-generate PO untuk stock habis
3. **Predictive Analytics**: Prediksi kebutuhan stock berdasarkan production schedule
4. **Waste Tracking**: Integration dengan waste management untuk akurasi stock

## Troubleshooting

### Common Issues
1. **Stock Mismatch**: Check audit logs untuk tracking perubahan
2. **Failed Rollback**: Manual correction via admin panel
3. **Performance Issues**: Monitor database queries dan optimize indexing

### Recovery Procedures
1. **Data Inconsistency**: Run inventory reconciliation script
2. **Failed Transactions**: Check transaction logs dan manual rollback
3. **Audit Log Issues**: Verify audit log integrity dan restore if needed

## Security Considerations
- Permission-based access untuk inventory operations
- Audit trail untuk compliance requirements
- Input validation untuk prevent manipulation
- Transaction isolation untuk data consistency

---

**Implementasi selesai pada**: Januar 2025
**Status**: ✅ Production Ready
**Version**: v1.0.0
