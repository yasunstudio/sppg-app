import { z } from 'zod'

// System Config Schema
export const systemConfigSchema = z.object({
  id: z.string().min(1, 'ID konfigurasi diperlukan'),
  key: z.string()
    .min(1, 'Key konfigurasi harus diisi')
    .max(100, 'Key maksimal 100 karakter')
    .regex(/^[A-Z_]+$/, 'Key harus berupa huruf besar dan underscore'),
  
  value: z.string()
    .min(1, 'Value konfigurasi harus diisi')
    .max(1000, 'Value maksimal 1000 karakter'),
  
  description: z.string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional()
    .transform(val => val === '' ? undefined : val),
  
  dataType: z.enum(['STRING', 'INTEGER', 'BOOLEAN', 'JSON'], {
    message: 'Tipe data harus dipilih'
  }),
  
  category: z.string()
    .min(1, 'Kategori harus diisi')
    .max(50, 'Kategori maksimal 50 karakter'),
    
  isActive: z.boolean().default(true),
  
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

// Create System Config Schema
export const systemConfigCreateSchema = systemConfigSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

// Update System Config Schema
export const systemConfigUpdateSchema = systemConfigSchema.pick({
  id: true,
  value: true,
  description: true,
  isActive: true
})

// System Config Filter Schema
export const systemConfigFilterSchema = z.object({
  searchTerm: z.string().optional().default(''),
  selectedCategory: z.union([z.literal('all'), z.string()]).default('all'),
  selectedDataType: z.union([
    z.literal('all'), 
    z.literal('STRING'), 
    z.literal('INTEGER'), 
    z.literal('BOOLEAN'), 
    z.literal('JSON')
  ]).default('all'),
  selectedStatus: z.union([z.literal('all'), z.literal('active'), z.literal('inactive')]).default('all'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(25)
})

// Bulk actions schema
export const systemConfigBulkActionSchema = z.object({
  action: z.enum(['delete', 'export', 'activate', 'deactivate']),
  configIds: z.array(z.string()).min(1, 'Minimal pilih 1 konfigurasi')
})

// Export types
export type SystemConfig = z.infer<typeof systemConfigSchema>
export type SystemConfigCreateInput = z.infer<typeof systemConfigCreateSchema>
export type SystemConfigUpdateInput = z.infer<typeof systemConfigUpdateSchema>
export type SystemConfigFilters = z.infer<typeof systemConfigFilterSchema>
export type SystemConfigBulkAction = z.infer<typeof systemConfigBulkActionSchema>

// Categories enum
export const CONFIG_CATEGORIES = {
  GENERAL: 'General',
  DATABASE: 'Database', 
  EMAIL: 'Email',
  NOTIFICATIONS: 'Notifications',
  SECURITY: 'Security',
  PAYMENT: 'Payment',
  API: 'API',
  UI: 'UI/Theme'
} as const

// Data types enum
export const CONFIG_DATA_TYPES = {
  STRING: 'String',
  INTEGER: 'Integer',
  BOOLEAN: 'Boolean',
  JSON: 'JSON'
} as const
