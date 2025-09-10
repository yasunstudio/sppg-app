import * as z from "zod"

// User Role Create Schema
export const userRoleCreateSchema = z.object({
  userId: z
    .string()
    .min(1, "User wajib dipilih")
    .cuid("Format User ID tidak valid"),
  
  roleId: z
    .string()
    .min(1, "Role wajib dipilih")
    .cuid("Format Role ID tidak valid")
})

// User Role Update Schema
export const userRoleUpdateSchema = z.object({
  id: z.string().cuid("ID user role tidak valid"),
  
  userId: z
    .string()
    .min(1, "User wajib dipilih")
    .cuid("Format User ID tidak valid"),
  
  roleId: z
    .string()
    .min(1, "Role wajib dipilih")
    .cuid("Format Role ID tidak valid")
})

// User Role Filters Schema
export const userRoleFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  selectedRole: z.string().optional(),
  selectedUser: z.string().optional(),
})

// Type exports
export type UserRoleCreateInput = z.infer<typeof userRoleCreateSchema>
export type UserRoleUpdateInput = z.infer<typeof userRoleUpdateSchema>
export type UserRoleFiltersInput = z.infer<typeof userRoleFiltersSchema>

// Form defaults
export const userRoleCreateDefaults: UserRoleCreateInput = {
  userId: "",
  roleId: ""
}

export const userRoleFiltersDefaults: UserRoleFiltersInput = {
  searchTerm: "",
  selectedRole: "",
  selectedUser: ""
}

// Helper functions
export const getUserRoleStatusColor = (isActive: boolean): string => {
  return isActive 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200'
}

export const formatUserRoleStatusText = (isActive: boolean): string => {
  return isActive ? 'Aktif' : 'Tidak Aktif'
}
