'use client'

import { useState, useEffect } from 'react'
import { DistributionSchoolCard } from './distribution-school-card'
import { DistributionSchoolStats } from './distribution-school-stats'
import { DistributionSchoolFilters } from './distribution-school-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DistributionSchool {
  id: string
  distributionId: string
  schoolId: string
  plannedPortions: number
  actualPortions: number | null
  routeOrder: number
  createdAt: string
  distribution: {
    id: string
    distributionDate: string
    status: string
  }
  school: {
    id: string
    name: string
    address: string
    totalStudents: number
  }
}

export function DistributionSchoolsList() {
  const [distributionSchools, setDistributionSchools] = useState<DistributionSchool[]>([])
  const [filteredData, setFilteredData] = useState<DistributionSchool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    fetchDistributionSchools()
  }, [])

  useEffect(() => {
    filterData()
  }, [distributionSchools, searchTerm, statusFilter, dateFilter])

  const fetchDistributionSchools = async () => {
    try {
      const response = await fetch('/api/distribution-schools')
      if (response.ok) {
        const data = await response.json()
        setDistributionSchools(data.data || [])
      } else {
        throw new Error('Failed to fetch distribution schools')
      }
    } catch (error) {
      toast.error('Failed to load distribution schools')
    } finally {
      setIsLoading(false)
    }
  }

  const filterData = () => {
    let filtered = distributionSchools

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.distribution.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        const hasActual = item.actualPortions !== null
        
        switch (statusFilter) {
          case 'pending':
            return !hasActual
          case 'delivered':
            return hasActual
          case 'complete':
            return hasActual && item.actualPortions === item.plannedPortions
          case 'partial':
            return hasActual && item.actualPortions! < item.plannedPortions
          case 'excess':
            return hasActual && item.actualPortions! > item.plannedPortions
          default:
            return true
        }
      })
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.distribution.distributionDate)
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate())
        
        switch (dateFilter) {
          case 'today':
            return itemDateOnly.getTime() === today.getTime()
          case 'yesterday':
            return itemDateOnly.getTime() === yesterday.getTime()
          case 'this-week':
            const weekStart = new Date(today)
            weekStart.setDate(today.getDate() - today.getDay())
            return itemDate >= weekStart && itemDate <= now
          case 'last-week':
            const lastWeekStart = new Date(today)
            lastWeekStart.setDate(today.getDate() - today.getDay() - 7)
            const lastWeekEnd = new Date(lastWeekStart)
            lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
            return itemDate >= lastWeekStart && itemDate <= lastWeekEnd
          case 'this-month':
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
            return itemDate >= monthStart && itemDate <= now
          default:
            return true
        }
      })
    }

    setFilteredData(filtered)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter('all')
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <DistributionSchoolStats distributionSchools={distributionSchools} />

      {/* Filters */}
      <DistributionSchoolFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onClearFilters={handleClearFilters}
        totalResults={distributionSchools.length}
        filteredResults={filteredData.length}
      />

      {/* Cards Grid */}
      {paginatedData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((distributionSchool) => (
            <DistributionSchoolCard
              key={distributionSchool.id}
              distributionSchool={distributionSchool}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Distribution Schools Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {distributionSchools.length === 0
                ? 'No distribution schools have been set up yet.'
                : 'No distribution schools match your current filters.'
              }
            </p>
            {filteredData.length !== distributionSchools.length && (
              <Button 
                onClick={handleClearFilters}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages} • Showing {paginatedData.length} of {filteredData.length} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
