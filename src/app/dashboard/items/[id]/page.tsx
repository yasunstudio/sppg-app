import { ItemDetails } from "../components"

interface ItemDetailsPageProps {
  params: {
    id: string
  }
}

export default function ItemDetailsPage({ params }: ItemDetailsPageProps) {
  return <ItemDetails itemId={params.id} />
}
