import { z } from 'zod'

// Create Student Schema
export const studentCreateSchema = z.object({
  nisn: z.string()
    .min(10, 'NISN harus minimal 10 karakter')
    .max(20, 'NISN maksimal 20 karakter')
    .regex(/^[0-9]+$/, 'NISN hanya boleh berisi angka'),
  
  name: z.string()
    .min(2, 'Nama harus minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim(),
  
  age: z.number()
    .min(5, 'Usia minimal 5 tahun')
    .max(18, 'Usia maksimal 18 tahun')
    .int('Usia harus berupa bilangan bulat'),
  
  gender: z.enum(['MALE', 'FEMALE'], {
    message: 'Jenis kelamin harus dipilih'
  }),
  
  grade: z.string()
    .min(1, 'Kelas harus diisi')
    .max(10, 'Kelas maksimal 10 karakter'),
  
  parentName: z.string()
    .min(2, 'Nama orang tua harus minimal 2 karakter')
    .max(100, 'Nama orang tua maksimal 100 karakter')
    .trim(),
  
  schoolId: z.string()
    .min(1, 'Sekolah harus dipilih'),
  
  notes: z.string()
    .max(500, 'Catatan maksimal 500 karakter')
    .optional()
    .transform(val => val === '' ? undefined : val)
})

// Update Student Schema (includes ID)
export const studentUpdateSchema = studentCreateSchema.extend({
  id: z.string().min(1, 'ID siswa diperlukan')
})

// Student Filter Schema
export const studentFilterSchema = z.object({
  searchTerm: z.string().optional().default(''),
  selectedGrade: z.union([z.literal('all'), z.string()]).default('all'),
  selectedGender: z.union([z.literal('all'), z.literal('MALE'), z.literal('FEMALE')]).default('all'),
  selectedSchool: z.union([z.literal('all'), z.string()]).default('all'),
  selectedAge: z.union([z.literal('all'), z.string()]).default('all'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(25)
})

// Search params schema for API
export const studentSearchParamsSchema = z.object({
  search: z.string().optional(),
  grade: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  school: z.string().optional(),
  age: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(25),
  sortBy: z.enum(['name', 'age', 'grade', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

// Bulk actions schema
export const studentBulkActionSchema = z.object({
  action: z.enum(['delete', 'export', 'move']),
  studentIds: z.array(z.string()).min(1, 'Minimal pilih 1 siswa'),
  schoolId: z.string().optional() // For move action
})

// Student import schema
export const studentImportSchema = z.object({
  students: z.array(studentCreateSchema).min(1, 'Minimal 1 siswa untuk diimport')
})

// Export types
export type StudentCreateInput = z.infer<typeof studentCreateSchema>
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>
export type StudentFilters = z.infer<typeof studentFilterSchema>
export type StudentSearchParams = z.infer<typeof studentSearchParamsSchema>
export type StudentBulkAction = z.infer<typeof studentBulkActionSchema>
export type StudentImport = z.infer<typeof studentImportSchema>
