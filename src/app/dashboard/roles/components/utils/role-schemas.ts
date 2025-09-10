import * as z from "zod"

// Role validation schemas
export const roleCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Nama role wajib diisi")
    .min(3, "Nama role minimal 3 karakter")
    .max(50, "Nama role maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9\s_-]+$/, "Nama role hanya boleh mengandung huruf, angka, spasi, underscore, dan dash"),
  
  description: z
    .string()
    .max(200, "Deskripsi maksimal 200 karakter")
    .optional()
    .nullable(),
  
  permissions: z
    .array(z.string())
    .min(1, "Minimal pilih satu permission")
    .max(20, "Maksimal 20 permissions dapat dipilih")
})

// Role Update Schema (same as create)
export const roleUpdateSchema = roleCreateSchema.extend({
  id: z.string().min(1, "ID role wajib ada")
})

// Role Form Schema (for form validation)
export const roleFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama role wajib diisi")
    .min(3, "Nama role minimal 3 karakter")
    .max(50, "Nama role maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9\s_-]+$/, "Nama role hanya boleh mengandung huruf, angka, spasi, underscore, dan dash"),
  
  description: z
    .string()
    .max(200, "Deskripsi maksimal 200 karakter")
    .optional()
    .or(z.literal("")),
  
  permissions: z
    .array(z.string())
    .min(1, "Minimal pilih satu permission")
    .max(20, "Maksimal 20 permissions dapat dipilih")
})

// Filters Schema
export const roleFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  selectedType: z.string().optional(),
  selectedPermission: z.string().optional()
})

// Pagination Schema
export const rolePaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  type: z.string().optional(),
  permission: z.string().optional()
})

// Type exports for schema inference
export type RoleCreateInput = z.infer<typeof roleCreateSchema>
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema> 
export type RoleFormInput = z.infer<typeof roleFormSchema>
export type RoleFiltersInput = z.infer<typeof roleFiltersSchema>
export type RolePaginationInput = z.infer<typeof rolePaginationSchema>

// Default form values
export const defaultRoleFormValues: RoleFormInput = {
  name: "",
  description: "",
  permissions: []
}

// Available role types
export const ROLE_TYPES = [
  { value: "all", label: "Semua Role" },
  { value: "system", label: "System Role" },
  { value: "custom", label: "Custom Role" }
] as const

// Available permissions with labels
export const PERMISSION_OPTIONS = [
  { value: "manage_users", label: "Kelola Pengguna" },
  { value: "manage_roles", label: "Kelola Role" },
  { value: "manage_schools", label: "Kelola Sekolah" },
  { value: "manage_students", label: "Kelola Siswa" },
  { value: "manage_suppliers", label: "Kelola Supplier" },
  { value: "manage_vehicles", label: "Kelola Kendaraan" },
  { value: "manage_waste_records", label: "Kelola Data Sampah" },
  { value: "manage_system_config", label: "Kelola Konfigurasi Sistem" },
  { value: "view_reports", label: "Lihat Laporan" },
  { value: "view_analytics", label: "Lihat Analitik" }
] as const

// Permission categories for grouping
export const PERMISSION_CATEGORIES = {
  "Management": ["manage_users", "manage_roles", "manage_schools", "manage_students", "manage_suppliers"],
  "Operations": ["manage_vehicles", "manage_waste_records"],
  "System": ["manage_system_config"],
  "Analytics": ["view_reports", "view_analytics"]
} as const
