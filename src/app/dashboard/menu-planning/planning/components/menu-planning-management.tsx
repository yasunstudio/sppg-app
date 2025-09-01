'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MenuPlanningHeader } from './menu-planning-header'
import { MenuPlanningStats } from './menu-planning-stats'
import { MenuPlanningTabs } from './menu-planning-tabs'

interface MenuPlanningFilters {
  search: string
  mealType: string
  isActive: boolean | undefined
  dateFrom: string
  dateTo: string
  page: number
  limit: number
}

export function MenuPlanningManagement() {
  const [filters, setFilters] = useState<MenuPlanningFilters>({
    search: '',
    mealType: 'all',
    isActive: undefined,
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 12,
  })

  const [activeTab, setActiveTab] = useState('calendar')

  const updateFilters = (newFilters: Partial<MenuPlanningFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  // Fetch menus with current filters
  const { data: menusData, isLoading: menusLoading, error: menusError } = useQuery({
    queryKey: ['menu-planning', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.mealType !== 'all') params.append('mealType', filters.mealType)
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString())
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)
      params.append('page', filters.page.toString())
      params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/menu-planning?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch menus')
      }
      return response.json()
    },
  })

  // Fetch stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['menu-planning-stats', filters.dateFrom, filters.dateTo],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)

      const response = await fetch(`/api/menu-planning/stats?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      return response.json()
    },
  })

  return (
    <div className="space-y-6">
      <MenuPlanningHeader />
      
      <MenuPlanningStats 
        data={statsData} 
        isLoading={statsLoading} 
      />
      
      <MenuPlanningTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        menus={menusData?.data || []}
        isLoading={menusLoading}
        error={menusError}
        filters={filters}
        onFiltersChange={updateFilters}
        pagination={menusData?.pagination}
      />
    </div>
  )
}
