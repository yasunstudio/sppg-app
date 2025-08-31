import { QualityCheckpointDetails } from "../components"

interface QualityCheckpointDetailsPageProps {
  params: {
    id: string
  }
}

export default function QualityCheckpointDetailsPage({ params }: QualityCheckpointDetailsPageProps) {
  return <QualityCheckpointDetails checkpointId={params.id} />
}
