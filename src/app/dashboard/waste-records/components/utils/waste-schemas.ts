import * as z from "zod"

// Enum definitions based on Prisma schema
export const wasteTypeEnum = z.enum(['ORGANIC', 'INORGANIC', 'PACKAGING'])
export const wasteSourceEnum = z.enum(['PREPARATION', 'PRODUCTION', 'PACKAGING', 'SCHOOL_LEFTOVER', 'EXPIRED_MATERIAL'])

// Waste Record Create Schema
export const wasteRecordCreateSchema = z.object({
  recordDate: z.string().min(1, "Tanggal pencatatan wajib diisi"),
  wasteType: wasteTypeEnum,
  source: wasteSourceEnum,
  weight: z.number().min(0.1, "Berat limbah harus lebih dari 0").max(10000, "Berat limbah maksimal 10.000 kg"),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
  schoolId: z.string().cuid("Format School ID tidak valid").optional()
})

// Waste Record Update Schema
export const wasteRecordUpdateSchema = z.object({
  id: z.string().cuid("ID waste record tidak valid"),
  recordDate: z.string().min(1, "Tanggal pencatatan wajib diisi"),
  wasteType: wasteTypeEnum,
  source: wasteSourceEnum,
  weight: z.number().min(0.1, "Berat limbah harus lebih dari 0").max(10000, "Berat limbah maksimal 10.000 kg"),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
  schoolId: z.string().cuid("Format School ID tidak valid").optional()
})

// Waste Record Filters Schema
export const wasteRecordFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  selectedWasteType: z.string().optional(),
  selectedSource: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  schoolId: z.string().optional(),
})

// Type exports
export type WasteRecordCreateInput = z.infer<typeof wasteRecordCreateSchema>
export type WasteRecordUpdateInput = z.infer<typeof wasteRecordUpdateSchema>
export type WasteRecordFiltersInput = z.infer<typeof wasteRecordFiltersSchema>

// Form defaults
export const wasteRecordCreateDefaults: WasteRecordCreateInput = {
  recordDate: new Date().toISOString().split('T')[0],
  wasteType: 'ORGANIC',
  source: 'PREPARATION',
  weight: 1
}

export const wasteRecordFiltersDefaults: WasteRecordFiltersInput = {
  searchTerm: "",
  selectedWasteType: "",
  selectedSource: "",
  dateFrom: "",
  dateTo: "",
  schoolId: ""
}

// Options for form selects
export const wasteTypeOptions = [
  { value: 'ORGANIC', label: 'Organik' },
  { value: 'INORGANIC', label: 'Anorganik' },
  { value: 'PACKAGING', label: 'Kemasan' }
] as const

export const wasteSourceOptions = [
  { value: 'PREPARATION', label: 'Persiapan' },
  { value: 'PRODUCTION', label: 'Produksi' },
  { value: 'PACKAGING', label: 'Pengemasan' },
  { value: 'SCHOOL_LEFTOVER', label: 'Sisa Sekolah' },
  { value: 'EXPIRED_MATERIAL', label: 'Bahan Kadaluarsa' }
] as const
