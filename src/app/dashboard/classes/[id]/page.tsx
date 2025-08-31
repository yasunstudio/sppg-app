import { ClassDetails } from '../components'

interface ClassDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = await params
  return <ClassDetails classId={id} />
}
