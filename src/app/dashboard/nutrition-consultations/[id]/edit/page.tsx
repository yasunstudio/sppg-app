'use client'

import { useParams } from 'next/navigation'
import { NutritionConsultationEdit } from '../../components/nutrition-consultation-edit'

export default function NutritionConsultationEditPage() {
  const params = useParams()
  const id = params.id as string
  
  return <NutritionConsultationEdit id={id} />
}
