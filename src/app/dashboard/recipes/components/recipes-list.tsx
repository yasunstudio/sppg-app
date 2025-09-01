"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, ChefHat, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDynamicPermission } from "@/hooks/use-dynamic-permissions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

interface Recipe {
  id: string
  name: string
  description: string | null
  category: string
  difficulty: string
  prepTime: number
  cookTime: number
  servingSize: number
  cost: number | null
  totalCost: number
  costPerServing: number
  isActive: boolean
  createdAt: string
  _count: {
    productionBatches: number
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "MAIN_COURSE":
      return "bg-blue-100 text-blue-800"
    case "SIDE_DISH":
      return "bg-green-100 text-green-800"
    case "SNACK":
      return "bg-yellow-100 text-yellow-800"
    case "BEVERAGE":
      return "bg-purple-100 text-purple-800"
    case "DESSERT":
      return "bg-pink-100 text-pink-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "HARD":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
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

export function RecipesList() {
  const router = useRouter()
  
  // Permission checks
  const canCreate = useDynamicPermission("recipes.create")
  const canEdit = useDynamicPermission("recipes.edit")
  const canDelete = useDynamicPermission("recipes.delete")
  
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [stats, setStats] = useState({
    totalRecipes: 0,
    activeRecipes: 0,
    avgTime: 0,
    avgCost: 0,
  })

  useEffect(() => {
    fetchRecipes()
    fetchStats()
  }, [])

  useEffect(() => {
    filterRecipes()
  }, [recipes, searchTerm, categoryFilter, difficultyFilter, statusFilter])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/recipes?limit=100") // Get all recipes for proper statistics
      if (!response.ok) throw new Error("Failed to fetch recipes")
      
      const data = await response.json()
      // Check if response has pagination structure
      if (data.recipes) {
        setRecipes(data.recipes)
      } else {
        setRecipes(data)
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
      toast.error("Failed to load recipe list")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/recipes/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const filterRecipes = () => {
    let filtered = recipes

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(recipe => recipe.category === categoryFilter)
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(recipe => recipe.difficulty === difficultyFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      filtered = filtered.filter(recipe => recipe.isActive === isActive)
    }

    setFilteredRecipes(filtered)
  }

  const handleDelete = async () => {
    if (!recipeToDelete) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/recipes/${recipeToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete recipe")
      }

      toast.success("Recipe deleted successfully")
      fetchRecipes()
      fetchStats() // Refresh statistics after delete
    } catch (error) {
      console.error("Error deleting recipe:", error)
      toast.error("Failed to delete recipe")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setRecipeToDelete(null)
    }
  }

  const openDeleteDialog = (recipe: Recipe) => {
    setRecipeToDelete(recipe)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recipe Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage recipes for food production</p>
        </div>
        <div className="flex items-center gap-2">
          {canCreate && (
            <Button onClick={() => router.push("/dashboard/recipes/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Recipe
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Recipes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalRecipes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Active Recipes</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeRecipes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Avg. Time</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.avgTime} min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-purple-600 rounded" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Avg. Cost</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.avgCost)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="MAIN_COURSE">Main Course</SelectItem>
                <SelectItem value="SIDE_DISH">Side Dish</SelectItem>
                <SelectItem value="SNACK">Snack</SelectItem>
                <SelectItem value="BEVERAGE">Beverage</SelectItem>
                <SelectItem value="DESSERT">Dessert</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recipes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recipe List ({Array.isArray(filteredRecipes) ? filteredRecipes.length : 0})</CardTitle>
          <CardDescription>
            Manage recipes for food production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipe</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Servings</TableHead>
                <TableHead>Cost/Serving</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(filteredRecipes) && filteredRecipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{recipe.name}</p>
                      {recipe.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {recipe.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(recipe.category)}>
                      {getCategoryLabel(recipe.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {getDifficultyLabel(recipe.difficulty)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recipe.prepTime + recipe.cookTime} min
                    </div>
                  </TableCell>
                  <TableCell>{recipe.servingSize}</TableCell>
                  <TableCell>{formatCurrency(recipe.costPerServing)}</TableCell>
                  <TableCell>
                    <Badge variant={recipe.isActive ? "default" : "secondary"}>
                      {recipe.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {recipe._count.productionBatches} batch
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/recipes/${recipe.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/recipes/${recipe.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(recipe)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(!Array.isArray(filteredRecipes) || filteredRecipes.length === 0) && (
            <div className="text-center py-12">
              <ChefHat className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                No recipes found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || categoryFilter !== "all" || difficultyFilter !== "all" || statusFilter !== "all"
                  ? "No recipes match the current filters"
                  : "Get started by adding a new recipe"
                }
              </p>
              {(!searchTerm && categoryFilter === "all" && difficultyFilter === "all" && statusFilter === "all") && canCreate && (
                <div className="mt-6">
                  <Button onClick={() => router.push("/dashboard/recipes/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recipe
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete recipe "{recipeToDelete?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
