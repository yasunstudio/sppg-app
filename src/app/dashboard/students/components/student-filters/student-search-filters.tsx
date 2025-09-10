'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { GENDER_OPTIONS, GRADE_OPTIONS, AGE_OPTIONS } from '../utils/student-types'
import type { StudentFilters } from '../utils/student-types'

interface School {
  id: string
  name: string
}

interface StudentSearchFiltersProps {
  filters: StudentFilters
  onFiltersChange: (filters: StudentFilters) => void
  onCreateStudent: () => void
  onRefresh: () => void
  loading?: boolean
}

export function StudentSearchFilters({
  filters,
  onFiltersChange,
  onCreateStudent,
  onRefresh,
  loading = false
}: StudentSearchFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm)
  const [schools, setSchools] = useState<School[]>([])
  const [loadingSchools, setLoadingSchools] = useState(true)

  // Fetch schools for filter dropdown
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools?limit=100')
        const result = await response.json()
        
        if (result.success) {
          setSchools(result.data)
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
      } finally {
        setLoadingSchools(false)
      }
    }

    fetchSchools()
  }, [])

  const handleSearch = (value: string) => {
    setLocalSearchTerm(value)
    onFiltersChange({
      ...filters,
      searchTerm: value
    })
  }

  const handleGradeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedGrade: value
    })
  }

  const handleGenderChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedGender: value as 'all' | 'MALE' | 'FEMALE'
    })
  }

  const handleSchoolChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedSchool: value
    })
  }

  const handleAgeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedAge: value
    })
  }

  const handleClearFilters = () => {
    setLocalSearchTerm('')
    onFiltersChange({
      searchTerm: '',
      selectedGrade: 'all',
      selectedGender: 'all',
      selectedSchool: 'all',
      selectedAge: 'all'
    })
  }

  const hasActiveFilters = 
    filters.searchTerm !== '' ||
    filters.selectedGrade !== 'all' ||
    filters.selectedGender !== 'all' ||
    filters.selectedSchool !== 'all' ||
    filters.selectedAge !== 'all'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Top Row - Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
              <Input
                placeholder="Cari siswa berdasarkan nama, NISN, atau orang tua..."
                value={localSearchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={onCreateStudent}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Siswa
              </Button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Grade Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Kelas</label>
              <Select
                value={filters.selectedGrade}
                onValueChange={handleGradeChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua kelas</SelectItem>
                  {GRADE_OPTIONS.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</label>
              <Select
                value={filters.selectedGender}
                onValueChange={handleGenderChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua jenis kelamin</SelectItem>
                  {GENDER_OPTIONS.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* School Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Sekolah</label>
              <Select
                value={filters.selectedSchool}
                onValueChange={handleSchoolChange}
                disabled={loading || loadingSchools}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingSchools ? "Memuat..." : "Semua sekolah"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua sekolah</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Age Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Usia</label>
              <Select
                value={filters.selectedAge}
                onValueChange={handleAgeChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua usia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua usia</SelectItem>
                  {AGE_OPTIONS.map((age) => (
                    <SelectItem key={age.value} value={age.value}>
                      {age.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground invisible">Action</label>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={loading || !hasActiveFilters}
                className="w-full flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Reset Filter
              </Button>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Filter aktif:</span>
              {filters.searchTerm && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Pencarian: "{filters.searchTerm}"
                </span>
              )}
              {filters.selectedGrade !== 'all' && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Kelas: {GRADE_OPTIONS.find(g => g.value === filters.selectedGrade)?.label}
                </span>
              )}
              {filters.selectedGender !== 'all' && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Jenis Kelamin: {GENDER_OPTIONS.find(g => g.value === filters.selectedGender)?.label}
                </span>
              )}
              {filters.selectedSchool !== 'all' && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Sekolah: {schools.find(s => s.id === filters.selectedSchool)?.name}
                </span>
              )}
              {filters.selectedAge !== 'all' && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Usia: {AGE_OPTIONS.find(a => a.value === filters.selectedAge)?.label}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
