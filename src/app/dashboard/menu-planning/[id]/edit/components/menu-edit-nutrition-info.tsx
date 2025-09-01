'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calculator, TrendingUp } from 'lucide-react'

interface MenuEditNutritionInfoProps {
  form: any
}

export function MenuEditNutritionInfo({ form }: MenuEditNutritionInfoProps) {
  const { register, formState: { errors }, watch } = form
  
  // Watch nutrition values for calculations
  const calories = watch('calories') || 0
  const protein = watch('protein') || 0
  const carbs = watch('carbs') || 0
  const fat = watch('fat') || 0
  const fiber = watch('fiber') || 0
  const sugar = watch('sugar') || 0
  const sodium = watch('sodium') || 0
  
  // Calculate nutrition score (simplified scoring)
  const nutritionScore = Math.min(100, Math.round(
    (calories > 0 ? 25 : 0) +
    (protein > 0 ? 25 : 0) +
    (carbs > 0 ? 25 : 0) +
    (fat > 0 ? 25 : 0)
  ))
  const nutritionFields = [
    {
      name: 'calories',
      label: 'Calories (kcal)',
      placeholder: '0',
      description: 'Total energy content per serving'
    },
    {
      name: 'protein',
      label: 'Protein (g)',
      placeholder: '0',
      description: 'Protein content for muscle development'
    },
    {
      name: 'carbs',
      label: 'Carbohydrates (g)',
      placeholder: '0',
      description: 'Main energy source for daily activities'
    },
    {
      name: 'fat',
      label: 'Fat (g)',
      placeholder: '0',
      description: 'Essential fats for brain development'
    },
    {
      name: 'fiber',
      label: 'Fiber (g)',
      placeholder: '0',
      description: 'Dietary fiber for digestive health'
    },
    {
      name: 'sugar',
      label: 'Sugar (g)',
      placeholder: '0',
      description: 'Natural and added sugars'
    },
    {
      name: 'sodium',
      label: 'Sodium (mg)',
      placeholder: '0',
      description: 'Sodium content for blood pressure control'
    }
  ]

  return (
    <Card className="border-border bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-primary" />
          <span>Nutrition Information</span>
        </CardTitle>
        <CardDescription>
          Update nutritional values for this menu to meet SPPG standards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nutrition Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-sm text-destructive">
                  {(errors[field.name] as any)?.message || 'This field is required'}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Nutrition Summary */}
        {calories && protein && carbs && fat && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-foreground">Nutrition Summary</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-foreground">{protein * 4}kcal</div>
                <div className="text-muted-foreground">from Protein</div>
                <div className="text-xs text-muted-foreground">
                  {calories ? Math.round((protein * 4 / calories) * 100) : 0}%
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">{carbs * 4}kcal</div>
                <div className="text-muted-foreground">from Carbs</div>
                <div className="text-xs text-muted-foreground">
                  {calories ? Math.round((carbs * 4 / calories) * 100) : 0}%
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">{fat * 9}kcal</div>
                <div className="text-muted-foreground">from Fat</div>
                <div className="text-xs text-muted-foreground">
                  {calories ? Math.round((fat * 9 / calories) * 100) : 0}%
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">{nutritionScore}%</div>
                <div className="text-muted-foreground">Nutrition Score</div>
                <div className={`text-xs ${nutritionScore >= 80 ? 'text-green-600' : nutritionScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {nutritionScore >= 80 ? 'Excellent' : nutritionScore >= 60 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nutrition Guidelines */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Nutrition Guidelines for Students</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Balanced macronutrients: 50-65% carbs, 20-35% fat, 15-25% protein</p>
            <p>• Adequate fiber for digestive health (5-10g per meal)</p>
            <p>• Meet 1/3 of daily nutritional needs per meal</p>
            <p>• Consider age-appropriate portion sizes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
