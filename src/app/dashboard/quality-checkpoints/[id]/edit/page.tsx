import { EditQualityCheckpointForm } from "../../components"

interface EditQualityCheckpointPageProps {
  params: {
    id: string
  }
}

export default function EditQualityCheckpointPage({ params }: EditQualityCheckpointPageProps) {
  return <EditQualityCheckpointForm checkpointId={params.id} />
}
