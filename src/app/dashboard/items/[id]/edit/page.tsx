import { EditItemForm } from "../../components"

interface EditItemPageProps {
  params: {
    id: string
  }
}

export default function EditItemPage({ params }: EditItemPageProps) {
  return <EditItemForm itemId={params.id} />
}
