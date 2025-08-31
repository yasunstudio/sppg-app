# 🔐 SPPG Permission System Documentation

## Overview
Sistem permission SPPG Purwakarta menggunakan **Role-Based Access Control (RBAC)** yang komprehensif untuk mengatur akses pengguna ke berbagai fitur aplikasi.

## 📋 Role Hierarchy & Permissions

### 🎭 Super Administrator (SUPER_ADMIN)
- **Coverage**: 41/42 permissions (98%)
- **Description**: Akses penuh ke seluruh sistem
- **Key Responsibilities**: 
  - Full system administration
  - User management
  - System configuration
  - Budget approval
- **Assigned User**: Super Administrator SPPG

### 🎭 Administrator (ADMIN) 
- **Coverage**: 31/42 permissions (74%)
- **Description**: Administrator sistem dengan akses luas
- **Key Responsibilities**:
  - User management (create, view, edit, delete)
  - School & student management  
  - Financial management & budgeting
  - System configuration
  - Training management
- **Assigned User**: Administrator SPPG

### 🎭 Ahli Gizi (NUTRITIONIST)
- **Coverage**: 9/42 permissions (21%)
- **Description**: Spesialis nutrisi untuk perencanaan menu
- **Key Responsibilities**:
  - Menu creation & planning
  - Nutrition consultation
  - Student data access
  - Production oversight
  - Quality checking
- **Assigned User**: Dr. Sari Nutrition, S.Gz

### 🎭 Kepala Koki (CHEF)
- **Coverage**: 11/42 permissions (26%)
- **Description**: Manajemen produksi dan dapur
- **Key Responsibilities**:
  - Menu development
  - Inventory management
  - Production management
  - Quality control
  - Kitchen operations
- **Assigned User**: Chef Budi Masak

### 🎭 Quality Control (QUALITY_CONTROL)
- **Coverage**: 11/42 permissions (26%)
- **Description**: Pengawasan kualitas makanan
- **Key Responsibilities**:
  - Quality inspections
  - Compliance auditing
  - Quality standards management
  - Feedback handling
  - Audit log access
- **Assigned User**: QC Inspector Maya

### 🎭 Warehouse Manager (WAREHOUSE_MANAGER)
- **Coverage**: 7/42 permissions (17%)
- **Description**: Pengelola gudang dan inventori
- **Key Responsibilities**:
  - Inventory management
  - Supplier relations
  - Production coordination
  - Delivery oversight
- **Assigned User**: Dedi Warehouse Manager

### 🎭 Distribution Manager (DISTRIBUTION_MANAGER)
- **Coverage**: 6/42 permissions (14%)
- **Description**: Manajemen distribusi dan logistik
- **Key Responsibilities**:
  - Distribution management
  - Logistics planning
  - School coordination
  - Delivery oversight
- **Assigned User**: Rina Distribution Manager

### 🎭 Operations Supervisor (OPERATIONS_SUPERVISOR)
- **Coverage**: 8/42 permissions (19%)
- **Description**: Pengawasan operasional harian
- **Key Responsibilities**:
  - Daily operations oversight
  - Multi-departmental visibility
  - Quality supervision
  - Reporting access
- **Assigned User**: Bapak Supervisor Operasi

### 🎭 Financial Analyst (FINANCIAL_ANALYST)
- **Coverage**: 6/42 permissions (14%)
- **Description**: Analisis keuangan dan budget
- **Key Responsibilities**:
  - Financial analysis
  - Budget management
  - Transaction monitoring
  - Financial reporting
- **Assigned User**: Nina Financial Analyst

### 🎭 School Administrator (SCHOOL_ADMIN)
- **Coverage**: 5/42 permissions (12%)
- **Description**: Administrator sekolah
- **Key Responsibilities**:
  - Student management
  - School data access
  - Delivery coordination
  - Feedback collection
- **Assigned User**: Ibu Kepala Sekolah SDN 1

### 🎭 Production Staff (PRODUCTION_STAFF)
- **Coverage**: 4/42 permissions (10%)
- **Description**: Staff produksi makanan
- **Key Responsibilities**:
  - Production execution
  - Menu viewing
  - Basic quality checks
  - Inventory visibility
- **Assigned User**: Andi Production

### 🎭 Driver (DRIVER)
- **Coverage**: 2/42 permissions (5%)
- **Description**: Driver pengiriman makanan
- **Key Responsibilities**:
  - Delivery operations
  - School location access
- **Assigned Users**: Asep Driver, Ujang Driver

### 🎭 Viewer (VIEWER)
- **Coverage**: 6/42 permissions (14%)
- **Description**: Akses read-only untuk monitoring
- **Key Responsibilities**:
  - View-only access to key data
  - Basic reporting access
- **Assigned Users**: None (available for assignment)

## 📊 Permission Categories

