import { ClassEdit } from '../../components'

interface ClassEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClassEditPage({ params }: ClassEditPageProps) {
  const { id } = await params
  return <ClassEdit classId={id} />
}
