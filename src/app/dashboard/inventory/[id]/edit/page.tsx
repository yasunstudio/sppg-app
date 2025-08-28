import EditInventoryClient from './edit-inventory-client'

interface EditInventoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditInventoryPage({ params }: EditInventoryPageProps) {
  const { id } = await params
  
  return <EditInventoryClient id={id} />
}
