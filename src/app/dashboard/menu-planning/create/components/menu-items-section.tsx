'use client'

import { useFieldArray } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Package } from 'lucide-react'
import { MenuIngredientSelector } from './menu-ingredient-selector'

interface MenuItemsSectionProps {
  form: any
}

const ITEM_CATEGORIES = [
  { value: 'RICE', label: 'Rice', icon: '🍚', description: 'Rice and grain-based items' },
  { value: 'MAIN_DISH', label: 'Main Dish', icon: '🍽️', description: 'Primary protein dishes' },
  { value: 'VEGETABLE', label: 'Vegetable', icon: '🥗', description: 'Vegetable dishes and salads' },
  { value: 'FRUIT', label: 'Fruit', icon: '🍎', description: 'Fresh fruits and fruit dishes' },
  { value: 'BEVERAGE', label: 'Beverage', icon: '🥤', description: 'Drinks and beverages' },
  { value: 'SNACK', label: 'Snack', icon: '🍪', description: 'Snacks and light bites' }
] as const

export function MenuItemsSection({ form }: MenuItemsSectionProps) {
  const { control, register, formState: { errors }, watch, setValue } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'menuItems'
  })

  const addMenuItem = () => {
    append({
      name: '',
      category: 'MAIN_DISH',
      servingSize: 1,
      description: '',
      ingredients: []
    })
  }

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-foreground">Menu Items</span>
            <Badge variant="secondary">{fields.length}</Badge>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addMenuItem}
            className="flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {fields.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No menu items yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding menu items to build your complete menu
            </p>
            <Button onClick={addMenuItem} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add First Menu Item</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((field, index) => {
              const category = ITEM_CATEGORIES.find(cat => cat.value === watch(`menuItems.${index}.category`))
              
              return (
                <Card key={field.id} className="border border-muted bg-muted/10">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <span className="text-lg">{category?.icon || '🍽️'}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Menu Item {index + 1}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category?.description || 'Menu item description'}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="basic" className="space-y-4 mt-4">
                        {/* Item Name */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">
                            Item Name *
                          </Label>
                          <Input
                            {...register(`menuItems.${index}.name`)}
                            placeholder="Enter menu item name"
                            className="w-full"
                          />
                          {errors.menuItems?.[index]?.name && (
                            <p className="text-sm text-destructive">
                              {errors.menuItems[index]?.name?.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Category */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                              Category *
                            </Label>
                            <Select
                              value={watch(`menuItems.${index}.category`)}
                              onValueChange={(value) => setValue(`menuItems.${index}.category`, value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {ITEM_CATEGORIES.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    <div className="flex items-center space-x-2">
                                      <span>{category.icon}</span>
                                      <span>{category.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.menuItems?.[index]?.category && (
                              <p className="text-sm text-destructive">
                                {errors.menuItems[index]?.category?.message}
                              </p>
                            )}
                          </div>

                          {/* Serving Size */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                              Serving Size (grams) *
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              {...register(`menuItems.${index}.servingSize`, { valueAsNumber: true })}
                              placeholder="Enter serving size"
                              className="w-full"
                            />
                            {errors.menuItems?.[index]?.servingSize && (
                              <p className="text-sm text-destructive">
                                {errors.menuItems[index]?.servingSize?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">
                            Description
                          </Label>
                          <Textarea
                            {...register(`menuItems.${index}.description`)}
                            placeholder="Describe this menu item"
                            className="w-full min-h-[80px]"
                          />
                          {errors.menuItems?.[index]?.description && (
                            <p className="text-sm text-destructive">
                              {errors.menuItems[index]?.description?.message}
                            </p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="ingredients" className="mt-4">
                        <MenuIngredientSelector form={form} menuItemIndex={index} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
