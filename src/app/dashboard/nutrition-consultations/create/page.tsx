'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect } from 'react'

interface Student {
  id: string
  name: string
  school?: {
    name: string
  }
}

export default function CreateNutritionConsultationPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [studentsLoading, setStudentsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    studentId: '',
    question: '',
    answer: '',
    status: 'PENDING'
  })

  // Fetch students for dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students?limit=1000')
        if (response.ok) {
          const data = await response.json()
          setStudents(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setStudentsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.studentId || !formData.question) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/nutrition-consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/dashboard/nutrition-consultations')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create consultation')
      }
    } catch (error) {
      console.error('Error creating consultation:', error)
      alert('Error creating consultation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/nutrition-consultations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Consultations
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Nutrition Consultation</h1>
          <p className="text-muted-foreground">
            Add a new nutrition consultation record
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation Details</CardTitle>
          <CardDescription>
            Enter the consultation information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Student Selection */}
              <div className="space-y-2">
                <Label htmlFor="studentId">Student *</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}
                  disabled={studentsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={studentsLoading ? "Loading students..." : "Select a student"} />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} {student.school?.name && `(${student.school.name})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ANSWERED">Answered</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Textarea
                id="question"
                placeholder="Enter the nutrition question..."
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                rows={4}
                required
              />
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                placeholder="Enter the answer (optional)..."
                value={formData.answer}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                rows={4}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Creating...' : 'Create Consultation'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
