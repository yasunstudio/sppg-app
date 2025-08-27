'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { MEAL_TYPES, getMealTypeLabel } from '@/lib/constants/meal-types'

const menuSchema = z.object({
  name: z.string().min(1, 'Nama menu diperlukan'),
  description: z.string().optional(),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const),
  menuDate: z.string().min(1, 'Tanggal menu diperlukan'),
  menuItems: z.array(z.object({
    name: z.string().min(1, 'Nama item menu diperlukan'),
    category: z.enum(['MAIN_DISH', 'SIDE_DISH', 'DRINK', 'DESSERT']),
    servingSize: z.number().min(1, 'Ukuran porsi minimal 1'),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      rawMaterialId: z.string(),
      quantity: z.number().min(0.1, 'Quantity minimal 0.1'),
      unit: z.string()
    }))
  })).min(1, 'Minimal 1 item menu diperlukan')
})

type MenuFormData = z.infer<typeof menuSchema>

interface MenuFormProps {
  onSuccess: () => void
  menu?: any
}

export function MenuForm({ onSuccess, menu }: MenuFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: menu?.name || '',
      description: menu?.description || '',
      mealType: menu?.mealType || 'LUNCH',
      menuDate: menu?.menuDate || new Date().toISOString().split('T')[0],
      menuItems: menu?.menuItems || [
        {
          name: '',
          category: 'MAIN_DISH',
          servingSize: 1,
          description: '',
          ingredients: [
            {
              rawMaterialId: '',
              quantity: 0,
              unit: 'gram'
            }
          ]
        }
      ]
    }
  })

  const { fields: menuItemFields, append: appendMenuItem, remove: removeMenuItem } = useFieldArray({
    control: form.control,
    name: 'menuItems'
  })

  const { data: rawMaterials } = useQuery({
    queryKey: ['raw-materials'],
    queryFn: async () => {
      const response = await fetch('/api/raw-materials')
      if (!response.ok) throw new Error('Failed to fetch raw materials')
      return response.json()
    }
  })

  const onSubmit = async (data: MenuFormData) => {
    setIsSubmitting(true)
    try {
      const endpoint = menu ? `/api/menus/${menu.id}` : '/api/menus'
      const method = menu ? 'PUT' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save menu')
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving menu:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addMenuItem = () => {
    appendMenuItem({
      name: '',
      category: 'MAIN_DISH',
      servingSize: 1,
      description: '',
      ingredients: [
        {
          rawMaterialId: '',
          quantity: 0,
          unit: 'gram'
        }
      ]
    })
  }

  const addIngredient = (menuItemIndex: number) => {
    const currentMenuItems = form.getValues('menuItems')
    const menuItem = currentMenuItems[menuItemIndex]
    
    form.setValue(`menuItems.${menuItemIndex}.ingredients`, [
      ...menuItem.ingredients,
      {
        rawMaterialId: '',
        quantity: 0,
        unit: 'gram'
      }
    ])
  }

  const removeIngredient = (menuItemIndex: number, ingredientIndex: number) => {
    const currentMenuItems = form.getValues('menuItems')
    const menuItem = currentMenuItems[menuItemIndex]
    
    form.setValue(
      `menuItems.${menuItemIndex}.ingredients`,
      menuItem.ingredients.filter((_, index) => index !== ingredientIndex)
    )
  }

  return (
    <div className="w-full space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger 
              value="basic" 
              className="h-10 rounded-md font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-50"
            >
              Informasi Dasar
            </TabsTrigger>
            <TabsTrigger 
              value="items"
              className="h-10 rounded-md font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-50"
            >
              Item Menu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nama Menu
                </Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Contoh: Menu Sarapan Sehat"
                  className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Jenis Makanan
                </Label>
                <Select
                  value={form.watch('mealType')}
                  onValueChange={(value) => form.setValue('mealType', value as any)}
                >
                  <SelectTrigger className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400">
                    <SelectValue placeholder="Pilih jenis makanan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                    {Object.entries(MEAL_TYPES).map(([key, value]) => (
                      <SelectItem 
                        key={value} 
                        value={value}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                      >
                        {getMealTypeLabel(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.mealType && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                      {form.formState.errors.mealType.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="menuDate">Tanggal Menu</Label>
                  <Input
                    id="menuDate"
                    type="date"
                    {...form.register('menuDate')}
                  />
                  {form.formState.errors.menuDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.menuDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Deskripsi menu..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Item Menu</h3>
                <Button
                  type="button"
                  onClick={addMenuItem}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Item
                </Button>
              </div>

              {menuItemFields.map((menuItem, menuItemIndex) => (
                <Card key={menuItem.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Item Menu #{menuItemIndex + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeMenuItem(menuItemIndex)}
                        variant="outline"
                        size="sm"
                        disabled={menuItemFields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Nama Item</Label>
                        <Input
                          {...form.register(`menuItems.${menuItemIndex}.name`)}
                          placeholder="Nama item menu"
                        />
                        {form.formState.errors.menuItems?.[menuItemIndex]?.name && (
                          <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.menuItems[menuItemIndex]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Kategori</Label>
                        <Select
                          value={form.watch(`menuItems.${menuItemIndex}.category`)}
                          onValueChange={(value) => 
                            form.setValue(`menuItems.${menuItemIndex}.category`, value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MAIN_DISH">Makanan Utama</SelectItem>
                            <SelectItem value="SIDE_DISH">Lauk</SelectItem>
                            <SelectItem value="DRINK">Minuman</SelectItem>
                            <SelectItem value="DESSERT">Dessert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Ukuran Porsi</Label>
                        <Input
                          type="number"
                          {...form.register(`menuItems.${menuItemIndex}.servingSize`, {
                            valueAsNumber: true
                          })}
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Deskripsi Item</Label>
                      <Textarea
                        {...form.register(`menuItems.${menuItemIndex}.description`)}
                        placeholder="Deskripsi item menu..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Bahan-bahan</Label>
                        <Button
                          type="button"
                          onClick={() => addIngredient(menuItemIndex)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Bahan
                        </Button>
                      </div>

                      {form.watch(`menuItems.${menuItemIndex}.ingredients`)?.map((ingredient, ingredientIndex) => (
                        <div key={ingredientIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                          <div className="md:col-span-2">
                            <Select
                              value={form.watch(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.rawMaterialId`)}
                              onValueChange={(value) => 
                                form.setValue(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.rawMaterialId`, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih bahan" />
                              </SelectTrigger>
                              <SelectContent>
                                {rawMaterials?.data?.map((material: any) => (
                                  <SelectItem key={material.id} value={material.id}>
                                    {material.name} ({material.unit})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Input
                              type="number"
                              step="0.1"
                              {...form.register(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.quantity`, {
                                valueAsNumber: true
                              })}
                              placeholder="Jumlah"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Input
                              {...form.register(`menuItems.${menuItemIndex}.ingredients.${ingredientIndex}.unit`)}
                              placeholder="Unit"
                            />
                            <Button
                              type="button"
                              onClick={() => removeIngredient(menuItemIndex, ingredientIndex)}
                              variant="outline"
                              size="sm"
                              disabled={form.watch(`menuItems.${menuItemIndex}.ingredients`)?.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                menu ? 'Update Menu' : 'Simpan Menu'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
