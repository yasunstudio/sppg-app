import * as z from "zod"

// Vehicle Type Enum
export enum VehicleType {
  TRUCK = "TRUCK",
  VAN = "VAN", 
  MOTORCYCLE = "MOTORCYCLE",
  PICKUP = "PICKUP"
}

// Vehicle Status Enum  
export enum VehicleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE", 
  MAINTENANCE = "MAINTENANCE",
  RETIRED = "RETIRED"
}

// Indonesian plate number validation regex
const plateNumberRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/

// Vehicle Create Schema
export const vehicleCreateSchema = z.object({
  plateNumber: z
    .string()
    .min(1, "Nomor plat kendaraan wajib diisi")
    .regex(plateNumberRegex, "Format nomor plat tidak valid (contoh: B 1234 ABC)")
    .transform(val => val.toUpperCase().replace(/\s+/g, ' ').trim()),
  
  type: z.nativeEnum(VehicleType, {
    message: "Silakan pilih jenis kendaraan yang valid"
  }),
  
  capacity: z
    .number({ 
      message: "Kapasitas harus berupa angka yang valid"
    })
    .min(1, "Kapasitas minimal 1 kg")
    .max(50000, "Kapasitas tidak boleh melebihi 50.000 kg"),
  
  brand: z
    .string()
    .min(1, "Merk kendaraan wajib diisi")
    .max(50, "Nama merk terlalu panjang"),
  
  model: z
    .string()
    .min(1, "Model kendaraan wajib diisi")
    .max(50, "Nama model terlalu panjang"),
  
  year: z
    .number()
    .min(1990, "Tahun kendaraan minimal 1990")
    .max(new Date().getFullYear() + 1, "Tahun kendaraan tidak boleh di masa depan"),
  
  fuelType: z.enum(["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"], {
    message: "Silakan pilih jenis bahan bakar yang valid"
  }),
  
  status: z.nativeEnum(VehicleStatus),
  
  lastService: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const serviceDate = new Date(date)
      const today = new Date()
      return serviceDate <= today
    }, "Tanggal servis tidak boleh di masa depan"),
  
  nextService: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const serviceDate = new Date(date)
      const today = new Date()
      return serviceDate >= today
    }, "Tanggal servis berikutnya harus di masa depan"),
  
  mileage: z
    .number()
    .min(0, "Jarak tempuh tidak boleh negatif")
    .optional(),
  
  insuranceExpiry: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const expiryDate = new Date(date)
      const today = new Date()
      return expiryDate >= today
    }, "Asuransi telah kedaluwarsa"),
  
  registrationExpiry: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const expiryDate = new Date(date)
      const today = new Date()
      return expiryDate >= today
    }, "Registrasi kendaraan telah kedaluwarsa"),
  
  notes: z
    .string()
    .max(500, "Catatan tidak boleh melebihi 500 karakter")
    .optional()
})

// Vehicle Update Schema (some fields optional for updates)
export const vehicleUpdateSchema = vehicleCreateSchema.partial().extend({
  id: z.string().min(1, "ID kendaraan wajib diisi")
})

// Filter Schema for search and filtering
export const vehicleFilterSchema = z.object({
  searchTerm: z.string().optional(),
  selectedType: z.string().optional(),
  selectedStatus: z.string().optional(),
  selectedDriver: z.string().optional(),
  capacityMin: z.number().min(0).optional(),
  capacityMax: z.number().min(0).optional(),
  serviceDue: z.boolean().optional(), // Vehicles needing service
  insuranceExpiring: z.boolean().optional(), // Insurance expiring soon
  currentPage: z.number().min(1).default(1),
  itemsPerPage: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["plateNumber", "type", "capacity", "lastService", "createdAt"]).default("plateNumber"),
  sortOrder: z.enum(["asc", "desc"]).default("asc")
})

// Type exports for TypeScript
export type VehicleCreateFormData = z.infer<typeof vehicleCreateSchema>
export type VehicleUpdateFormData = z.infer<typeof vehicleUpdateSchema>
export type VehicleFilterFormData = z.infer<typeof vehicleFilterSchema>

// Service and maintenance helpers
export const isServiceDue = (lastService?: string, serviceInterval = 180): boolean => {
  if (!lastService) return true
  const lastServiceDate = new Date(lastService)
  const daysSinceService = Math.floor((Date.now() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24))
  return daysSinceService >= serviceInterval
}

export const isInsuranceExpiringSoon = (insuranceExpiry?: string, daysWarning = 30): boolean => {
  if (!insuranceExpiry) return false
  const expiryDate = new Date(insuranceExpiry)
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry <= daysWarning && daysUntilExpiry >= 0
}
