'use client'

import { useParams } from 'next/navigation'
import { NutritionConsultationDetails } from '../components/nutrition-consultation-details'

export default function NutritionConsultationDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  return <NutritionConsultationDetails id={id} />
}
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const { consultation, loading, error } = useNutritionConsultation(id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'ANSWERED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Answered</Badge>
      case 'CLOSED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this consultation?')) {
      try {
        const response = await fetch(`/api/nutrition-consultations/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          router.push('/dashboard/nutrition-consultations')
        } else {
          alert('Failed to delete consultation')
        }
      } catch (error) {
        console.error('Error deleting consultation:', error)
        alert('Error deleting consultation')
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/nutrition-consultations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Consultations
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">Loading consultation details...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !consultation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/nutrition-consultations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Consultations
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-500">
              {error || 'Consultation not found'}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/nutrition-consultations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Consultations
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Consultation Details</h1>
            <p className="text-muted-foreground">
              View nutrition consultation information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/nutrition-consultations/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Consultation Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Consultation
                </CardTitle>
                {getStatusBadge(consultation.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Question:</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {consultation.question}
                </p>
              </div>
              
              {consultation.answer && (
                <div>
                  <h3 className="font-semibold mb-2">Answer:</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      {consultation.answer}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {consultation.student?.name || 'Unknown'}
                  </p>
                </div>
                {consultation.student?.school && (
                  <div>
                    <Label className="text-sm font-medium">School</Label>
                    <p className="text-sm text-muted-foreground">
                      {consultation.student.school.name}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(consultation.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(consultation.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Label component for consistency
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  )
}
