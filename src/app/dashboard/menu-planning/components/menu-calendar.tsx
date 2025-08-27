'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { MEAL_TYPES, getMealTypeLabel, getMealTypeLegendColor } from '@/lib/constants/meal-types'

interface MenuCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  menus: any[]
  onRefetch: () => void
  getMealTypeColor: (mealType: string) => string
}

export function MenuCalendar({
  selectedDate,
  onDateSelect,
  menus,
  onRefetch,
  getMealTypeColor
}: MenuCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const mealTypes = Object.entries(MEAL_TYPES).map(([key, value]) => ({
    key: value,
    label: getMealTypeLabel(value),
    colorClass: getMealTypeLegendColor(value)
  }))

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected = date.toDateString() === selectedDate.toDateString()
      const isToday = date.toDateString() === new Date().toDateString()

      // Find menus for this date from real data
      const dateString = date.toISOString().split('T')[0]
      const dayMenus = menus.filter(menu => {
        const menuDate = new Date(menu.menuDate).toISOString().split('T')[0]
        return menuDate === dateString
      }).slice(0, 2) // Limit to 2 menus per day for display

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[100px] border cursor-pointer transition-colors ${
            isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
          } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
          onClick={() => onDateSelect(date)}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
              {day}
            </span>
            {isToday && (
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-600">
                Hari Ini
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            {dayMenus.map((menu, index) => (
              <div
                key={index}
                className="text-xs p-1 rounded bg-background border truncate"
                title={menu.name}
              >
                <Badge className={getMealTypeColor(menu.mealType)} variant="outline">
                  {getMealTypeLabel(menu.mealType)}
                </Badge>
              </div>
            ))}
            {dayMenus.length === 0 && (
              <div className="text-xs text-muted-foreground italic">
                Belum ada menu
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Kalender Menu - {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Menu
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
        
        <div className="mt-4 flex items-center space-x-4 text-sm flex-wrap">
          {mealTypes.map(mealType => (
            <div key={mealType.key} className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${mealType.colorClass} rounded`}></div>
              <span>{mealType.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
