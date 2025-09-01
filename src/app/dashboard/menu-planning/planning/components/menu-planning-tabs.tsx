'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuCalendarView } from './menu-calendar-view'
import { MenuListView } from './menu-list-view'
import { MenuAnalyticsView } from './menu-analytics-view'

interface MenuPlanningTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  menus: any[]
  isLoading: boolean
  error: any
  filters: any
  onFiltersChange: (filters: any) => void
  pagination?: any
}

export function MenuPlanningTabs({
  activeTab,
  onTabChange,
  menus,
  isLoading,
  error,
  filters,
  onFiltersChange,
  pagination,
}: MenuPlanningTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
        <TabsTrigger 
          value="calendar" 
          className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Calendar
        </TabsTrigger>
        <TabsTrigger 
          value="list" 
          className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Menu List
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="calendar" className="space-y-6 mt-6">
        <MenuCalendarView 
          menus={menus}
          isLoading={isLoading}
          error={error}
        />
      </TabsContent>

      <TabsContent value="list" className="space-y-6 mt-6">
        <MenuListView 
          menus={menus}
          isLoading={isLoading}
          error={error}
          filters={filters}
          onFiltersChange={onFiltersChange}
          pagination={pagination}
        />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6 mt-6">
        <MenuAnalyticsView 
          menus={menus}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  )
}
