'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Plus, Trash2, Save, Calendar, ChefHat, Package } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Schema validation
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
      quantity: z.number().min(0.1, 'Kuantitas minimal 0.1'),
      unit: z.string()
    }))
  }))
})

type MenuFormData = z.infer<typeof menuSchema>

const MEAL_TYPES = [
  { value: 'BREAKFAST', label: 'Sarapan', icon: '🌅' },
  { value: 'LUNCH', label: 'Makan Siang', icon: '☀️' },
  { value: 'DINNER', label: 'Makan Malam', icon: '🌙' },
  { value: 'SNACK', label: 'Camilan', icon: '🍪' }
] as const

const ITEM_CATEGORIES = [
  { value: 'MAIN_DISH', label: 'Makanan Utama', icon: '🍽️' },
  { value: 'SIDE_DISH', label: 'Lauk Pauk', icon: '🥗' },
  { value: 'DRINK', label: 'Minuman', icon: '🥤' },
  { value: 'DESSERT', label: 'Dessert', icon: '🍰' }
] as const

const UNITS = ['gram', 'kg', 'ml', 'liter', 'pcs', 'sendok', 'gelas', 'mangkok']

export function MenuForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      menuItems: []
    }
  })

  const { fields: menuItemFields, append: appendMenuItem, remove: removeMenuItem } = useFieldArray({
    control,
    name: 'menuItems'
  })

  // Fetch raw materials
  const { data: rawMaterials = [], isLoading: isLoadingMaterials } = useQuery({
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
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('Failed to create menu')
      
      // Handle success (redirect, show toast, etc.)
      console.log('Menu created successfully')
    } catch (error) {
      console.error('Error creating menu:', error)
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
      ingredients: []
    })
  }

  const addIngredient = (menuItemIndex: number) => {
    const currentMenuItems = watch('menuItems')
    const updatedMenuItems = [...currentMenuItems]
    
    if (!updatedMenuItems[menuItemIndex].ingredients) {
      updatedMenuItems[menuItemIndex].ingredients = []
    }
    
    updatedMenuItems[menuItemIndex].ingredients.push({
      rawMaterialId: '',
      quantity: 1,
      unit: 'gram'
    })
    
    setValue('menuItems', updatedMenuItems)
  }

  const removeIngredient = (menuItemIndex: number, ingredientIndex: number) => {
    const currentMenuItems = watch('menuItems')
    const updatedMenuItems = [...currentMenuItems]
    updatedMenuItems[menuItemIndex].ingredients.splice(ingredientIndex, 1)
    setValue('menuItems', updatedMenuItems)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                                <CardTitle className="text-2xl text-foreground">
                  Formulir Menu
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Lengkapi detail menu dengan informasi nutrisi yang akurat
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Basic Information */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Calendar className="h-5 w-5 text-blue-500" />
              Informasi Dasar Menu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nama Menu *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Contoh: Menu Sehat Hari Senin"
                  className="h-11 bg-background border-border focus:border-blue-500 dark:focus:border-blue-400"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="menuDate" className="text-sm font-medium text-foreground">
                  Tanggal Menu *
                </Label>
                <Input
                  id="menuDate"
                  type="date"
                  {...register('menuDate')}
                  className="h-11 bg-background border-border focus:border-blue-500 dark:focus:border-blue-400"
                />
                {errors.menuDate && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.menuDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="mealType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Jenis Waktu Makan *
              </Label>
              <Select onValueChange={(value) => setValue('mealType', value as any)}>
                <SelectTrigger className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Pilih waktu makan" />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mealType && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.mealType.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Deskripsi Menu
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Jelaskan tentang menu ini, kandungan gizi, atau informasi khusus lainnya..."
                rows={4}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <Package className="h-5 w-5 text-green-500" />
                Item Menu ({menuItemFields.length})
              </CardTitle>
              <Button
                type="button"
                onClick={addMenuItem}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {menuItemFields.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Belum ada item menu
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Mulai dengan menambahkan item menu pertama Anda
                </p>
                <Button
                  type="button"
                  onClick={addMenuItem}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Item Menu
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {menuItemFields.map((field, index) => (
                  <MenuItemCard
                    key={field.id}
                    index={index}
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    removeMenuItem={removeMenuItem}
                    addIngredient={addIngredient}
                    removeIngredient={removeIngredient}
                    rawMaterials={rawMaterials}
                    isLoadingMaterials={isLoadingMaterials}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="button"
            variant="outline"
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || menuItemFields.length === 0}
            className="px-8 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Menu
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

// Menu Item Card Component
function MenuItemCard({
  index,
  register,
  errors,
  watch,
  setValue,
  removeMenuItem,
  addIngredient,
  removeIngredient,
  rawMaterials,
  isLoadingMaterials
}: any) {
  const menuItem = watch(`menuItems.${index}`)
  const ingredients = menuItem?.ingredients || []

  return (
    <Card className="border-l-4 border-l-blue-500 bg-gray-50/50 dark:bg-gray-900/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            Item Menu #{index + 1}
          </h4>
          <Button
            type="button"
            onClick={() => removeMenuItem(index)}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Item *
            </Label>
            <Input
              {...register(`menuItems.${index}.name`)}
              placeholder="Contoh: Nasi Gudeg"
              className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
            {errors.menuItems?.[index]?.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.menuItems[index].name.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Kategori *
            </Label>
            <Select
              onValueChange={(value) => setValue(`menuItems.${index}.category`, value)}
              defaultValue={menuItem?.category}
            >
              <SelectTrigger className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {ITEM_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ukuran Porsi *
            </Label>
            <Input
              type="number"
              {...register(`menuItems.${index}.servingSize`, { valueAsNumber: true })}
              placeholder="1"
              min="1"
              className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Deskripsi
            </Label>
            <Input
              {...register(`menuItems.${index}.description`)}
              placeholder="Deskripsi singkat..."
              className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bahan Baku ({ingredients.length})
            </Label>
            <Button
              type="button"
              onClick={() => addIngredient(index)}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950"
              disabled={isLoadingMaterials}
            >
              <Plus className="h-3 w-3 mr-1" />
              Tambah Bahan
            </Button>
          </div>

          {ingredients.length > 0 && (
            <div className="space-y-3 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              {ingredients.map((_: any, ingredientIndex: number) => (
                <div key={ingredientIndex} className="flex items-center gap-3">
                  <Select
                    onValueChange={(value) =>
                      setValue(`menuItems.${index}.ingredients.${ingredientIndex}.rawMaterialId`, value)
                    }
                    disabled={isLoadingMaterials}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Pilih bahan baku" />
                    </SelectTrigger>
                    <SelectContent>
                      {rawMaterials.map((material: any) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    {...register(`menuItems.${index}.ingredients.${ingredientIndex}.quantity`, {
                      valueAsNumber: true
                    })}
                    placeholder="Qty"
                    className="w-24"
                    step="0.1"
                    min="0.1"
                  />

                  <Select
                    onValueChange={(value) =>
                      setValue(`menuItems.${index}.ingredients.${ingredientIndex}.unit`, value)
                    }
                    defaultValue="gram"
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    onClick={() => removeIngredient(index, ingredientIndex)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
