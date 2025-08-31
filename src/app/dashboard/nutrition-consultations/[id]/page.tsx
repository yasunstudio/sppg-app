'use client'

import { useParams } from 'next/navigation'
import { NutritionConsultationDetails } from '../components/nutrition-consultation-details'

export default function NutritionConsultationDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  return <NutritionConsultationDetails id={id} />
}
