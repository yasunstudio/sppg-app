import InventoryDetailClient from './inventory-detail-client'

interface InventoryDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InventoryDetailPage({ params }: InventoryDetailPageProps) {
  const { id } = await params
  
  return <InventoryDetailClient id={id} />
}
