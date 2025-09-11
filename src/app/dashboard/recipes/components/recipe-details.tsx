"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { usePermissions } from "@/hooks/use-permissions"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ChefHat, 
  Clock, 
  Users, 
  DollarSign,
  Star,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Utensils,
  Timer,
  Heart
} from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatCurrency } from "@/lib/utils"

interface RecipeIngredient {
  id: string
  quantity: number
  unit: string
  item: {
    id: string
    name: string
    unit: string
    unitPrice: number
  }
}

interface Recipe {
  id: string
  name: string
  description?: string | null
  category: "MAIN_COURSE" | "SIDE_DISH" | "SNACK" | "BEVERAGE" | "DESSERT"
  difficulty: "EASY" | "MEDIUM" | "HARD"
  servingSize: number
  prepTime: number
  cookTime: number
  instructions?: string[] | string | null
  notes?: string | null
  allergenInfo?: string[]
  nutritionInfo?: any | null
  cost?: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  ingredients: RecipeIngredient[]
  totalCost: number
}

interface RecipeDetailsProps {
  recipeId: string
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "MAIN_COURSE":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
    case "SIDE_DISH":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
    case "SNACK":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700"
    case "BEVERAGE":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700"
    case "DESSERT":
      return "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-700"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700"
    case "HARD":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
  }
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "MAIN_COURSE":
      return "Main Course"
    case "SIDE_DISH":
      return "Side Dish"
    case "SNACK":
      return "Snack"
    case "BEVERAGE":
      return "Beverage"
    case "DESSERT":
      return "Dessert"
    default:
      return category
  }
}

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "Easy"
    case "MEDIUM":
      return "Medium"
    case "HARD":
      return "Hard"
    default:
      return difficulty
  }
}

export function RecipeDetails({ recipeId }: RecipeDetailsProps) {
  const router = useRouter()
  
  // Permission checks
  // Temporary disable permission check until export issue fixed
  const canEdit = { hasAccess: true, loading: false, error: null }
  const canDelete = { hasAccess: true, loading: false, error: null }
  
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchRecipe()
  }, [recipeId])

  const fetchRecipe = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/recipes/${recipeId}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Recipe tidak ditemukan")
          router.push('/dashboard/recipes')
          return
        }
        throw new Error('Failed to fetch recipe')
      }
      const data = await response.json()
      setRecipe(data)
    } catch (error) {
      console.error('Error fetching recipe:', error)
      toast.error("Failed to load recipe data")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete recipe')
      }

      toast.success("Recipe deleted successfully")
      router.push('/dashboard/recipes')
    } catch (error) {
      console.error('Error deleting recipe:', error)
      toast.error("Failed to delete recipe")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Recipe not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The recipe you are looking for is not available.</p>
        <div className="mt-6">
          <Button onClick={() => router.push('/dashboard/recipes')}>
            Back to Recipe List
          </Button>
        </div>
      </div>
    )
  }

  const costPerServing = recipe.totalCost / recipe.servingSize

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/recipes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{recipe.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Created {new Date(recipe.createdAt).toLocaleDateString('en-US')}</span>
              <span>•</span>
              <span>Last updated {new Date(recipe.updatedAt).toLocaleDateString('en-US')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/recipes/${recipeId}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={deleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete recipe "{recipe.name}"? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Status and Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${recipe.isActive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                {recipe.isActive ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Status</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {recipe.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Servings</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{recipe.servingSize} servings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <Timer className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Time</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{recipe.prepTime + recipe.cookTime} minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Cost Per Serving</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(costPerServing)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recipe Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                {recipe.description || "No description available"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <div className="mt-1">
                  <Badge className={getCategoryColor(recipe.category)}>
                    {getCategoryLabel(recipe.category)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty Level</label>
                <div className="mt-1">
                  <Badge className={getDifficultyColor(recipe.difficulty)}>
                    {getDifficultyLabel(recipe.difficulty)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preparation Time</label>
                <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4" />
                  {recipe.prepTime} minutes
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cooking Time</label>
                <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1 mt-1">
                  <ChefHat className="h-4 w-4" />
                  {recipe.cookTime} minutes
                </p>
              </div>
            </div>

            {recipe.allergenInfo && recipe.allergenInfo.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Allergen Information</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recipe.allergenInfo.map((allergen, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {recipe.cost && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Manual Cost Override</label>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1 font-medium">
                  {formatCurrency(recipe.cost)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Ingredients ({recipe.ingredients.length})
            </CardTitle>
            <CardDescription>
              Total cost: {formatCurrency(recipe.totalCost)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{ingredient.item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {ingredient.quantity} {ingredient.unit} × {formatCurrency(getUnitPricePerSmallUnit(ingredient))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculateIngredientCost(ingredient))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      {recipe.instructions && (
        <Card>
          <CardHeader>
            <CardTitle>Cooking Instructions</CardTitle>
            <CardDescription>
              Follow these step-by-step instructions for best results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(recipe.instructions) ? (
                recipe.instructions.map((step, index) => (
                  <div key={index} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-sans bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    {recipe.instructions}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Information */}
      {recipe.nutritionInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Nutrition Information
            </CardTitle>
            <CardDescription>
              Per serving nutritional values
            </CardDescription>
          </CardHeader>
          <CardContent>
            {typeof recipe.nutritionInfo === 'object' && recipe.nutritionInfo !== null ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(recipe.nutritionInfo as Record<string, any>).map(([key, value]) => (
                  <div key={key} className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                      {typeof value === 'number' ? value.toFixed(1) : value}
                      {key.toLowerCase().includes('calorie') ? ' kcal' : 
                       key.toLowerCase().includes('protein') || 
                       key.toLowerCase().includes('carb') || 
                       key.toLowerCase().includes('fat') ? ' g' : ''}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <pre className="whitespace-pre-wrap font-sans bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  {JSON.stringify(recipe.nutritionInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper function to calculate ingredient cost with unit conversion
const calculateIngredientCost = (ingredient: any) => {
  const unitPrice = ingredient.item?.unitPrice || 0;
  const quantity = ingredient.quantity;
  const unit = ingredient.unit.toLowerCase();
  const itemUnit = ingredient.item?.unit?.toLowerCase() || 'kg';

  // Convert quantity to match inventory unit pricing
  let convertedQuantity = quantity;

  // Handle unit conversions
  if (itemUnit === 'kg' && (unit === 'gram' || unit === 'g')) {
    convertedQuantity = quantity / 1000; // grams to kg
  } else if (itemUnit === 'liter' && (unit === 'ml' || unit === 'milliliter')) {
    convertedQuantity = quantity / 1000; // ml to liter
  } else if (itemUnit === unit) {
    convertedQuantity = quantity; // same unit
  }

  return unitPrice * convertedQuantity;
}

// Helper function to get unit price per small unit for display
const getUnitPricePerSmallUnit = (ingredient: any) => {
  const unitPrice = ingredient.item?.unitPrice || 0;
  const unit = ingredient.unit.toLowerCase();
  const itemUnit = ingredient.item?.unit?.toLowerCase() || 'kg';

  // Convert unit price to small unit for display
  if (itemUnit === 'kg' && (unit === 'gram' || unit === 'g')) {
    return unitPrice / 1000; // price per gram
  } else if (itemUnit === 'liter' && (unit === 'ml' || unit === 'milliliter')) {
    return unitPrice / 1000; // price per ml
  }

  return unitPrice; // same unit
}
