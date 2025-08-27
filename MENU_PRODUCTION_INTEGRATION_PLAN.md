# Menu Planning & Production Integration Enhancement

## Current Status
✅ Database relasi sudah benar (Menu ↔ ProductionPlan)  
✅ API sudah include relasi menu dalam production plans  
✅ Seeding data sudah menghubungkan menu dengan production plans  
✅ Production planning page menampilkan nama menu  

## Missing Integration

### 1. Menu Planning → Production Planning
- [ ] Tampilkan status produksi untuk setiap menu
- [ ] Tombol "Create Production Plan" dari menu
- [ ] Indikator menu yang sudah/belum diproduksi
- [ ] Link langsung ke production plan yang terkait

### 2. Workflow Integration
- [ ] Auto-suggest menu saat membuat production plan
- [ ] Menu selection dalam production plan form
- [ ] Production status dalam menu overview

## Proposed Enhancement

### A. Update Menu Planning Page
```tsx
// Add production status to menu display
{menu.productionPlans?.length > 0 ? (
  <Badge variant="success">In Production</Badge>
) : (
  <Button size="sm" onClick={() => createProductionPlan(menu)}>
    Create Production Plan
  </Button>
)}
```

### B. Update API Endpoints
```typescript
// /api/menus - include production plans
include: {
  productionPlans: {
    select: {
      id: true,
      status: true,
      planDate: true,
      targetPortions: true
    }
  }
}
```

### C. Enhanced Production Plan Creation
```tsx
// Auto-populate from menu
const createProductionPlanFromMenu = (menu) => {
  router.push(`/dashboard/production/planning/create?menuId=${menu.id}`)
}
```

## Implementation Priority
1. **High**: Add production status indicator in menu planning
2. **Medium**: Create production plan button from menu
3. **Low**: Advanced workflow automation

## Benefits
- Seamless workflow from menu → production
- Better visibility of production status
- Reduced manual data entry
- Improved user experience
