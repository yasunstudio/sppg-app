// ============================================================================
// UTILITY FUNCTIONS FOR CONSTANTS (src/lib/constants/utils.ts)
// ============================================================================

import { 
  NUTRITION_TARGETS, 
  PARTICIPANT_TYPE, 
  NUTRITION_STATUS, 
  MEAL_TYPE,
  GENDER,
  STATUS,
  PRODUCTION_STATUS,
  DISTRIBUTION_STATUS,
  QC_STATUS,
  type ParticipantType,
  type NutritionStatus,
  type MealType,
  type Gender,
  type Status,
  type ProductionStatus,
  type DistributionStatus,
  type QCStatus
} from '@/lib/constants'

// Participant type utilities
export const getParticipantTypeLabel = (type: ParticipantType): string => {
  const labels: Record<ParticipantType, string> = {
    [PARTICIPANT_TYPE.PREGNANT_WOMAN]: 'Ibu Hamil',
    [PARTICIPANT_TYPE.LACTATING_MOTHER]: 'Ibu Menyusui',
    [PARTICIPANT_TYPE.TODDLER]: 'Balita',
    [PARTICIPANT_TYPE.CHILD]: 'Anak',
    [PARTICIPANT_TYPE.ELDERLY]: 'Lansia',
  }
  return labels[type] || type
}

export const getParticipantTypeColor = (type: ParticipantType): string => {
  const colors: Record<ParticipantType, string> = {
    [PARTICIPANT_TYPE.PREGNANT_WOMAN]: 'bg-pink-100 text-pink-800',
    [PARTICIPANT_TYPE.LACTATING_MOTHER]: 'bg-purple-100 text-purple-800',
    [PARTICIPANT_TYPE.TODDLER]: 'bg-blue-100 text-blue-800',
    [PARTICIPANT_TYPE.CHILD]: 'bg-green-100 text-green-800',
    [PARTICIPANT_TYPE.ELDERLY]: 'bg-gray-100 text-gray-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

// Nutrition status utilities
export const getNutritionStatusLabel = (status: NutritionStatus): string => {
  const labels: Record<NutritionStatus, string> = {
    [NUTRITION_STATUS.NORMAL]: 'Normal',
    [NUTRITION_STATUS.UNDERWEIGHT]: 'Berat Badan Kurang',
    [NUTRITION_STATUS.OVERWEIGHT]: 'Berat Badan Lebih',
    [NUTRITION_STATUS.OBESE]: 'Obesitas',
    [NUTRITION_STATUS.STUNTED]: 'Stunting',
    [NUTRITION_STATUS.WASTED]: 'Wasting',
    [NUTRITION_STATUS.SEVERELY_UNDERWEIGHT]: 'Gizi Buruk',
  }
  return labels[status] || status
}

export const getNutritionStatusColor = (status: NutritionStatus): string => {
  const colors: Record<NutritionStatus, string> = {
    [NUTRITION_STATUS.NORMAL]: 'bg-green-100 text-green-800',
    [NUTRITION_STATUS.UNDERWEIGHT]: 'bg-yellow-100 text-yellow-800',
    [NUTRITION_STATUS.OVERWEIGHT]: 'bg-orange-100 text-orange-800',
    [NUTRITION_STATUS.OBESE]: 'bg-red-100 text-red-800',
    [NUTRITION_STATUS.STUNTED]: 'bg-red-100 text-red-800',
    [NUTRITION_STATUS.WASTED]: 'bg-red-100 text-red-800',
    [NUTRITION_STATUS.SEVERELY_UNDERWEIGHT]: 'bg-red-200 text-red-900',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Meal type utilities
export const getMealTypeLabel = (mealType: MealType): string => {
  const labels: Record<MealType, string> = {
    [MEAL_TYPE.BREAKFAST]: 'Sarapan',
    [MEAL_TYPE.LUNCH]: 'Makan Siang',
    [MEAL_TYPE.DINNER]: 'Makan Malam',
    [MEAL_TYPE.SNACK]: 'Camilan',
  }
  return labels[mealType] || mealType
}

export const getMealTypeColor = (mealType: MealType): string => {
  const colors: Record<MealType, string> = {
    [MEAL_TYPE.BREAKFAST]: 'bg-yellow-100 text-yellow-800',
    [MEAL_TYPE.LUNCH]: 'bg-orange-100 text-orange-800',
    [MEAL_TYPE.DINNER]: 'bg-blue-100 text-blue-800',
    [MEAL_TYPE.SNACK]: 'bg-green-100 text-green-800',
  }
  return colors[mealType] || 'bg-gray-100 text-gray-800'
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
    [PRODUCTION_STATUS.PLANNED]: 'Direncanakan',
    [PRODUCTION_STATUS.IN_PROGRESS]: 'Sedang Berlangsung',
    [PRODUCTION_STATUS.COMPLETED]: 'Selesai',
    [PRODUCTION_STATUS.CANCELLED]: 'Dibatalkan',
    [PRODUCTION_STATUS.ON_HOLD]: 'Ditahan',
  }
  return labels[status] || status
}

export const getProductionStatusColor = (status: ProductionStatus): string => {
  const colors: Record<ProductionStatus, string> = {
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
    [QC_STATUS.PASS]: 'Lolos',
    [QC_STATUS.FAIL]: 'Gagal',
    [QC_STATUS.PENDING]: 'Menunggu',
    [QC_STATUS.REVIEW_REQUIRED]: 'Perlu Review',
  }
  return labels[status] || status
}

export const getQCStatusColor = (status: QCStatus): string => {
  const colors: Record<QCStatus, string> = {
    [QC_STATUS.PASS]: 'bg-green-100 text-green-800',
    [QC_STATUS.FAIL]: 'bg-red-100 text-red-800',
    [QC_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [QC_STATUS.REVIEW_REQUIRED]: 'bg-orange-100 text-orange-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Nutrition calculation utilities
export const calculateNutritionPercentage = (
  actual: number, 
  target: number
): number => {
  return Math.round((actual / target) * 100)
}

export const getNutritionTargetByParticipantType = (
  participantType: ParticipantType
) => {
  switch (participantType) {
    case PARTICIPANT_TYPE.PREGNANT_WOMAN:
      return NUTRITION_TARGETS.PREGNANT_WOMAN
    case PARTICIPANT_TYPE.LACTATING_MOTHER:
      return NUTRITION_TARGETS.LACTATING_MOTHER
    case PARTICIPANT_TYPE.TODDLER:
      return NUTRITION_TARGETS.TODDLER
    case PARTICIPANT_TYPE.ELDERLY:
      return NUTRITION_TARGETS.ELDERLY
    case PARTICIPANT_TYPE.CHILD:
      return NUTRITION_TARGETS.STUDENT
    default:
      return NUTRITION_TARGETS.STUDENT
  }
}

// Validation utilities
export const isValidParticipantType = (type: string): type is ParticipantType => {
  return Object.values(PARTICIPANT_TYPE).includes(type as ParticipantType)
}

export const isValidNutritionStatus = (status: string): status is NutritionStatus => {
  return Object.values(NUTRITION_STATUS).includes(status as NutritionStatus)
}

export const isValidMealType = (mealType: string): mealType is MealType => {
  return Object.values(MEAL_TYPE).includes(mealType as MealType)
}

export const isValidGender = (gender: string): gender is Gender => {
  return Object.values(GENDER).includes(gender as Gender)
}
