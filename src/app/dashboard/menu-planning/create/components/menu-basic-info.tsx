'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon } from 'lucide-react'

interface MenuBasicInfoProps {
  form: any
}

const MEAL_TYPES = [
  { value: 'BREAKFAST', label: 'Breakfast', icon: '🌅' },
  { value: 'LUNCH', label: 'Lunch', icon: '☀️' },
  { value: 'DINNER', label: 'Dinner', icon: '🌙' },
  { value: 'SNACK', label: 'Snack', icon: '🍪' }
] as const

const TARGET_GROUPS = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'PREGNANT_WOMAN', label: 'Pregnant Woman' },
  { value: 'LACTATING_MOTHER', label: 'Lactating Mother' },
  { value: 'TODDLER', label: 'Toddler' },
  { value: 'ELDERLY', label: 'Elderly' }
] as const

export function MenuBasicInfo({ form }: MenuBasicInfoProps) {
  const { register, formState: { errors }, watch, setValue } = form

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <span className="text-foreground">Basic Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Menu Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Menu Name *
          </Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter menu name"
            className="w-full"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Describe the menu"
            className="w-full min-h-[100px]"
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Menu Date and Meal Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="menuDate" className="text-sm font-medium text-foreground">
              Menu Date *
            </Label>
            <Input
              id="menuDate"
              type="date"
              {...register('menuDate')}
              className="w-full"
            />
            {errors.menuDate && (
              <p className="text-sm text-destructive">{errors.menuDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Meal Type *
            </Label>
            <Select
              value={watch('mealType')}
              onValueChange={(value) => setValue('mealType', value as any)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                {MEAL_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mealType && (
              <p className="text-sm text-destructive">{errors.mealType.message}</p>
            )}
          </div>
        </div>

        {/* Target Group */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Target Group
          </Label>
          <Select
            value={watch('targetGroup')}
            onValueChange={(value) => setValue('targetGroup', value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select target group" />
            </SelectTrigger>
            <SelectContent>
              {TARGET_GROUPS.map((group) => (
                <SelectItem key={group.value} value={group.value}>
                  {group.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.targetGroup && (
            <p className="text-sm text-destructive">{errors.targetGroup.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
