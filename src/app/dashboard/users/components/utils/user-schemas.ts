import * as z from "zod"

// User Role Enum
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN", 
  CHEF = "CHEF",
  NUTRITIONIST = "NUTRITIONIST",
  USER = "USER"
}

// User Status Enum  
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE", 
  SUSPENDED = "SUSPENDED"
}

// User Create Schema
export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  schoolId: z.string().optional(),
  avatar: z.string().optional(),
})

// User Update Schema (password optional for updates)
export const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  schoolId: z.string().optional(),
  avatar: z.string().optional(),
})

// Filter Schema
export const userFilterSchema = z.object({
  searchTerm: z.string().optional(),
  selectedRole: z.string().optional(),
  selectedStatus: z.string().optional(),
  selectedSchool: z.string().optional(),
  currentPage: z.number().min(1).default(1),
  itemsPerPage: z.number().min(1).max(100).default(10),
})

// Type definitions from schemas
export type UserCreateFormData = z.infer<typeof userCreateSchema>
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>
export type UserFilterData = z.infer<typeof userFilterSchema>
