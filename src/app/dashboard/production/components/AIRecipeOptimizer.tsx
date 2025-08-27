'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Heart, 
  ChefHat,
  Zap,
  Target,
  CheckCircle,
  Loader2,
  ArrowRight
} from 'lucide-react'

// Fetch available recipes
async function fetchRecipes() {
  const response = await fetch('/api/ai/recipe-optimizer/recipes')
  if (!response.ok) {
    throw new Error('Failed to fetch recipes')
  }
  const data = await response.json()
  return data.success ? data.data : []
}

interface AIRecipeOptimizerProps {
  onSuccess: () => void
  recipeId?: string
}

interface OptimizationResult {
  originalRecipe: any
  optimizedVersions: any[]
  recommendations: any[]
  nutritionalComparison: any
  costComparison: any
  summary: any
}

export function AIRecipeOptimizer({ onSuccess, recipeId }: AIRecipeOptimizerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch available recipes
  const { data: recipes = [], isLoading: recipesLoading, error: recipesError } = useQuery({
    queryKey: ['ai-recipes'],
    queryFn: fetchRecipes,
    retry: 1
  })

  // Fallback recipes if API fails
  const fallbackRecipes = [
    { id: 'recipe-1', name: 'Nasi Ayam Wortel', category: 'MAIN_COURSE' },
    { id: 'recipe-2', name: 'Nasi Ikan Bumbu Kuning', category: 'MAIN_COURSE' },
    { id: 'recipe-3', name: 'Nasi Daging Sayur Bayam', category: 'MAIN_COURSE' },
    { id: 'recipe-4', name: 'Nasi Tempe Sayur Kangkung', category: 'MAIN_COURSE' },
    { id: 'recipe-5', name: 'Nasi Tahu Sayur Kol', category: 'MAIN_COURSE' },
    { id: 'recipe-6', name: 'Nasi Telur Dadar Kentang', category: 'MAIN_COURSE' }
  ]

  const availableRecipes = recipes.length > 0 ? recipes : fallbackRecipes
  const [formData, setFormData] = useState({
    recipeId: recipeId || 'recipe-1', // Use default recipe for demo
    optimizationGoals: ['nutrition', 'cost'],
    targetNutrition: {
      protein: 25,
      calories: 400,
      fiber: 8,
      fat: 15
    },
    constraints: {
      maxCost: 100000,
      maxPrepTime: 60,
      difficultyLevel: 'medium',
      availableIngredients: true
    },
    preferences: {
      localIngredients: true,
      seasonalFocus: true,
      costEfficiency: 0.7,
      nutritionPriority: 0.8
    }
  })

  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([])

  // Get current selected recipe name for display
  const selectedRecipe = availableRecipes.find((recipe: any) => recipe.id === formData.recipeId)

  const optimizeRecipe = async () => {
    if (!formData.recipeId) {
      setError('Please select a recipe to optimize')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/ai/recipe-optimizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: formData.recipeId,
          optimizationGoals: formData.optimizationGoals,
          targetNutrition: formData.targetNutrition,
          constraints: formData.constraints,
          preferences: formData.preferences
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to optimize recipe')
      }
      
      if (result.success) {
        setOptimizationResult(result.data)
        console.log("✅ Recipe optimization completed successfully")
      } else {
        throw new Error(result.error || 'Failed to optimize recipe')
      }
    } catch (error) {
      console.error('Recipe Optimization Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to optimize recipe')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getOptimizationScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (optimizationResult) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Recipe Optimization Complete!</h3>
          <p className="text-muted-foreground">
            Generated {optimizationResult.optimizedVersions.length} optimized versions with {optimizationResult.recommendations.length} recommendations
          </p>
        </div>

        <Tabs defaultValue="versions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="versions">Optimized Versions</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="versions" className="space-y-4">
            <div className="grid gap-4">
              {optimizationResult.optimizedVersions.map((version, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <Target className="w-5 h-5 mr-2 text-blue-500" />
                          {version.type?.charAt(0).toUpperCase() + version.type?.slice(1)} Optimized
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {Math.round((version.confidenceScore || 0) * 100)}%
                        </p>
                      </div>
                      <Badge className={getOptimizationScoreColor(version.confidenceScore || 0)}>
                        Score: {Math.round((version.confidenceScore || 0) * 100)}/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Nutritional Improvements */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Nutritional Profile</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground">Calories</div>
                            <div className="font-medium">{Math.round(version.nutrition?.calories || 0)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Protein</div>
                            <div className="font-medium">{Math.round(version.nutrition?.protein || 0)}g</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Fiber</div>
                            <div className="font-medium">{Math.round(version.nutrition?.fiber || 0)}g</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Cost</div>
                            <div className="font-medium">{formatCurrency(version.estimatedCost || 0)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Key Improvements */}
                      {version.improvements && version.improvements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Key Improvements</h4>
                          <div className="space-y-1">
                            {version.improvements.slice(0, 3).map((improvement: string, i: number) => (
                              <div key={i} className="flex items-center text-sm text-muted-foreground">
                                <ArrowRight className="w-3 h-3 mr-2 text-green-500" />
                                {improvement}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ingredient Changes */}
                      {version.ingredientChanges && version.ingredientChanges.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Ingredient Substitutions</h4>
                          <div className="space-y-1">
                            {version.ingredientChanges.slice(0, 2).map((change: any, i: number) => (
                              <div key={i} className="text-xs bg-gray-50 p-2 rounded">
                                <span className="line-through text-red-600">{change.original}</span>
                                <ArrowRight className="inline w-3 h-3 mx-1" />
                                <span className="text-green-600">{change.replacement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Original vs Optimized Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Nutritional Comparison */}
                  <div>
                    <h4 className="font-medium mb-3">Nutritional Improvements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Protein Content</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {Math.round(optimizationResult.nutritionalComparison.original.protein)}g
                            </span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="text-sm font-medium text-green-600">
                              {Math.round(optimizationResult.nutritionalComparison.optimized.protein)}g
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={optimizationResult.nutritionalComparison.improvements.protein * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Fiber Content</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {Math.round(optimizationResult.nutritionalComparison.original.fiber)}g
                            </span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="text-sm font-medium text-green-600">
                              {Math.round(optimizationResult.nutritionalComparison.optimized.fiber)}g
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={optimizationResult.nutritionalComparison.improvements.fiber * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cost Comparison */}
                  <div>
                    <h4 className="font-medium mb-3">Cost Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(optimizationResult.costComparison.original)}
                        </div>
                        <div className="text-sm text-muted-foreground">Original Cost</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(optimizationResult.costComparison.optimized)}
                        </div>
                        <div className="text-sm text-muted-foreground">Optimized Cost</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(optimizationResult.costComparison.savingsPercentage)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Cost Savings</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-3">
              {optimizationResult.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100' :
                        rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {rec.type === 'nutrition' ? <Heart className="w-4 h-4" /> : 
                         rec.type === 'cost' ? <DollarSign className="w-4 h-4" /> : 
                         <TrendingUp className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        {rec.actionItems && (
                          <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside">
                            {rec.actionItems.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {rec.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Success Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Overall Improvement</span>
                        <Badge className="text-green-600">
                          +{Math.round(optimizationResult.summary.overallImprovement * 100)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Nutritional Score</span>
                        <Badge className="text-blue-600">
                          {Math.round(optimizationResult.summary.nutritionalScore * 100)}/100
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cost Efficiency</span>
                        <Badge className="text-purple-600">
                          {Math.round(optimizationResult.summary.costEfficiency * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Implementation Impact</h4>
                    <div className="space-y-2 text-sm">
                      <div>💰 Monthly Savings: {formatCurrency(optimizationResult.summary.estimatedMonthlySavings)}</div>
                      <div>🏥 Health Score: +{Math.round(optimizationResult.summary.healthScoreImprovement)}%</div>
                      <div>⏱️ Prep Time: {optimizationResult.summary.prepTimeChange > 0 ? '+' : ''}{optimizationResult.summary.prepTimeChange} min</div>
                      <div>📊 Implementation Difficulty: {optimizationResult.summary.implementationDifficulty}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOptimizationResult(null)}>
            Optimize Another Recipe
          </Button>
          <Button onClick={onSuccess}>
            Apply Optimizations
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4">
          <ChefHat className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">AI Recipe Optimizer</h3>
        <p className="text-muted-foreground">
          Optimize recipes for better nutrition, lower costs, and improved efficiency
        </p>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recipe & Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recipeId">Select Recipe</Label>
              <Select 
                value={formData.recipeId} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  recipeId: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue>
                    {selectedRecipe 
                      ? `${selectedRecipe.name} - ${selectedRecipe.category}`
                      : (recipesLoading ? "Loading recipes..." : "Select a recipe to optimize")
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableRecipes.map((recipe: any) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name} - {recipe.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {availableRecipes.length} recipes available
              </p>
            </div>
            
            <div>
              <Label>Optimization Goals</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['nutrition', 'cost', 'efficiency', 'sustainability'].map((goal) => (
                  <Badge 
                    key={goal}
                    variant={formData.optimizationGoals.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const goals = formData.optimizationGoals.includes(goal)
                        ? formData.optimizationGoals.filter(g => g !== goal)
                        : [...formData.optimizationGoals, goal]
                      setFormData(prev => ({ ...prev, optimizationGoals: goals }))
                    }}
                  >
                    {goal.charAt(0).toUpperCase() + goal.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="maxCost">Maximum Cost (IDR)</Label>
              <Input
                id="maxCost"
                type="number"
                value={formData.constraints.maxCost}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  constraints: {
                    ...prev.constraints,
                    maxCost: parseInt(e.target.value) || 100000
                  }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Target Nutrition */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Target Nutrition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetProtein">Target Protein (g)</Label>
              <Input
                id="targetProtein"
                type="number"
                value={formData.targetNutrition.protein}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  targetNutrition: {
                    ...prev.targetNutrition,
                    protein: parseInt(e.target.value) || 25
                  }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="targetCalories">Target Calories</Label>
              <Input
                id="targetCalories"
                type="number"
                value={formData.targetNutrition.calories}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  targetNutrition: {
                    ...prev.targetNutrition,
                    calories: parseInt(e.target.value) || 400
                  }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="targetFiber">Target Fiber (g)</Label>
              <Input
                id="targetFiber"
                type="number"
                value={formData.targetNutrition.fiber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  targetNutrition: {
                    ...prev.targetNutrition,
                    fiber: parseInt(e.target.value) || 8
                  }
                }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Optimization Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costPriority">Cost Efficiency Priority</Label>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-sm">Low</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.preferences.costEfficiency}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      costEfficiency: parseFloat(e.target.value)
                    }
                  }))}
                  className="flex-1"
                />
                <span className="text-sm">High</span>
              </div>
            </div>
            <div>
              <Label htmlFor="nutritionPriority">Nutrition Priority</Label>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-sm">Low</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.preferences.nutritionPriority}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      nutritionPriority: parseFloat(e.target.value)
                    }
                  }))}
                  className="flex-1"
                />
                <span className="text-sm">High</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="text-red-800 text-sm">
              ❌ {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimize Button */}
      <div className="flex justify-center">
        <Button
          onClick={optimizeRecipe}
          disabled={isLoading || !formData.recipeId}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Optimizing Recipe...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Optimize Recipe with AI
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
