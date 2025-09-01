'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFieldArray } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Trash2, Package, Search, AlertTriangle } from 'lucide-react'
import { RawMaterial } from '../types/menu-edit-types'

interface MenuEditIngredientSelectorProps {
  form: any
  menuItemIndex: number
}

export function MenuEditIngredientSelector({ form, menuItemIndex }: MenuEditIngredientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { control, watch, setValue, register } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: `menuItems.${menuItemIndex}.ingredients`
  })

  // Fetch raw materials from API
  const { data: rawMaterials, isLoading } = useQuery<RawMaterial[]>({
    queryKey: ['raw-materials', searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      params.append('limit', '100')
      
      const response = await fetch(`/api/raw-materials?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch raw materials')
      }
      const data = await response.json()
      return data.data || []
    },
  })

  const addIngredient = () => {
    append({
      rawMaterialId: '',
      quantity: 0
    })
  }

  const selectedRawMaterial = (ingredientIndex: number) => {
    const rawMaterialId = watch(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.rawMaterialId`)
    return rawMaterials?.find(rm => rm.id === rawMaterialId)
  }

  if (isLoading) {
    return (
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-primary" />
            <span>Ingredients</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-foreground">Ingredients</span>
            <Badge variant="secondary">{fields.length}</Badge>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIngredient}
            className="flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Search Raw Materials */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Search Raw Materials
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search raw materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No ingredients added yet</p>
            <Button
              type="button"
              variant="outline"
              onClick={addIngredient}
              className="mt-2"
            >
              Add First Ingredient
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Changes to ingredients will update cost calculations. Removed ingredients will be permanently deleted.
              </AlertDescription>
            </Alert>

            {fields.map((field, ingredientIndex) => {
              const material = selectedRawMaterial(ingredientIndex)
              const isExisting = !!(field as any).id // Check if this is an existing ingredient
              
              return (
                <div key={field.id} className="p-4 border border-border rounded-lg bg-muted/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">Ingredient {ingredientIndex + 1}</h4>
                      {isExisting && (
                        <Badge variant="outline" className="text-xs">
                          Existing
                        </Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(ingredientIndex)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Hidden ID field for existing ingredients */}
                  {isExisting && (
                    <input
                      type="hidden"
                      {...register(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.id`)}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Raw Material *
                      </Label>
                      <Select
                        value={watch(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.rawMaterialId`)}
                        onValueChange={(value) => 
                          setValue(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.rawMaterialId`, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select raw material" />
                        </SelectTrigger>
                        <SelectContent>
                          {rawMaterials?.map((material) => (
                            <SelectItem key={material.id} value={material.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{material.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {material.category}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Quantity ({material?.unit || 'unit'}) *
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        {...register(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.quantity`, { valueAsNumber: true })}
                        placeholder="Enter quantity"
                      />
                    </div>
                  </div>

                  {material && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <p><strong>Supplier:</strong> {material.supplier?.name || 'Not specified'}</p>
                          <p><strong>Cost per {material.unit}:</strong> Rp {material.costPerUnit?.toLocaleString() || 'N/A'}</p>
                        </div>
                        {material.costPerUnit && watch(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.quantity`) && (
                          <div className="mt-2 pt-2 border-t border-muted">
                            <p><strong>Total Cost:</strong> Rp {(material.costPerUnit * watch(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.quantity`)).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
