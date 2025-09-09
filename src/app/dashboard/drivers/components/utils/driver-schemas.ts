import { z } from "zod"

// Driver status enum
export enum DriverStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED"
}

// License type enum
export enum LicenseType {
  SIM_A = "SIM_A",
  SIM_B1 = "SIM_B1", 
  SIM_B2 = "SIM_B2",
  SIM_C = "SIM_C"
}

export const driverCreateSchema = z.object({
  employeeId: z.string().min(1, "ID Karyawan wajib diisi"),
  name: z.string().min(2, "Nama harus minimal 2 karakter"),
  phone: z.string().min(10, "Nomor telepon harus minimal 10 digit"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  licenseNumber: z.string().min(1, "Nomor SIM wajib diisi"),
  licenseType: z.nativeEnum(LicenseType),
  licenseExpiry: z.string().min(1, "Tanggal berakhir SIM wajib diisi"),
  emergencyContact: z.string().optional().or(z.literal("")),
  emergencyPhone: z.string().optional().or(z.literal("")),
  status: z.nativeEnum(DriverStatus),
  isActive: z.boolean(),
  totalDeliveries: z.number().min(0),
  notes: z.string().optional().or(z.literal(""))
})

export const driverUpdateSchema = driverCreateSchema.partial().extend({
  id: z.string().min(1, "ID driver diperlukan")
})

export type DriverCreateFormData = z.infer<typeof driverCreateSchema>
export type DriverUpdateFormData = z.infer<typeof driverUpdateSchema>
