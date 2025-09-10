'use client'

import { Control } from 'react-hook-form'
import { useState, useEffect } from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2 } from "lucide-react"

interface School {
  id: string
  name: string
}

export interface StudentSchoolFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function StudentSchoolFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Sekolah",
  description
}: StudentSchoolFieldsProps) {
  const [schools, setSchools] = useState<School[]>([])
  const [schoolsLoading, setSchoolsLoading] = useState(true)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools?limit=100')
        const result = await response.json()
        
        if (result.data) {
          setSchools(result.data)
        } else if (Array.isArray(result)) {
          setSchools(result)
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
      } finally {
        setSchoolsLoading(false)
      }
    }

    fetchSchools()
  }, [])

  return (
    <div className="space-y-6">
      {title && (
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {/* School Selection */}
        <FormField
          control={control}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Building2 className="w-4 h-4 inline mr-1" />
                Sekolah *
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isSubmitting || schoolsLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={schoolsLoading ? "Memuat..." : "Pilih sekolah"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Pilih sekolah tempat siswa bersekolah
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
