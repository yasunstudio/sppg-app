// ============================================================================
// UTILITY FUNCTIONS FOR CONSTANTS (src/lib/constants/utils.ts)
// ============================================================================

// Basic constants for SPPG system
export const NUTRITION_STATUS = {
  NORMAL: 'NORMAL',
  UNDERWEIGHT: 'UNDERWEIGHT',
  SEVERELY_UNDERWEIGHT: 'SEVERELY_UNDERWEIGHT',
  OVERWEIGHT: 'OVERWEIGHT',
  OBESE: 'OBESE',
  STUNTED: 'STUNTED',
  WASTED: 'WASTED'
} as const

export const MEAL_TYPE = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  SNACK: 'SNACK',
  DINNER: 'DINNER'
} as const

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
} as const

export const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
} as const

export const PRODUCTION_STATUS = {
  PENDING: 'PENDING',
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD'
} as const

export const DISTRIBUTION_STATUS = {
  PREPARING: 'PREPARING',
  SCHEDULED: 'SCHEDULED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED'
} as const

export const QC_STATUS = {
  PENDING: 'PENDING',
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  NEEDS_REVIEW: 'NEEDS_REVIEW'
} as const

export const NUTRITION_TARGETS = {
  ENERGY_PER_DAY: 2000, // kcal
  PROTEIN_PER_DAY: 60,   // gram
  CARBS_PER_DAY: 300,    // gram
  FAT_PER_DAY: 67,       // gram
  FIBER_PER_DAY: 25      // gram
} as const

// Types
export type NutritionStatus = typeof NUTRITION_STATUS[keyof typeof NUTRITION_STATUS]
export type MealType = typeof MEAL_TYPE[keyof typeof MEAL_TYPE]
export type Gender = typeof GENDER[keyof typeof GENDER]
export type Status = typeof STATUS[keyof typeof STATUS]
export type ProductionStatus = typeof PRODUCTION_STATUS[keyof typeof PRODUCTION_STATUS]
export type DistributionStatus = typeof DISTRIBUTION_STATUS[keyof typeof DISTRIBUTION_STATUS]
export type QCStatus = typeof QC_STATUS[keyof typeof QC_STATUS]

// Nutrition status utilities
export const getNutritionStatusLabel = (status: NutritionStatus): string => {
  const labels: Record<NutritionStatus, string> = {
    [NUTRITION_STATUS.NORMAL]: 'Normal',
    [NUTRITION_STATUS.UNDERWEIGHT]: 'Berat Badan Kurang',
    [NUTRITION_STATUS.SEVERELY_UNDERWEIGHT]: 'Gizi Buruk',
    [NUTRITION_STATUS.OVERWEIGHT]: 'Berat Badan Lebih',
    [NUTRITION_STATUS.OBESE]: 'Obesitas',
    [NUTRITION_STATUS.STUNTED]: 'Stunting',
    [NUTRITION_STATUS.WASTED]: 'Wasting',
  }
  return labels[status] || status
}

