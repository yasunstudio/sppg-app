import * as z from "zod"

// School Create Schema
export const schoolCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Nama sekolah wajib diisi")
    .max(100, "Nama sekolah terlalu panjang"),
  
  principalName: z
    .string()
    .min(1, "Nama kepala sekolah wajib diisi")
    .max(100, "Nama kepala sekolah terlalu panjang"),
  
  principalPhone: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^(\+62|62|0)[\d\-\s]{8,15}$/, "Format nomor telepon tidak valid"),
  
  address: z
    .string()
    .min(1, "Alamat wajib diisi")
    .max(500, "Alamat terlalu panjang"),
  
  totalStudents: z
    .number()
    .min(0, "Jumlah siswa tidak boleh negatif")
    .max(10000, "Jumlah siswa terlalu besar"),
  
  notes: z
    .string()
    .max(1000, "Catatan terlalu panjang")
    .optional()
    .nullable(),
  
  latitude: z
    .number()
    .min(-90, "Latitude tidak valid")
    .max(90, "Latitude tidak valid")
    .optional()
    .nullable(),
  
  longitude: z
    .number()
    .min(-180, "Longitude tidak valid")
    .max(180, "Longitude tidak valid")
    .optional()
    .nullable(),
})

// School Update Schema
export const schoolUpdateSchema = z.object({
  id: z.string().cuid("ID sekolah tidak valid"),
  name: z
    .string()
    .min(1, "Nama sekolah wajib diisi")
    .max(100, "Nama sekolah terlalu panjang"),
  
  principalName: z
    .string()
    .min(1, "Nama kepala sekolah wajib diisi")
    .max(100, "Nama kepala sekolah terlalu panjang"),
  
  principalPhone: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^(\+62|62|0)[\d\-\s]{8,15}$/, "Format nomor telepon tidak valid"),
  
  address: z
    .string()
    .min(1, "Alamat wajib diisi")
    .max(500, "Alamat terlalu panjang"),
  
  totalStudents: z
    .number()
    .min(0, "Jumlah siswa tidak boleh negatif")
    .max(10000, "Jumlah siswa terlalu besar"),
  
  notes: z
    .string()
    .max(1000, "Catatan terlalu panjang")
    .optional()
    .nullable(),
  
  latitude: z
    .number()
    .min(-90, "Latitude tidak valid")
    .max(90, "Latitude tidak valid")
    .optional()
    .nullable(),
  
  longitude: z
    .number()
    .min(-180, "Longitude tidak valid")
    .max(180, "Longitude tidak valid")
    .optional()
    .nullable(),
})

// School Filters Schema
export const schoolFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  selectedGrade: z.string().default('all'),
  selectedRegion: z.string().default('all'),
})

// Type exports
export type SchoolCreateInput = z.infer<typeof schoolCreateSchema>
export type SchoolUpdateInput = z.infer<typeof schoolUpdateSchema>
export type SchoolFiltersInput = z.infer<typeof schoolFiltersSchema>

// Form defaults
export const schoolCreateDefaults: SchoolCreateInput = {
  name: "",
  principalName: "",
  principalPhone: "",
  address: "",
  totalStudents: 0,
  notes: "",
  latitude: null,
  longitude: null,
}

export const schoolFiltersDefaults: SchoolFiltersInput = {
  searchTerm: "",
  selectedGrade: "all",
  selectedRegion: "all",
}
