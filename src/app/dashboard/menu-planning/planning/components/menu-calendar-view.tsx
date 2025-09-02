'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { DailyMenuPreview } from './daily-menu-preview'

interface MenuCalendarViewProps {
  menus: any[]
  isLoading: boolean
  error: any
}

export function MenuCalendarView({ menus, isLoading, error }: MenuCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Fix hydration mismatch by initializing date on client side
  useEffect(() => {
    setCurrentDate(new Date())
    setIsClient(true)
  }, [])

  // Reset selectedDate when month changes
  useEffect(() => {
    setSelectedDate(null)
  }, [currentDate])

  // Get current month info (with safe defaults for loading state)
  const year = currentDate?.getFullYear() ?? new Date().getFullYear()
  const month = currentDate?.getMonth() ?? new Date().getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Create calendar grid with memoization
  const calendarDays = useMemo(() => {
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }, [firstDayWeekday, daysInMonth])

  // Get menus for a specific date with memoization
  const getMenusForDate = useMemo(() => {
    return (day: number) => {
      try {
        const targetDate = new Date(year, month, day)
        return menus.filter(menu => {
          try {
            const menuDate = new Date(menu.menuDate)
            return menuDate.toDateString() === targetDate.toDateString()
          } catch (e) {
            console.warn('Invalid menu date:', menu.menuDate)
            return false
          }
        })
      } catch (e) {
        console.warn('Error filtering menus for date:', day, e)
        return []
      }
    }
  }, [menus, year, month])

  if (error) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="p-8 text-center">
          <p className="text-destructive">Failed to load calendar data</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Show loading while hydrating or if currentDate is not set
  if (!isClient || !currentDate || isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Menu Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 bg-muted/30 rounded-lg border border-border animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
        <DailyMenuPreview menus={[]} isLoading={true} />
      </div>
    )
  }

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      case 'LUNCH':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'DINNER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'SNACK':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      if (!prev) return new Date() // Fallback to current date if null
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Menu Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 bg-muted/30 rounded-lg border border-border animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
        <DailyMenuPreview menus={[]} isLoading={true} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Menu Calendar
            </CardTitle>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                {menus.length} Total Menus
              </div>
              <div className="text-xs text-muted-foreground">
                {menus.filter(menu => {
                  const menuDate = new Date(menu.menuDate)
                  return menuDate.getMonth() === month && menuDate.getFullYear() === year
                }).length} this month
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="border-border hover:bg-muted flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">
                {monthNames[(month - 1 + 12) % 12]}
              </span>
            </Button>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">
                {monthNames[month]} {year}
              </h3>
              <div className="text-xs text-muted-foreground mt-1">
                {selectedDate 
                  ? `Selected: ${monthNames[month]} ${selectedDate}, ${year}`
                  : 'Click on a date to select'
                }
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="border-border hover:bg-muted flex items-center gap-2"
            >
              <span className="hidden sm:inline text-xs">
                {monthNames[(month + 1) % 12]}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-semibold text-foreground bg-muted/50 dark:bg-muted/50 rounded-md border border-border">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${year}-${month}-${index}`} className="p-2 h-28"></div>
              }

              const dayMenus = getMenusForDate(day)
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()
              const isSelected = selectedDate === day
              const hasMenus = dayMenus.length > 0

              const handleDayClick = () => {
                setSelectedDate(selectedDate === day ? null : day)
              }

              return (
                <div
                  key={`day-${year}-${month}-${day}`}
                  onClick={handleDayClick}
                  className={`relative p-2 h-28 border border-border rounded-lg transition-all duration-200 cursor-pointer group ${
                    isToday 
                      ? 'bg-primary/10 border-primary shadow-md' 
                      : isSelected
                        ? 'bg-secondary/50 border-secondary shadow-md'
                        : hasMenus 
                          ? 'bg-card hover:bg-muted/30 shadow-sm hover:shadow-md' 
                          : 'bg-card/50 hover:bg-muted/20'
                  }`}
                  suppressHydrationWarning
                >
                  {/* Date Number */}
                  <div 
                    className={`text-sm font-semibold mb-2 flex items-center justify-between ${
                      isToday ? 'text-primary' : isSelected ? 'text-secondary-foreground' : 'text-foreground'
                    }`}
                    suppressHydrationWarning
                  >
                    <span>{day}</span>
                    <div className="flex items-center gap-1">
                      {hasMenus && (
                        <div className={`w-2 h-2 rounded-full ${
                          isToday ? 'bg-primary' : isSelected ? 'bg-secondary' : 'bg-emerald-500'
                        }`}></div>
                      )}
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    {dayMenus.slice(0, 3).map((menu, menuIndex) => {
                      // Create a stable key using year, month, day, and menu index
                      const stableKey = `${year}-${month}-${day}-menu-${menuIndex}`
                      return (
                        <div
                          key={stableKey}
                          className={`${getMealTypeColor(menu.mealType)} rounded px-1.5 py-0.5 text-xs font-medium transition-all group-hover:scale-105`}
                          title={`${menu.name} - ${menu.mealType}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate flex-1">
                              {menu.mealType === 'BREAKFAST' ? '🌅' : 
                               menu.mealType === 'LUNCH' ? '🍽️' : 
                               menu.mealType === 'DINNER' ? '🌙' : '🍎'}
                            </span>
                            <span className="ml-1 text-xs opacity-80">
                              {menu.mealType === 'BREAKFAST' ? 'B' : 
                               menu.mealType === 'LUNCH' ? 'L' : 
                               menu.mealType === 'DINNER' ? 'D' : 'S'}
                            </span>
                          </div>
                        </div>
                      )
                    })}

                    {/* Additional Menus Indicator */}
                    {dayMenus.length > 3 && (
                      <div className="flex items-center justify-center">
                        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                          +{dayMenus.length - 3} more
                        </div>
                      </div>
                    )}

                    {/* Empty State for Days without Menus */}
                    {dayMenus.length === 0 && (
                      <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs text-muted-foreground text-center">
                          <div className="w-4 h-4 mx-auto mb-1 opacity-50">➕</div>
                          <div>Add Menu</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay for Additional Info */}
                  {hasMenus && (
                    <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
                      <div className="absolute bottom-1 right-1">
                        <div className="text-xs text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded shadow-sm">
                          {dayMenus.length} menu{dayMenus.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend & Info */}
          <div className="mt-6 space-y-3">
            {/* Meal Types Legend */}
            <div className="bg-muted/30 dark:bg-muted/30 rounded-lg p-3 border border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">Meal Types</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <div className={`${getMealTypeColor('BREAKFAST')} rounded px-2 py-1 text-xs font-medium flex items-center gap-1`}>
                    <span>🌅</span>
                    <span>B</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Breakfast</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`${getMealTypeColor('LUNCH')} rounded px-2 py-1 text-xs font-medium flex items-center gap-1`}>
                    <span>🍽️</span>
                    <span>L</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Lunch</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`${getMealTypeColor('DINNER')} rounded px-2 py-1 text-xs font-medium flex items-center gap-1`}>
                    <span>🌙</span>
                    <span>D</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Dinner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`${getMealTypeColor('SNACK')} rounded px-2 py-1 text-xs font-medium flex items-center gap-1`}>
                    <span>🍎</span>
                    <span>S</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Snack</span>
                </div>
              </div>
            </div>

            {/* Calendar Stats */}
            <div className="bg-muted/30 dark:bg-muted/30 rounded-lg p-3 border border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">Calendar Information</h4>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Days with menus</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span>Selected day</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>➕</span>
                  <span>Click to select/add menu</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Menu Preview */}
      <DailyMenuPreview 
        menus={menus}
        isLoading={isLoading}
      />
    </div>
  )
}
