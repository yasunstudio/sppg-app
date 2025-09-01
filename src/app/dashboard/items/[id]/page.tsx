import { ItemDetails } from "../components"

interface ItemDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ItemDetailsPage({ params }: ItemDetailsPageProps) {
  const { id } = await params
  return <ItemDetails itemId={id} />
}