### 👥 User Management
- `users.create`, `users.view`, `users.edit`, `users.delete`
- **Access**: SUPER_ADMIN, ADMIN

### 🍽️ Menu Planning & Nutrition
- `menus.create`, `menus.view`, `menus.edit`, `menus.approve`
- `nutrition.consult`
- **Access**: NUTRITIONIST, CHEF, QUALITY_CONTROL, ADMIN, SUPER_ADMIN

### 🏫 Schools & Students
- `schools.view`, `schools.manage`
- `students.view`, `students.manage`
- **Access**: ADMIN, SCHOOL_ADMIN, NUTRITIONIST, SUPER_ADMIN, DISTRIBUTION_MANAGER, DRIVER, OPERATIONS_SUPERVISOR

### 📦 Inventory & Raw Materials
- `inventory.create`, `inventory.view`, `inventory.edit`
- `suppliers.manage`
- **Access**: ADMIN, CHEF, NUTRITIONIST, QUALITY_CONTROL, WAREHOUSE_MANAGER, SUPER_ADMIN

### 🏭 Production Management
- `production.create`, `production.view`, `production.manage`
- `quality.check`, `quality.create`, `quality.edit`
- **Access**: CHEF, NUTRITIONIST, QUALITY_CONTROL, ADMIN, SUPER_ADMIN, PRODUCTION_STAFF

### 💰 Financial Management
- `finance.view`, `finance.manage`
- `budget.create`, `budget.view`, `budget.approve`
- `transactions.create`, `transactions.view`
- **Access**: ADMIN, SUPER_ADMIN, FINANCIAL_ANALYST

### 🚚 Delivery & Logistics
- `delivery.manage`, `delivery.view`
- `logistics.plan`, `logistics.manage`
- **Access**: DISTRIBUTION_MANAGER, ADMIN, SUPER_ADMIN, DRIVER, WAREHOUSE_MANAGER, SCHOOL_ADMIN, OPERATIONS_SUPERVISOR

### 📊 Reporting & Analytics
- `reports.view`, `analytics.view`
- **Access**: Most roles have reporting access for their respective areas

### 🛠️ System Administration
- `system.config`, `audit.view`
- `training.manage`, `compliance.audit`
- **Access**: SUPER_ADMIN, ADMIN, QUALITY_CONTROL

### 💬 Feedback Management
- `feedback.view`, `feedback.respond`
- **Access**: SUPER_ADMIN, ADMIN, QUALITY_CONTROL, SCHOOL_ADMIN

## 🔧 Implementation Details

### Database Schema
```sql
-- Roles table with permissions array
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User-Role junction table
CREATE TABLE user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  role_id TEXT REFERENCES roles(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);
```

### Permission Functions
```typescript
// Check if user has specific permission
hasPermission(userRoles: string[], permission: Permission): boolean

// Get all permissions for user roles
getUserPermissions(userRoles: string[]): Permission[]

// Get role details
getUserRoleDetails(roleName: string): UserRoleDetails
```

### Middleware Integration
```typescript
// API route protection
export const withPermission = (permission: Permission) => {
  return async (req: NextRequest) => {
    const user = await getCurrentUser(req)
    if (!hasPermission(user.roles, permission)) {
      return NextResponse.json(
        { error: "Insufficient permissions" }, 
        { status: 403 }
      )
    }
    // Continue to handler
  }
}
```

## 🎯 Best Practices

### 1. Principle of Least Privilege
Setiap role hanya mendapat permission minimum yang diperlukan untuk tugasnya.

### 2. Separation of Duties
Role dibagi berdasarkan fungsi organisasi dengan clear boundaries.

### 3. Hierarchical Access
SUPER_ADMIN > ADMIN > Specialist Roles > Operational Roles > Basic Roles

### 4. Audit Trail
Semua permission assignments dan role changes dicatat dalam audit log.

### 5. Regular Review
Permission system harus direview secara berkala untuk memastikan sesuai dengan kebutuhan operasional.

## 📈 Statistics Summary

- **Total Permissions**: 42 distinct permissions
- **Total Roles**: 13 roles
- **Permission Distribution**: From 2 (DRIVER) to 41 (SUPER_ADMIN)
- **Coverage**: All major system functions covered
- **Granularity**: Fine-grained control at feature level

## 🚀 Benefits

1. **Security**: Robust access control prevents unauthorized actions
2. **Compliance**: Clear permission audit trail for regulatory requirements
3. **Scalability**: Easy to add new roles and permissions as system grows
4. **Flexibility**: Granular permissions allow precise access control
5. **Maintainability**: Centralized permission management
6. **User Experience**: Role-based dashboards and navigation

---

*Dokumentasi ini menggambarkan sistem permission SPPG Purwakarta yang komprehensif dan professional untuk manajemen akses berbasis role.*
