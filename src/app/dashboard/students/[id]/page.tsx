import { StudentDetails } from '../components'

interface StudentDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params
  return <StudentDetails studentId={id} />
}
