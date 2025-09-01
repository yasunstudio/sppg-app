import { EditQualityCheckpointForm } from "../../components"

interface EditQualityCheckpointPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditQualityCheckpointPage({ params }: EditQualityCheckpointPageProps) {
  const { id } = await params
  return <EditQualityCheckpointForm checkpointId={id} />
}
