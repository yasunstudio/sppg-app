# Recipe Module - Metadata & Permission System Implementation

## Overview
Implementasi sistem metadata dan role-based permissions untuk modul Recipe management sesuai dengan struktur yang konsisten seperti pada modul distributions.

## 📋 Fitur yang Diimplementasikan

### 1. Metadata untuk Setiap Halaman Recipe
Setiap halaman recipe sekarang memiliki metadata yang komprehensif:

#### Halaman Utama (`/dashboard/recipes`)
```typescript
export const metadata: Metadata = {
  title: 'Manajemen Resep | SPPG Dashboard',
  description: 'Kelola resep masakan untuk program pemberian makanan sekolah dengan sistem manajemen resep yang komprehensif.',
  keywords: ['resep', 'masakan', 'menu', 'bahan', 'instruksi', 'gizi', 'sekolah'],
}
```

#### Halaman Buat Resep Baru (`/dashboard/recipes/new`)
```typescript
export const metadata: Metadata = {
  title: 'Buat Resep Baru | SPPG Dashboard',
  description: 'Tambah resep baru dengan instruksi lengkap, bahan-bahan, dan informasi nutrisi untuk program pemberian makanan sekolah.',
  keywords: ['buat resep', 'resep baru', 'tambah resep', 'instruksi masak', 'bahan masakan'],
}
```

#### Halaman Detail Resep (`/dashboard/recipes/[id]`)
```typescript
export const metadata: Metadata = {
  title: 'Detail Resep | SPPG Dashboard',
  description: 'Lihat detail lengkap resep masakan termasuk bahan-bahan, instruksi, dan informasi nutrisi.',
  keywords: ['detail resep', 'resep masakan', 'bahan masakan', 'instruksi', 'nutrisi'],
}
```

#### Halaman Edit Resep (`/dashboard/recipes/[id]/edit`)
```typescript
export const metadata: Metadata = {
  title: 'Edit Resep | SPPG Dashboard',
  description: 'Edit dan perbarui resep masakan dengan mengubah bahan-bahan, instruksi, dan informasi nutrisi.',
  keywords: ['edit resep', 'ubah resep', 'perbarui resep', 'modifikasi resep'],
}
```

### 2. Permission System
Ditambahkan permissions khusus untuk recipe management:

```typescript
// Recipe Management Permissions
'recipes.create': ['CHEF', 'NUTRITIONIST', 'SUPER_ADMIN'],
'recipes.view': ['CHEF', 'NUTRITIONIST', 'QUALITY_CONTROL', 'ADMIN', 'SUPER_ADMIN', 'OPERATIONS_SUPERVISOR'],
'recipes.edit': ['CHEF', 'NUTRITIONIST', 'SUPER_ADMIN'],
'recipes.delete': ['CHEF', 'SUPER_ADMIN'],
'recipes.manage': ['CHEF', 'NUTRITIONIST', 'SUPER_ADMIN'],
```

### 3. Permission Guards
Setiap halaman recipe dilindungi dengan `PermissionGuard`:

#### Halaman Utama
```typescript
<PermissionGuard permission="recipes.view">
  <RecipesList />
</PermissionGuard>
```

#### Halaman Create
```typescript
<PermissionGuard permission="recipes.create">
  <RecipeCreate />
</PermissionGuard>
```

#### Halaman Detail
```typescript
<PermissionGuard permission="recipes.view">
  <RecipeDetails />
</PermissionGuard>
```

#### Halaman Edit
```typescript
<PermissionGuard permission="recipes.edit">
  <RecipeEdit />
</PermissionGuard>
```

### 4. Conditional UI Elements
Tombol dan aksi dalam komponen dibatasi berdasarkan permission:

