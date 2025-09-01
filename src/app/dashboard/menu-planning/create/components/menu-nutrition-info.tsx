'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Target } from 'lucide-react'

interface MenuNutritionInfoProps {
  form: any
}

export function MenuNutritionInfo({ form }: MenuNutritionInfoProps) {
  const { register, formState: { errors } } = form

  const nutritionFields = [
    {
      name: 'totalCalories' as const,
      label: 'Total Calories (kcal)',
      placeholder: 'Enter total calories',
      description: 'Target: 400-600 kcal per meal for students'
    },
    {
      name: 'totalProtein' as const,
      label: 'Total Protein (g)',
      placeholder: 'Enter protein content',
      description: 'Target: 15-25g per meal'
    },
    {
      name: 'totalCarbs' as const,
      label: 'Total Carbohydrates (g)',
      placeholder: 'Enter carbohydrate content',
      description: 'Target: 50-80g per meal'
    },
    {
      name: 'totalFat' as const,
      label: 'Total Fat (g)',
      placeholder: 'Enter fat content',
      description: 'Target: 10-20g per meal'
    },
    {
      name: 'totalFiber' as const,
      label: 'Total Fiber (g)',
      placeholder: 'Enter fiber content',
      description: 'Target: 5-10g per meal'
    }
  ]

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-primary" />
          <span className="text-foreground">Nutrition Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nutritionFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                {field.label}
              </Label>
              <Input
                id={field.name}
                type="number"
                step="0.1"
                min="0"
                {...register(field.name, { valueAsNumber: true })}
                placeholder={field.placeholder}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {field.description}
              </p>
              {errors[field.name] && (
                <p className="text-sm text-destructive">{errors[field.name]?.message}</p>
              )}
            </div>
          ))}
        </div>

        {/* Nutrition Guidelines */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Nutrition Guidelines for Students</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Balanced macronutrients: 50-60% carbs, 20-30% fat, 15-20% protein</p>
            <p>• Adequate fiber for digestive health</p>
            <p>• Meet 1/3 of daily nutritional needs per meal</p>
            <p>• Consider age-appropriate portion sizes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
