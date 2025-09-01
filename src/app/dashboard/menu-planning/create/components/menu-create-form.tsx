'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, ChefHat, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { MenuFormData, menuSchema } from '../types/menu-form-types'
import { MenuBasicInfo } from './menu-basic-info'
import { MenuNutritionInfo } from './menu-nutrition-info'
import { MenuItemsSection } from './menu-items-section'

export function MenuCreateForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('basic')

  const form = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: '',
      description: '',
      menuDate: '',
      mealType: 'LUNCH',
      targetGroup: 'STUDENT',
      isActive: true,
      menuItems: []
    }
  })

  const { handleSubmit, formState: { errors, isSubmitting }, watch } = form

  // Create menu mutation
  const createMenuMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/menu-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create menu')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Menu created successfully!')
      queryClient.invalidateQueries({ queryKey: ['menu-planning'] })
      queryClient.invalidateQueries({ queryKey: ['menu-planning-stats'] })
      router.push('/dashboard/menu-planning/planning?success=menu-created')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create menu')
    }
  })

  const onSubmit = (data: any) => {
    const submitData = {
      name: data.name,
      description: data.description,
      menuDate: data.menuDate,
      mealType: data.mealType,
      targetGroup: data.targetGroup,
      totalCalories: data.totalCalories,
      totalProtein: data.totalProtein,
      totalFat: data.totalFat,
      totalCarbs: data.totalCarbs,
      totalFiber: data.totalFiber,
      isActive: data.isActive,
      menuItems: data.menuItems
    }

    createMenuMutation.mutate(submitData)
  }

  const isFormValid = () => {
    const values = watch()
    return values.name && values.menuDate && values.mealType
  }

  const getTabStatus = (tab: string) => {
    const values = watch()
    switch (tab) {
      case 'basic':
        return values.name && values.menuDate && values.mealType ? 'complete' : 'incomplete'
      case 'nutrition':
        return values.totalCalories ? 'complete' : 'optional'
      case 'items':
        return values.menuItems && values.menuItems.length > 0 ? 'complete' : 'optional'
      default:
        return 'incomplete'
    }
  }

  const TabStatus = ({ status }: { status: string }) => {
    if (status === 'complete') {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />
    } else if (status === 'incomplete') {
      return <AlertCircle className="w-4 h-4 text-destructive" />
    }
    return null
  }

  return (
    <Card className="shadow-xl border border-border bg-card backdrop-blur-sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center space-x-2">
          <ChefHat className="w-5 h-5 text-primary" />
          <span className="text-foreground">New Menu Form</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Complete the menu information with nutritional details and recipes according to SPPG standards
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <span>Basic Info</span>
                <TabStatus status={getTabStatus('basic')} />
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center space-x-2">
                <span>Nutrition</span>
                <TabStatus status={getTabStatus('nutrition')} />
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center space-x-2">
                <span>Menu Items</span>
                <TabStatus status={getTabStatus('items')} />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6">
              <MenuBasicInfo form={form} />
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <MenuNutritionInfo form={form} />
            </TabsContent>

            <TabsContent value="items" className="mt-6">
              <MenuItemsSection form={form} />
            </TabsContent>
          </Tabs>

          {/* Form Errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the following errors:
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([key, error]) => (
                    <li key={key} className="text-sm">
                      {error?.message || `Error in ${key}`}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {isFormValid() ? (
                <span className="text-green-600">✓ Ready to create menu</span>
              ) : (
                <span>Please complete required fields</span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Creating...' : 'Create Menu'}</span>
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