export const getNutritionStatusColor = (status: NutritionStatus): string => {
  const colors: Record<NutritionStatus, string> = {
    [NUTRITION_STATUS.NORMAL]: 'bg-green-100 text-green-800',
    [NUTRITION_STATUS.UNDERWEIGHT]: 'bg-yellow-100 text-yellow-800',
    [NUTRITION_STATUS.SEVERELY_UNDERWEIGHT]: 'bg-red-200 text-red-900',
    [NUTRITION_STATUS.OVERWEIGHT]: 'bg-orange-100 text-orange-800',
    [NUTRITION_STATUS.OBESE]: 'bg-red-100 text-red-800',
    [NUTRITION_STATUS.STUNTED]: 'bg-purple-100 text-purple-800',
    [NUTRITION_STATUS.WASTED]: 'bg-pink-100 text-pink-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Meal type utilities
export const getMealTypeLabel = (mealType: MealType): string => {
  const labels: Record<MealType, string> = {
    [MEAL_TYPE.BREAKFAST]: 'Sarapan',
    [MEAL_TYPE.LUNCH]: 'Makan Siang',
    [MEAL_TYPE.SNACK]: 'Snack',
    [MEAL_TYPE.DINNER]: 'Makan Malam',
  }
  return labels[mealType] || mealType
}

// Gender utilities
export const getGenderLabel = (gender: Gender): string => {
  const labels: Record<Gender, string> = {
    [GENDER.MALE]: 'Laki-laki',
    [GENDER.FEMALE]: 'Perempuan',
  }
  return labels[gender] || gender
}

// Status utilities
export const getStatusLabel = (status: Status): string => {
  const labels: Record<Status, string> = {
    [STATUS.ACTIVE]: 'Aktif',
    [STATUS.INACTIVE]: 'Tidak Aktif',
    [STATUS.PENDING]: 'Menunggu',
    [STATUS.COMPLETED]: 'Selesai',
    [STATUS.APPROVED]: 'Disetujui',
    [STATUS.REJECTED]: 'Ditolak',
    [STATUS.DRAFT]: 'Draft',
    [STATUS.PUBLISHED]: 'Dipublikasikan',
    [STATUS.ARCHIVED]: 'Diarsipkan',
  }
  return labels[status] || status
}

export const getStatusColor = (status: Status): string => {
  const colors: Record<Status, string> = {
    [STATUS.ACTIVE]: 'bg-green-100 text-green-800',
    [STATUS.INACTIVE]: 'bg-gray-100 text-gray-800',
    [STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [STATUS.COMPLETED]: 'bg-green-100 text-green-800',
    [STATUS.APPROVED]: 'bg-green-100 text-green-800',
    [STATUS.REJECTED]: 'bg-red-100 text-red-800',
    [STATUS.DRAFT]: 'bg-gray-100 text-gray-800',
    [STATUS.PUBLISHED]: 'bg-blue-100 text-blue-800',
    [STATUS.ARCHIVED]: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Production status utilities
export const getProductionStatusLabel = (status: ProductionStatus): string => {
  const labels: Record<ProductionStatus, string> = {
    [PRODUCTION_STATUS.PENDING]: 'Menunggu',
    [PRODUCTION_STATUS.PLANNED]: 'Direncanakan',
    [PRODUCTION_STATUS.IN_PROGRESS]: 'Dalam Proses',
    [PRODUCTION_STATUS.COMPLETED]: 'Selesai',
    [PRODUCTION_STATUS.CANCELLED]: 'Dibatalkan',
    [PRODUCTION_STATUS.ON_HOLD]: 'Ditahan',
  }
  return labels[status] || status
}

export const getProductionStatusColor = (status: ProductionStatus): string => {
  const colors: Record<ProductionStatus, string> = {
    [PRODUCTION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [PRODUCTION_STATUS.PLANNED]: 'bg-blue-100 text-blue-800',
    [PRODUCTION_STATUS.IN_PROGRESS]: 'bg-orange-100 text-orange-800',
    [PRODUCTION_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
    [PRODUCTION_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
    [PRODUCTION_STATUS.ON_HOLD]: 'bg-yellow-100 text-yellow-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Distribution status utilities
export const getDistributionStatusLabel = (status: DistributionStatus): string => {
  const labels: Record<DistributionStatus, string> = {
    [DISTRIBUTION_STATUS.PREPARING]: 'Mempersiapkan',
    [DISTRIBUTION_STATUS.SCHEDULED]: 'Dijadwalkan',
    [DISTRIBUTION_STATUS.IN_TRANSIT]: 'Dalam Perjalanan',
    [DISTRIBUTION_STATUS.DELIVERED]: 'Terkirim',
    [DISTRIBUTION_STATUS.CANCELLED]: 'Dibatalkan',
    [DISTRIBUTION_STATUS.RETURNED]: 'Dikembalikan',
  }
  return labels[status] || status
}

export const getDistributionStatusColor = (status: DistributionStatus): string => {
  const colors: Record<DistributionStatus, string> = {
    [DISTRIBUTION_STATUS.PREPARING]: 'bg-blue-100 text-blue-800',
    [DISTRIBUTION_STATUS.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [DISTRIBUTION_STATUS.IN_TRANSIT]: 'bg-orange-100 text-orange-800',
    [DISTRIBUTION_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
    [DISTRIBUTION_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
    [DISTRIBUTION_STATUS.RETURNED]: 'bg-yellow-100 text-yellow-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// QC status utilities
export const getQCStatusLabel = (status: QCStatus): string => {
  const labels: Record<QCStatus, string> = {
    [QC_STATUS.PENDING]: 'Menunggu',
    [QC_STATUS.PASSED]: 'Lolos',
    [QC_STATUS.FAILED]: 'Gagal',
    [QC_STATUS.NEEDS_REVIEW]: 'Perlu Review',
  }
  return labels[status] || status
}

export const getQCStatusColor = (status: QCStatus): string => {
  const colors: Record<QCStatus, string> = {
    [QC_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [QC_STATUS.PASSED]: 'bg-green-100 text-green-800',
    [QC_STATUS.FAILED]: 'bg-red-100 text-red-800',
    [QC_STATUS.NEEDS_REVIEW]: 'bg-orange-100 text-orange-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Calculate nutrition percentage based on targets
export const calculateNutritionPercentage = (
  actual: number,
  target: number
): number => {
  if (target === 0) return 0
  return Math.round((actual / target) * 100)
}

// Calculate BMI
export const calculateBMI = (weight: number, height: number): number => {
  if (height === 0) return 0
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

// Get BMI status based on WHO standards
export const getBMIStatus = (bmi: number): NutritionStatus => {
  if (bmi < 16) return NUTRITION_STATUS.SEVERELY_UNDERWEIGHT
  if (bmi < 18.5) return NUTRITION_STATUS.UNDERWEIGHT
  if (bmi < 25) return NUTRITION_STATUS.NORMAL
  if (bmi < 30) return NUTRITION_STATUS.OVERWEIGHT
  return NUTRITION_STATUS.OBESE
}

// Format nutrition value with unit
export const formatNutritionValue = (
  value: number,
  unit: 'kcal' | 'gram' | 'mg' | 'mcg'
): string => {
  const unitLabels = {
    kcal: 'kkal',
    gram: 'g',
    mg: 'mg',
    mcg: 'mcg'
  }
  return `${value} ${unitLabels[unit]}`
}

// Calculate daily nutrition progress
export const calculateDailyProgress = (
  consumed: number,
  target: number
): { percentage: number; status: 'low' | 'normal' | 'high' | 'excess' } => {
  const percentage = calculateNutritionPercentage(consumed, target)
  
  if (percentage < 50) return { percentage, status: 'low' }
  if (percentage < 80) return { percentage, status: 'normal' }
  if (percentage <= 120) return { percentage, status: 'high' }
  return { percentage, status: 'excess' }
}
