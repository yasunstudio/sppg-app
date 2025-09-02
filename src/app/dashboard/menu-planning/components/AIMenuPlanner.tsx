'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
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
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface AIMenuPlannerProps {
  onSuccess: () => void
}

interface AIResult {
  menuPlans: any[]
  nutritionalAnalysis: any
  costAnalysis: any
  recommendations: any[]
  summary: any
}

export function AIMenuPlanner({ onSuccess }: AIMenuPlannerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [aiResult, setAiResult] = useState<AIResult | null>(null)
  const [formData, setFormData] = useState({
    planningPeriod: 7,
    targetSchools: [] as string[],
    nutritionalGoals: {
      minProtein: 20,
      maxCarbs: 60,
      minFiber: 10,
      maxCalories: 500
    },
    budgetConstraints: {
      maxCostPerMeal: 45000,
      preferLocalIngredients: true
    },
    preferences: {
      spiciness: 'medium',
      complexity: 'simple',
      variety: 'high'
    },
    includeDiversityOptimization: true
  })

  const generateAIMenu = async () => {
    setIsLoading(true)
    try {
      console.log('🚀 Starting AI Menu Generation...')
      console.log('📊 Request data:', {
        plannerId: 'current-user',
        planningPeriod: formData.planningPeriod,
        targetSchools: formData.targetSchools.length > 0 ? formData.targetSchools : ['default'],
        nutritionalGoals: formData.nutritionalGoals,
        budgetConstraints: formData.budgetConstraints,
        preferences: formData.preferences,
        includeDiversityOptimization: formData.includeDiversityOptimization
      })

      const response = await fetch('/api/ai/menu-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plannerId: 'current-user',
          planningPeriod: formData.planningPeriod,
          targetSchools: formData.targetSchools.length > 0 ? formData.targetSchools : ['default'],
          nutritionalGoals: formData.nutritionalGoals,
          budgetConstraints: formData.budgetConstraints,
          preferences: formData.preferences,
          includeDiversityOptimization: formData.includeDiversityOptimization
        })
      })

      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        let errorData: any = {}
        let errorText = ''
        
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json()
          } else {
            errorText = await response.text()
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
        }

        const errorMessage = errorData.details || errorData.error || errorText || `HTTP ${response.status}: ${response.statusText}`
        console.error('❌ AI Menu Planner API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          errorText
        })
        throw new Error(`Failed to generate AI menu plan: ${errorMessage}`)
      }

      let result
      try {
        result = await response.json()
        console.log('✅ JSON response parsed successfully:', result)
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError)
        const responseText = await response.text()
        console.error('Raw response text:', responseText)
        throw new Error('Invalid JSON response from server')
      }
      
      if (result.success) {
        setAiResult(result.data)
        console.log("✅ AI Menu Plan Generated Successfully!", result.data)
      } else {
        throw new Error(result.error || 'Failed to generate menu plan')
      }
    } catch (error) {
      console.error('❌ AI Menu Generation Error:', error)
      
      // Set error state for user feedback
      setAiResult(null)
      
      // You can add a toast notification here or set error state
      alert(`Error generating AI menu plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
  }

  if (aiResult) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">AI Menu Plan Generated Successfully!</h3>
          <div className="space-y-1">
            <p className="text-muted-foreground">
              Created <span className="font-medium text-foreground">{aiResult.summary?.totalMenuPlans || 0} optimized menu plans</span> for{' '}
              <span className="font-medium text-foreground">{aiResult.summary?.totalSchools || 0} schools</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Planning period: {aiResult.summary?.planningPeriod || 7} days • {' '}
              Total meals: {aiResult.summary?.totalMeals?.toLocaleString('id-ID') || 0} • {' '}
              {aiResult.summary?.totalRecipesUsed || 0} unique recipes used
            </p>
            {aiResult.summary?.dateRange && (
              <p className="text-xs text-muted-foreground">
                {aiResult.summary.dateRange.start} - {aiResult.summary.dateRange.end}
              </p>
            )}
          </div>
        </div>

        {/* Key Metrics Summary */}
        <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Plan Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(safeNumber(aiResult.summary?.averageCostPerMeal))}
                </div>
                <div className="text-sm text-muted-foreground">Avg Cost/Meal</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(safeNumber(aiResult.summary?.nutritionalCompliance, 0) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Nutrition Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(safeNumber(aiResult.summary?.diversityScore, 0) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Diversity Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(safeNumber(aiResult.summary?.feasibilityScore, 0) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Feasibility</div>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Preparation Time:</span>{' '}
                  {Math.round(safeNumber(aiResult.summary?.averagePreparationTime, 0))} min avg per meal
                </div>
                <div>
                  <span className="font-medium text-foreground">Recipe Variety:</span>{' '}
                  {aiResult.summary?.totalRecipesUsed || 0} unique recipes across all plans
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="plans" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 dark:bg-muted/50">
            <TabsTrigger value="plans" className="data-[state=active]:bg-background dark:data-[state=active]:bg-background">Menu Plans</TabsTrigger>
            <TabsTrigger value="nutrition" className="data-[state=active]:bg-background dark:data-[state=active]:bg-background">Nutrition</TabsTrigger>
            <TabsTrigger value="cost" className="data-[state=active]:bg-background dark:data-[state=active]:bg-background">Cost Analysis</TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-background dark:data-[state=active]:bg-background">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-4">
            <div className="grid gap-4">
              {aiResult.menuPlans.slice(0, 5).map((plan, index) => (
                <Card key={index} className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-foreground">{plan.schoolName} - Day {plan.day}</CardTitle>
                        <p className="text-sm text-muted-foreground">{plan.plannedMeals} meals planned</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {plan.selectedRecipes?.length || 0} recipes • {formatCurrency(safeNumber(plan.estimatedCost))} total
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{formatCurrency(safeNumber(plan.estimatedCost) / Math.max(plan.plannedMeals || 1, 1))}</div>
                        <div className="text-xs text-muted-foreground">per meal</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Recipe List */}
                      {plan.selectedRecipes && plan.selectedRecipes.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-2 text-foreground">Recipes:</h5>
                          <div className="space-y-1">
                            {plan.selectedRecipes.map((recipe: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{recipe.name}</span>
                                <span className="font-medium text-foreground">{formatCurrency(safeNumber(recipe.estimatedCost))}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Nutrition Info */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground">Calories:</span>
                          <Badge variant={safeNumber(plan.nutritionalProfile?.calories) > 400 ? "default" : "secondary"}>
                            {safeNumber(plan.nutritionalProfile?.calories)} kcal
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground">Protein:</span>
                          <Badge variant="outline">
                            {Math.round(safeNumber(plan.nutritionalProfile?.protein) * 10) / 10}g
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Scores */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground">Diversity:</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={safeNumber(plan.diversityScore, 0) * 100} className="w-16 h-2" />
                            <span className="text-xs text-foreground">{Math.round(safeNumber(plan.diversityScore, 0) * 100)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-foreground">Feasibility:</span>
                          <Badge variant={safeNumber(plan.feasibilityScore, 0) > 0.8 ? "default" : "secondary"}>
                            {Math.round(safeNumber(plan.feasibilityScore, 0) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Show All Plans Button */}
              {aiResult.menuPlans.length > 5 && (
                <Card className="border-dashed border-border bg-card/50 dark:bg-card/50">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {aiResult.menuPlans.length - 5} more menu plans available
                    </p>
                    <Button variant="outline" size="sm">
                      View All {aiResult.menuPlans.length} Plans
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            {/* Overall Nutritional Summary */}
            <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Nutritional Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.round(safeNumber(aiResult.nutritionalAnalysis?.averageCalories))}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Calories</div>
                    <div className="text-xs text-muted-foreground mt-1">per meal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round(safeNumber(aiResult.nutritionalAnalysis?.averageProtein) * 10) / 10}g
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Protein</div>
                    <div className="text-xs text-muted-foreground mt-1">per meal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {Math.round(safeNumber(aiResult.nutritionalAnalysis?.averageCarbs) * 10) / 10}g
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Carbs</div>
                    <div className="text-xs text-muted-foreground mt-1">per meal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {Math.round(safeNumber(aiResult.nutritionalAnalysis?.averageFat) * 10) / 10}g
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Fat</div>
                    <div className="text-xs text-muted-foreground mt-1">per meal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(safeNumber(aiResult.nutritionalAnalysis?.overallCompliance, 0) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Compliance</div>
                    <div className="text-xs text-muted-foreground mt-1">overall score</div>
                  </div>
                </div>

                {/* Compliance Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Nutritional Compliance</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(safeNumber(aiResult.nutritionalAnalysis?.overallCompliance, 0) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={safeNumber(aiResult.nutritionalAnalysis?.overallCompliance, 0) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Compliance Breakdown */}
            {aiResult.nutritionalAnalysis?.complianceByDay && (
              <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Daily Compliance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiResult.nutritionalAnalysis.complianceByDay.slice(0, 7).map((day: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-foreground">{day.schoolName} - Day {day.day}</span>
                            <Badge variant={day.compliance > 0.8 ? "default" : day.compliance > 0.6 ? "secondary" : "destructive"}>
                              {Math.round(day.compliance * 100)}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                            <span>{Math.round(safeNumber(day.nutritionPerMeal?.calories))} kcal</span>
                            <span>{Math.round(safeNumber(day.nutritionPerMeal?.protein) * 10) / 10}g protein</span>
                            <span>{Math.round(safeNumber(day.nutritionPerMeal?.carbohydrates) * 10) / 10}g carbs</span>
                            <span>{Math.round(safeNumber(day.nutritionPerMeal?.fat) * 10) / 10}g fat</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nutritional Trends */}
            {aiResult.nutritionalAnalysis?.nutritionalTrends && (
              <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Nutritional Balance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {aiResult.nutritionalAnalysis.nutritionalTrends.slice(0, 5).map((trend: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                        <div>
                          <span className="font-medium text-sm text-foreground">{trend.schoolName} - Day {trend.day}</span>
                          <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
                            <span>Balance: {Math.round(safeNumber(trend.balanceScore, 0) * 100)}%</span>
                            <span>Compliance: {Math.round(safeNumber(trend.complianceScore, 0) * 100)}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Progress 
                            value={safeNumber(trend.balanceScore, 0) * 100} 
                            className="w-20 h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cost" className="space-y-4">
            {/* Main Cost Metrics */}
            <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Cost Analysis Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(safeNumber(aiResult.costAnalysis?.averageCostPerMeal))}
                    </div>
                    <div className="text-sm text-muted-foreground">Average Cost Per Meal</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Target: {formatCurrency(35000)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(safeNumber(aiResult.costAnalysis?.totalBudgetUsed))}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Budget Used</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {aiResult.summary?.totalMeals || 0} total meals
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(safeNumber(aiResult.costAnalysis?.budgetEfficiency, 0) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Budget Efficiency</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {safeNumber(aiResult.costAnalysis?.budgetEfficiency, 0) > 0.8 ? 'Excellent' : 
                       safeNumber(aiResult.costAnalysis?.budgetEfficiency, 0) > 0.6 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                </div>

                {/* Efficiency Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Cost Efficiency</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(safeNumber(aiResult.costAnalysis?.budgetEfficiency, 0) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={safeNumber(aiResult.costAnalysis?.budgetEfficiency, 0) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown by Day */}
            {aiResult.costAnalysis?.costByDay && (
              <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Daily Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiResult.costAnalysis.costByDay.slice(0, 7).map((day: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-foreground">{day.schoolName} - Day {day.day}</span>
                            <div className="text-right">
                              <div className="font-medium text-foreground">{formatCurrency(safeNumber(day.costPerMeal))}</div>
                              <div className="text-xs text-muted-foreground">per meal</div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{day.plannedMeals || 0} meals planned</span>
                            <span>Total: {formatCurrency(safeNumber(day.totalCost))}</span>
                          </div>
                          <div className="mt-2">
                            <Progress 
                              value={(safeNumber(day.costPerMeal) / 50000) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost Trends */}
            {aiResult.costAnalysis?.costTrends && (
              <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Cost Trends & Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {aiResult.costAnalysis.costTrends.slice(0, 5).map((trend: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                        <div>
                          <span className="font-medium text-sm text-foreground">{trend.schoolName} - Day {trend.day}</span>
                          <div className="text-xs text-muted-foreground mt-1">
                            Trend: <Badge 
                              variant={trend.trend === 'increase' ? 'destructive' : trend.trend === 'decrease' ? 'default' : 'secondary'}
                              className="ml-1"
                            >
                              {trend.trend}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm text-foreground">{formatCurrency(safeNumber(trend.costPerMeal))}</div>
                          {trend.variance > 0 && (
                            <div className="text-xs text-muted-foreground">
                              ±{Math.round(trend.variance * 100)}% variance
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost Optimization Opportunities */}
            <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Cost Optimization Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Potential Savings</div>
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {formatCurrency(Math.max(0, safeNumber(aiResult.costAnalysis?.averageCostPerMeal) - 30000))}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">per meal vs 30k target</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-sm font-medium text-green-900 dark:text-green-100">Budget Status</div>
                    <div className="text-lg font-bold text-green-700 dark:text-green-300">
                      {safeNumber(aiResult.costAnalysis?.averageCostPerMeal) <= 35000 ? 'On Track' : 'Over Budget'}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      {safeNumber(aiResult.costAnalysis?.averageCostPerMeal) <= 35000 ? 
                        'Within target range' : 
                        `${formatCurrency(safeNumber(aiResult.costAnalysis?.averageCostPerMeal) - 35000)} over target`
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {/* Priority Summary */}
            <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  Recommendation Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {aiResult.recommendations.filter((rec: any) => rec.priority === 'high').length}
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">High Priority</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {aiResult.recommendations.filter((rec: any) => rec.priority === 'medium').length}
                    </div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Medium Priority</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {aiResult.recommendations.filter((rec: any) => rec.priority === 'low').length}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Low Priority</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Recommendations */}
            <div className="space-y-3">
              {aiResult.recommendations.map((rec: any, index: number) => (
                <Card key={index} className={`${
                  rec.priority === 'high' ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20' :
                  rec.priority === 'medium' ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20' :
                  'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20'
                } backdrop-blur-sm shadow-sm`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900/50' :
                        rec.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50' : 'bg-blue-100 dark:bg-blue-900/50'
                      }`}>
                        {rec.type === 'nutrition' ? <Heart className="w-4 h-4" /> : 
                         rec.type === 'cost' ? <DollarSign className="w-4 h-4" /> : 
                         rec.type === 'operations' ? <AlertCircle className="w-4 h-4" /> :
                         rec.type === 'sustainability' ? <CheckCircle className="w-4 h-4" /> :
                         rec.type === 'education' ? <Clock className="w-4 h-4" /> :
                         <TrendingUp className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-base text-foreground">{rec.title}</h4>
                          <div className="flex space-x-2">
                            <Badge variant={
                              rec.priority === 'high' ? 'destructive' :
                              rec.priority === 'medium' ? 'default' : 'secondary'
                            }>
                              {rec.priority} priority
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {rec.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                        
                        {/* Impact & Benefits */}
                        {(rec.estimatedImprovement || rec.estimatedSavings || rec.estimatedBenefit) && (
                          <div className="mb-3 p-2 bg-background/60 dark:bg-background/60 rounded border border-border">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Expected Impact:</div>
                            <div className="text-sm text-foreground">
                              {rec.estimatedImprovement || rec.estimatedSavings || rec.estimatedBenefit}
                            </div>
                          </div>
                        )}
                        
                        {/* Action Items */}
                        {rec.actionItems && rec.actionItems.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Action Items:</div>
                            <ul className="space-y-1">
                              {rec.actionItems.map((item: string, i: number) => (
                                <li key={i} className="flex items-start space-x-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-foreground">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Implementation Timeline */}
                        <div className="mt-3 pt-2 border-t border-border">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              Implementation: {
                                rec.priority === 'high' ? 'Immediate (1-2 days)' :
                                rec.priority === 'medium' ? 'Short-term (1-2 weeks)' :
                                'Long-term (1-2 months)'
                              }
                            </span>
                            <Button size="sm" variant="outline" className="text-xs">
                              Mark as Planned
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Implementation Guide */}
            <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Implementation Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-foreground">High Priority:</span>
                    <span className="text-muted-foreground">Address immediately to prevent critical issues</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-foreground">Medium Priority:</span>
                    <span className="text-muted-foreground">Plan for implementation within 1-2 weeks</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-foreground">Low Priority:</span>
                    <span className="text-muted-foreground">Consider for long-term improvements</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setAiResult(null)}>
            Generate New Plan
          </Button>
          <Button onClick={onSuccess}>
            Apply Menu Plan
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/50 dark:bg-muted/50 rounded-full mb-4">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">AI-Powered Menu Planning</h3>
        <p className="text-muted-foreground">
          Generate optimized menu plans using artificial intelligence
        </p>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Planning Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="planningPeriod" className="text-foreground">Planning Period (days)</Label>
              <Input
                id="planningPeriod"
                type="number"
                min="1"
                max="30"
                value={formData.planningPeriod}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  planningPeriod: parseInt(e.target.value) || 7
                }))}
                className="bg-background dark:bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="maxCostPerMeal" className="text-foreground">Max Cost Per Meal (IDR)</Label>
              <Input
                id="maxCostPerMeal"
                type="number"
                value={formData.budgetConstraints.maxCostPerMeal}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  budgetConstraints: {
                    ...prev.budgetConstraints,
                    maxCostPerMeal: parseInt(e.target.value) || 45000
                  }
                }))}
                className="bg-background dark:bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="complexity" className="text-foreground">Recipe Complexity</Label>
              <Select
                value={formData.preferences.complexity}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, complexity: value }
                }))}
              >
                <SelectTrigger className="bg-background dark:bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Nutritional Goals */}
        <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Nutritional Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="minProtein" className="text-foreground">Minimum Protein (g)</Label>
              <Input
                id="minProtein"
                type="number"
                value={formData.nutritionalGoals.minProtein}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nutritionalGoals: {
                    ...prev.nutritionalGoals,
                    minProtein: parseInt(e.target.value) || 20
                  }
                }))}
                className="bg-background dark:bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="maxCalories" className="text-foreground">Maximum Calories</Label>
              <Input
                id="maxCalories"
                type="number"
                value={formData.nutritionalGoals.maxCalories}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nutritionalGoals: {
                    ...prev.nutritionalGoals,
                    maxCalories: parseInt(e.target.value) || 500
                  }
                }))}
                className="bg-background dark:bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="minFiber" className="text-foreground">Minimum Fiber (g)</Label>
              <Input
                id="minFiber"
                type="number"
                value={formData.nutritionalGoals.minFiber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nutritionalGoals: {
                    ...prev.nutritionalGoals,
                    minFiber: parseInt(e.target.value) || 10
                  }
                }))}
                className="bg-background dark:bg-background border-border"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={generateAIMenu}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg shadow-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating AI Menu Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Menu Plan
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
