'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, Edit, AlertCircle, CheckCircle2, History } from 'lucide-react'
import { toast } from 'sonner'
import { MenuEditFormData, menuEditSchema, MenuDetail, MenuUpdateRequest } from '../types/menu-edit-types'
import { MenuEditBasicInfo } from './menu-edit-basic-info'
import { MenuEditNutritionInfo } from './menu-edit-nutrition-info'
import { MenuEditItemsSection } from './menu-edit-items-section'

interface MenuEditFormProps {
  menu: MenuDetail
  menuId: string
}

export function MenuEditForm({ menu, menuId }: MenuEditFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('basic')
  const [hasChanges, setHasChanges] = useState(false)

  const form = useForm({
    resolver: zodResolver(menuEditSchema),
    defaultValues: {
      name: menu.name,
      description: menu.description || '',
      menuDate: menu.menuDate.split('T')[0], // Convert to YYYY-MM-DD format
      mealType: menu.mealType,
      targetGroup: menu.targetGroup,
      totalCalories: menu.totalCalories || undefined,
      totalProtein: menu.totalProtein || undefined,
      totalFat: menu.totalFat || undefined,
      totalCarbs: menu.totalCarbs || undefined,
      totalFiber: menu.totalFiber || undefined,
      isActive: menu.isActive,
      menuItems: menu.menuItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        servingSize: item.servingSize,
        description: item.description || '',
        ingredients: item.ingredients.map(ing => ({
          id: ing.id,
          rawMaterialId: ing.rawMaterialId,
          quantity: ing.quantity
        }))
      }))
    }
  })

  const { handleSubmit, formState: { errors, isSubmitting, isDirty }, watch, reset } = form

  // Watch for changes
  useEffect(() => {
    setHasChanges(isDirty)
  }, [isDirty])

  // Update menu mutation
  const updateMenuMutation = useMutation({
    mutationFn: async (data: MenuUpdateRequest) => {
      const response = await fetch(`/api/menu-planning/${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update menu')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Menu updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['menu-planning'] })
      queryClient.invalidateQueries({ queryKey: ['menu-planning-stats'] })
      queryClient.invalidateQueries({ queryKey: ['menu-detail', menuId] })
      setHasChanges(false)
      // Don't navigate away, stay on edit page
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update menu')
    }
  })

  const onSubmit = (data: any) => {
    const submitData: MenuUpdateRequest = {
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

    updateMenuMutation.mutate(submitData)
  }

  const handleReset = () => {
    reset()
    setHasChanges(false)
    toast.info('Form reset to original values')
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
          <Edit className="w-5 h-5 text-primary" />
          <span className="text-foreground">Edit Menu Form</span>
          {hasChanges && (
            <span className="text-xs text-muted-foreground bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
              Unsaved changes
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Update the menu information with nutritional details and recipes according to SPPG standards
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
              <MenuEditBasicInfo form={form} />
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <MenuEditNutritionInfo form={form} />
            </TabsContent>

            <TabsContent value="items" className="mt-6">
              <MenuEditItemsSection form={form} />
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

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="text-sm text-muted-foreground">
                {isFormValid() ? (
                  <span className="text-green-600">✓ Ready to save changes</span>
                ) : (
                  <span>Please complete required fields</span>
                )}
              </div>
              {hasChanges && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center space-x-1 text-muted-foreground"
                >
                  <History className="w-3 h-3" />
                  <span>Reset</span>
                </Button>
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
                disabled={!isFormValid() || isSubmitting || !hasChanges}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
