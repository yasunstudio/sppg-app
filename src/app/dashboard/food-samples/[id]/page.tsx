import { FoodSampleDetails } from '../components'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FoodSampleDetailsPage({ params }: PageProps) {
  const { id } = await params
  return <FoodSampleDetails id={id} />
}
