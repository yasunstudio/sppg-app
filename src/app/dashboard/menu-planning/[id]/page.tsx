"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  ChefHat,
  Package2,
  Users,
  Calculator,
  Clock,
  BarChart3,
  Edit,
  Trash2,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuData {
  id: string;
  name: string;
  description?: string;
  menuDate: string;
  totalCalories?: number;
  totalProtein?: number;
  totalFat?: number;
  totalCarbs?: number;
  totalFiber?: number;
  menuItems: Array<{
    id: string;
    name: string;
    category: string;
    servingSize: number;
    ingredients: Array<{
      id: string;
      quantity: number;
      rawMaterial: {
        id: string;
        name: string;
        category: string;
        unit: string;
        inventory?: Array<{
          unitPrice: number;
        }>;
      };
    }>;
  }>;
  productionPlans: Array<{
    id: string;
    planDate: string;
    targetPortions: number;
    status: string;
  }>;
  recipes: Array<{
    id: string;
    name: string;
    category: string;
    servingSize: number;
    prepTime?: number;
    cookTime?: number;
  }>;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  metrics: {
    totalIngredients: number;
    totalEstimatedCost: number;
    costPerPortion: number;
    totalMenuItems: number;
    totalProductionPlans: number;
    totalRecipes: number;
    nutritionSummary: {
      totalCalories: number;
      totalProtein: number;
      totalFat: number;
      totalCarbs: number;
      totalFiber: number;
    };
  };
}

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/menus/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu data');
        }

        const data = await response.json();
        setMenuData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [params]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              {error || 'Menu not found'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{menuData.name}</h1>
            <p className="text-muted-foreground">
              {new Date(menuData.menuDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuData.metrics.totalMenuItems}</div>
            <p className="text-xs text-muted-foreground">
              {menuData.metrics.totalIngredients} total ingredients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {menuData.metrics.totalEstimatedCost.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground">
              ~Rp {menuData.metrics.costPerPortion.toLocaleString('id-ID')} per portion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Plans</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuData.metrics.totalProductionPlans}</div>
            <p className="text-xs text-muted-foreground">
              {menuData.productionPlans.filter(p => p.status === 'PLANNED').length} planned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuData.metrics.nutritionSummary.totalCalories} kcal
            </div>
            <p className="text-xs text-muted-foreground">
              {menuData.metrics.nutritionSummary.totalProtein}g protein
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Summary</CardTitle>
          <CardDescription>
            Total nutritional values for this menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {menuData.metrics.nutritionSummary.totalCalories}
              </div>
              <p className="text-sm text-muted-foreground">Calories (kcal)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {menuData.metrics.nutritionSummary.totalProtein.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Protein (g)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {menuData.metrics.nutritionSummary.totalFat.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Fat (g)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {menuData.metrics.nutritionSummary.totalCarbs.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Carbs (g)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {menuData.metrics.nutritionSummary.totalFiber.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Fiber (g)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>
            All items included in this menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuData.menuItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <Badge variant="secondary">
                    {item.servingSize} portions
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Ingredients:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {item.ingredients.map((ingredient) => (
                      <div key={ingredient.id} className="text-xs bg-muted rounded p-2">
                        <div className="font-medium">{ingredient.rawMaterial.name}</div>
                        <div className="text-muted-foreground">
                          {ingredient.quantity} {ingredient.rawMaterial.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Production Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Production Plans</CardTitle>
          <CardDescription>
            Production schedules for this menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {menuData.productionPlans.length > 0 ? (
              menuData.productionPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {new Date(plan.planDate).toLocaleDateString('id-ID')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Target: {plan.targetPortions} portions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/production-plans/${plan.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No production plans scheduled for this menu
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Related Recipes */}
      {menuData.recipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Recipes</CardTitle>
            <CardDescription>
              Recipes used in this menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuData.recipes.map((recipe) => (
                <div key={recipe.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{recipe.name}</h3>
                      <p className="text-sm text-muted-foreground">{recipe.category}</p>
                    </div>
                    <Badge variant="outline">
                      {recipe.servingSize} servings
                    </Badge>
                  </div>
                  {(recipe.prepTime || recipe.cookTime) && (
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {recipe.prepTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Prep: {recipe.prepTime}m</span>
                        </div>
                      )}
                      {recipe.cookTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Cook: {recipe.cookTime}m</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
