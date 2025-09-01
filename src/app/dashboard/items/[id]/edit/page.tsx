import { EditItemForm } from "../../components"

interface EditItemPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params
  return <EditItemForm itemId={id} />
}
