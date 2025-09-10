import * as z from "zod"

// Class Create Schema - Match Prisma schema
export const classCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Nama kelas wajib diisi")
    .max(100, "Nama kelas maksimal 100 karakter"),
  
  grade: z
    .number({ 
      message: "Tingkat kelas harus berupa angka yang valid"
    })
    .min(1, "Tingkat kelas minimal 1")
    .max(12, "Tingkat kelas maksimal 12"),
  
  capacity: z
    .number({
      message: "Kapasitas harus berupa angka yang valid" 
    })
    .min(1, "Kapasitas minimal 1 siswa")
    .max(50, "Kapasitas maksimal 50 siswa")
    .default(25),
  
  schoolId: z
    .string()
    .min(1, "Sekolah harus dipilih"),
  
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
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})

// Type exports
export type ClassCreateInput = z.infer<typeof classCreateSchema>
export type ClassUpdateInput = z.infer<typeof classUpdateSchema>
export type ClassFilterInput = z.infer<typeof classFilterSchema>
