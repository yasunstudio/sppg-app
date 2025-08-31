import { StudentEdit } from '../../components'

interface StudentEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StudentEditPage({ params }: StudentEditPageProps) {
  const { id } = await params
  return <StudentEdit studentId={id} />
}
