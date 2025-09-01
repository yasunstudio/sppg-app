"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().optional(),
  category: z.enum(["MAIN_COURSE", "SIDE_DISH", "SNACK", "BEVERAGE", "DESSERT"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  servingSize: z.number().min(1, "Serving size must be at least 1"),
  prepTime: z.number().min(0, "Preparation time cannot be negative"),
  cookTime: z.number().min(0, "Cooking time cannot be negative"),
  instructions: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean(),
  ingredients: z.array(z.object({
    itemId: z.string().min(1, "Please select an ingredient"),
    quantity: z.number().min(0.1, "Quantity must be at least 0.1"),
    unit: z.string().min(1, "Unit is required"),
  })).min(1, "Recipe must have at least 1 ingredient"),
})

type RecipeFormValues = z.infer<typeof recipeSchema>

interface Item {
  id: string
  name: string
  category: string
  unit: string
  unitPrice?: number
}

interface RecipeEditProps {
  recipeId: string
}

const categories = [
  { value: "MAIN_COURSE", label: "Main Course" },
  { value: "SIDE_DISH", label: "Side Dish" },
  { value: "SNACK", label: "Snack" },
  { value: "BEVERAGE", label: "Beverage" },
  { value: "DESSERT", label: "Dessert" },
]

const difficulties = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
]

export function RecipeEdit({ recipeId }: RecipeEditProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState<Item[]>([])

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "MAIN_COURSE",
      difficulty: "EASY",
      servingSize: 1,
      prepTime: 0,
      cookTime: 0,
      instructions: "",
      notes: "",
      isActive: true,
      ingredients: [{ itemId: "", quantity: 1, unit: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  })

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      try {
        // Fetch both items and recipe in parallel
        await Promise.all([
          fetchItems(),
          fetchRecipe()
        ])
      } catch (error) {
        console.error('Error initializing data:', error)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [recipeId, form])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      if (!response.ok) {
        throw new Error('Failed to fetch items')
      }
      const data = await response.json()
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error("Failed to load ingredient list")
    }
  }

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Recipe not found")
          router.push('/dashboard/recipes')
          return
        }
        throw new Error('Failed to fetch recipe')
      }
      
      const recipe = await response.json()
      
      const instructionsString = Array.isArray(recipe.instructions) 
        ? recipe.instructions.join('\n')
        : recipe.instructions || "";
      
      // Map ingredients for form - ensure itemId exists in available items
      const formIngredients = recipe.ingredients.map((ing: any) => ({
        itemId: ing.itemId || '',
        quantity: ing.quantity,
        unit: ing.unit,
      })).filter((ing: any) => ing.itemId) // Remove empty itemIds
      // Set form values
      form.reset({
        name: recipe.name,
        description: recipe.description || "",
        category: recipe.category,
        difficulty: recipe.difficulty,
        servingSize: recipe.servingSize,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        instructions: instructionsString,
        notes: recipe.notes || "",
        isActive: recipe.isActive,
        ingredients: formIngredients,
      })
    } catch (error) {
      console.error('Error fetching recipe:', error)
      toast.error("Failed to load recipe data")
      throw error // Re-throw for Promise.all to catch
    }
  }

  const onSubmit = async (values: RecipeFormValues) => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to update recipe')
      }

      toast.success("Recipe updated successfully")
      router.push(`/dashboard/recipes/${recipeId}`)
    } catch (error) {
      console.error('Error updating recipe:', error)
      toast.error("Failed to update recipe")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="space-y-4">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/recipes/${recipeId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Recipe</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update recipe information
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                General information about the recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter recipe name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Active recipes can be used for production
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Recipe description..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficulties.map((difficulty) => (
                            <SelectItem key={difficulty.value} value={difficulty.value}>
                              {difficulty.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="servingSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serving Size *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          placeholder="Servings"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preparation Time (minutes) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="Minutes"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cookTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cooking Time (minutes) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="Minutes"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>
                List of ingredients required for this recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.itemId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Ingredient</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ingredient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {items.length === 0 ? (
                              <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                                No ingredients available
                              </div>
                            ) : (
                              items.map((material) => (
                                <SelectItem key={material.id} value={material.id}>
                                  {material.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            min="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.unit`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="kg, gr, ml" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ itemId: "", quantity: 1, unit: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </CardContent>
          </Card>

          {/* Instructions & Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cooking Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter each instruction step on a new line:&#10;1. Prepare the ingredients...&#10;2. Heat the oil in a pan...&#10;3. Add the vegetables..."
                        rows={8}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Write each step on a separate line. They will be displayed as numbered steps.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/recipes/${recipeId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
