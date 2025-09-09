import * as z from "zod"

// Supplier Create Schema
export const supplierCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Nama supplier wajib diisi")
    .max(100, "Nama supplier terlalu panjang"),
  
  contactName: z
    .string()
    .min(1, "Nama kontak wajib diisi")
    .max(100, "Nama kontak terlalu panjang"),
  
  phone: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^(\+62|62|0)[\d\-\s]{8,15}$/, "Format nomor telepon tidak valid"),
  
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .nullable(),
  
  address: z
    .string()
    .min(1, "Alamat wajib diisi")
    .max(500, "Alamat terlalu panjang"),
  
  isActive: z
    .boolean(),
})

// Supplier Update Schema
export const supplierUpdateSchema = z.object({
  id: z.string().cuid("ID supplier tidak valid"),
  name: z
    .string()
    .min(1, "Nama supplier wajib diisi")
    .max(100, "Nama supplier terlalu panjang"),
  
  contactName: z
    .string()
    .min(1, "Nama kontak wajib diisi")
    .max(100, "Nama kontak terlalu panjang"),
  
  phone: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^(\+62|62|0)[\d\-\s]{8,15}$/, "Format nomor telepon tidak valid"),
  
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .nullable(),
  
  address: z
    .string()
    .min(1, "Alamat wajib diisi")
    .max(500, "Alamat terlalu panjang"),
  
  isActive: z
    .boolean(),
})

// Supplier Filters Schema
export const supplierFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  selectedStatus: z.enum(['all', 'active', 'inactive']).default('all'),
})

// Type exports
export type SupplierCreateInput = z.infer<typeof supplierCreateSchema>
export type SupplierUpdateInput = z.infer<typeof supplierUpdateSchema>
export type SupplierFiltersInput = z.infer<typeof supplierFiltersSchema>

// Form defaults
export const supplierCreateDefaults: SupplierCreateInput = {
  name: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  isActive: true,
}

export const supplierFiltersDefaults: SupplierFiltersInput = {
  searchTerm: "",
  selectedStatus: "all",
}
