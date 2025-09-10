"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ClassEditFormProps {
  classId: string
}

export function ClassEditForm({ classId }: ClassEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    className: '',
    gradeLevel: '',
    capacity: '',
    academicYear: '',
    description: ''
  })

  useEffect(() => {
    // Load existing class data
    const loadClassData = async () => {
      try {
        // Simulate API call to fetch class data
        await new Promise(resolve => setTimeout(resolve, 500))
        setFormData({
          className: 'Kelas 1A',
          gradeLevel: '1',
          capacity: '30',
          academicYear: '2024/2025',
          description: 'Kelas untuk siswa tingkat 1'
        })
      } catch (error) {
        console.error('Error loading class data:', error)
      }
    }

    if (classId) {
      loadClassData()
    }
  }, [classId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Implementation for updating class
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      router.push('/dashboard/classes')
    } catch (error) {
      console.error('Error updating class:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Kelas</CardTitle>
        <CardDescription>
          Perbarui informasi kelas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="className">Nama Kelas</Label>
              <Input
                id="className"
                value={formData.className}
                onChange={(e) => handleInputChange('className', e.target.value)}
                placeholder="Contoh: Kelas 1A"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Tingkat</Label>
              <Select value={formData.gradeLevel} onValueChange={(value) => handleInputChange('gradeLevel', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Kelas 1</SelectItem>
                  <SelectItem value="2">Kelas 2</SelectItem>
                  <SelectItem value="3">Kelas 3</SelectItem>
                  <SelectItem value="4">Kelas 4</SelectItem>
                  <SelectItem value="5">Kelas 5</SelectItem>
                  <SelectItem value="6">Kelas 6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Kapasitas</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="30"
                min="1"
                max="50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicYear">Tahun Ajaran</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => handleInputChange('academicYear', e.target.value)}
                placeholder="2024/2025"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi kelas (opsional)"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
