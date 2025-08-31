import { FoodSampleEdit } from '../../components'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditFoodSamplePage({ params }: PageProps) {
  const { id } = await params
  return <FoodSampleEdit id={id} />
}