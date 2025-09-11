import * as z from "zod"

// Class Level Enum
export enum ClassLevel {
  ELEMENTARY = "ELEMENTARY",
  MIDDLE = "MIDDLE",
  HIGH = "HIGH"
}

// Class Status Enum  
export enum ClassStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

// Class Create Schema - Match Prisma schema
export const classCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Nama kelas wajib diisi")
    .max(100, "Nama kelas maksimal 100 karakter"),
  
  level: z.nativeEnum(ClassLevel, {
    message: "Silakan pilih tingkat kelas yang valid"
  }),
  
  grade: z
    .number({ 
      message: "Tingkat kelas harus berupa angka yang valid"
    })
    .min(1, "Tingkat kelas minimal 1")
    .max(12, "Tingkat kelas maksimal 12"),
  
  section: z
    .string()
    .min(1, "Rombel wajib diisi")
    .max(10, "Rombel maksimal 10 karakter"),
  
  academicYear: z
    .string()
    .min(1, "Tahun akademik wajib diisi")
    .max(20, "Tahun akademik maksimal 20 karakter"),
  
  schoolId: z
    .string()
    .min(1, "Sekolah harus dipilih"),
  
  maxStudents: z
    .number({
      message: "Kapasitas maksimal harus berupa angka yang valid" 
    })
    .min(1, "Kapasitas minimal 1 siswa")
    .max(50, "Kapasitas maksimal 50 siswa"),
  
  currentStudents: z
    .number({
      message: "Jumlah siswa saat ini harus berupa angka yang valid"
    })
    .min(0, "Jumlah siswa tidak boleh negatif"),
  
  roomNumber: z
    .string()
    .max(20, "Nomor ruang maksimal 20 karakter")
    .optional()
    .nullable(),
  
  teacherName: z
    .string()
    .max(100, "Nama guru maksimal 100 karakter")
    .optional()
    .nullable(),
  
  notes: z
    .string()
    .max(500, "Catatan maksimal 500 karakter")
    .optional()
    .nullable()
})

// Class Update Schema
export const classUpdateSchema = classCreateSchema.partial().extend({
  id: z.string().min(1, "ID kelas harus diisi")
})

// Class Filter Schema
export const classFilterSchema = z.object({
  search: z.string().optional(),
  schoolId: z.string().optional(), 
  grade: z.string().optional(),
  level: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})

// Type exports
export type ClassCreateInput = z.infer<typeof classCreateSchema>
export type ClassUpdateInput = z.infer<typeof classUpdateSchema>
export type ClassFilterInput = z.infer<typeof classFilterSchema>

// Form data types for React Hook Form
export type ClassCreateFormData = ClassCreateInput
export type ClassUpdateFormData = ClassUpdateInput
