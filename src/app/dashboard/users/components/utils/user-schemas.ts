import { z } from 'zod'

// User schemas - Following vehicle pattern with Indonesian language
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Format email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  
  username: z
    .string()
    .nullable()
    .optional(),
  
  fullName: z
    .string()
    .min(1, 'Nama lengkap harus diisi')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(255, 'Password maksimal 255 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf kecil, huruf besar, dan angka'),
  
  confirmPassword: z
    .string()
    .min(1, 'Konfirmasi password harus diisi'),
  
  phone: z
    .string()
    .nullable()
    .optional(),
  
  address: z
    .string()
    .nullable()
    .optional(),
  
  isActive: z.boolean().default(true).optional(),
  
  roleIds: z.array(z.string()).default([]).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak sama",
  path: ["confirmPassword"],
})

export const updateUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Format email tidak valid')
    .max(255, 'Email maksimal 255 karakter')
    .optional(),
  
  username: z
    .string()
    .nullable()
    .optional(),
  
  fullName: z
    .string()
    .min(1, 'Nama lengkap harus diisi')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .optional(),
  
  phone: z
    .string()
    .nullable()
    .optional(),
  
  address: z
    .string()
    .nullable()
    .optional(),
  
  isActive: z.boolean().optional(),
  
  roleIds: z.array(z.string()).optional()
})

export const userFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
  role: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})

// Export types
export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
export type UserFilterData = z.infer<typeof userFilterSchema>