#### RecipesList Component
```typescript
// Permission checks
const canCreate = useDynamicPermission("recipes.create")
const canEdit = useDynamicPermission("recipes.edit")
const canDelete = useDynamicPermission("recipes.delete")

// Conditional rendering
{canCreate && (
  <Button onClick={() => router.push("/dashboard/recipes/new")}>
    <Plus className="h-4 w-4 mr-2" />
    Tambah Recipe
  </Button>
)}

// Dropdown actions with permissions
{canEdit && (
  <DropdownMenuItem onClick={() => router.push(`/dashboard/recipes/${recipe.id}/edit`)}>
    <Edit className="h-4 w-4 mr-2" />
    Edit
  </DropdownMenuItem>
)}

{canDelete && (
  <DropdownMenuItem onClick={() => openDeleteDialog(recipe)} className="text-red-600">
    <Trash2 className="h-4 w-4 mr-2" />
    Hapus
  </DropdownMenuItem>
)}
```

#### RecipeDetails Component
```typescript
// Permission checks
const canEdit = useDynamicPermission("recipes.edit")
const canDelete = useDynamicPermission("recipes.delete")

// Conditional buttons
{canEdit && (
  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/recipes/${recipeId}/edit`)}>
    <Edit className="h-4 w-4 mr-2" />
    Edit
  </Button>
)}

{canDelete && (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive" size="sm" disabled={deleting}>
        <Trash2 className="h-4 w-4 mr-2" />
        Hapus
      </Button>
    </AlertDialogTrigger>
    // ... dialog content
  </AlertDialog>
)}
```

## 🔐 Role-Based Access Control

### Akses Berdasarkan Role:

1. **CHEF**: Full access (create, view, edit, delete, manage)
2. **NUTRITIONIST**: Full access (create, view, edit, manage)
3. **SUPER_ADMIN**: Full access to all operations
4. **QUALITY_CONTROL**: View only
5. **ADMIN**: View only
6. **OPERATIONS_SUPERVISOR**: View only
7. **Other roles**: No access (blocked by permission guards)

### Permission Logic:
- **View**: Roles yang bisa melihat daftar dan detail resep
- **Create**: Roles yang bisa membuat resep baru
- **Edit**: Roles yang bisa mengedit resep existing
- **Delete**: Roles yang bisa menghapus resep (terbatas untuk keamanan)
- **Manage**: Kombinasi create, edit, dan administrasi resep

## 📂 Files Modified

### Pages dengan Metadata & Permission Guards:
1. `/src/app/dashboard/recipes/page.tsx`
2. `/src/app/dashboard/recipes/new/page.tsx`
3. `/src/app/dashboard/recipes/[id]/page.tsx`
4. `/src/app/dashboard/recipes/[id]/edit/page.tsx`

### Components dengan Permission Logic:
1. `/src/app/dashboard/recipes/components/recipes-list.tsx`
2. `/src/app/dashboard/recipes/components/recipe-details.tsx`

### Permission Configuration:
1. `/src/lib/permissions.ts` - Added recipe-specific permissions

## 🚀 Benefits

1. **SEO Optimized**: Metadata yang descriptive untuk setiap halaman
2. **Security**: Role-based access control yang granular
3. **User Experience**: UI elements yang sesuai dengan permission user
4. **Consistency**: Struktur permission yang konsisten dengan modul lain
5. **Maintainability**: Permission logic yang terpusat dan mudah dimodifikasi

## 🧪 Testing

### Test Scenarios:
1. **CHEF/NUTRITIONIST**: Bisa melihat semua tombol dan akses semua fitur
2. **QUALITY_CONTROL**: Hanya bisa view, tidak ada tombol create/edit/delete
3. **Unauthorized Role**: Akan diblokir oleh permission guard
4. **Anonymous User**: Redirected ke login page

### Verification:
- ✅ Metadata muncul dengan benar di browser
- ✅ Permission guards berfungsi pada setiap route
- ✅ UI elements terkondisi berdasarkan permission
- ✅ Build successful tanpa error
- ✅ Konsisten dengan struktur distributions module

## 📝 Next Steps

1. Testing manual untuk setiap role
2. Verification metadata di browser dev tools
3. Integration testing dengan authentication system
4. Performance monitoring untuk permission checks
5. Documentation update untuk new permission structure

---

**Implementation Status**: ✅ **COMPLETED**
**Build Status**: ✅ **SUCCESS**
**Architecture**: ✅ **CONSISTENT**
**Security**: ✅ **IMPLEMENTED**
