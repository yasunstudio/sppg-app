import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'analytics:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    
    const periodStart = new Date()
    periodStart.setDate(periodStart.getDate() - parseInt(period))

    // Base query filters
    const filters = {
      createdAt: {
        gte: periodStart
      }
    }

    // 1. Inventory Cost Analysis
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: filters,
      include: {
        rawMaterial: {
          select: {
            name: true,
            category: true,
            unit: true
          }
        }
      }
    })

    const inventoryValueAnalysis = inventoryItems.map(item => ({
      itemId: item.id,
      materialName: item.rawMaterial.name,
      category: item.rawMaterial.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalValue: item.totalPrice,
      unit: item.rawMaterial.unit,
      expiryDate: item.expiryDate,
      date: item.createdAt
    }))

    // 2. Recipe Cost Analysis
    const recipes = await prisma.recipe.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        cost: true,
        servingSize: true,
        createdAt: true
      }
    })

    const recipeCostAnalysis = recipes.map(recipe => ({
      recipeId: recipe.id,
      recipeName: recipe.name,
      totalCost: recipe.cost || 0,
      servingSize: recipe.servingSize || 1,
      costPerServing: recipe.cost && recipe.servingSize ? Math.round((recipe.cost / recipe.servingSize) * 100) / 100 : 0,
      createdAt: recipe.createdAt
    }))

    // 3. Overall Financial Metrics
    const totalInventoryValue = inventoryValueAnalysis.reduce((sum, item) => sum + item.totalValue, 0)
    const avgInventoryValue = inventoryValueAnalysis.length > 0 
      ? totalInventoryValue / inventoryValueAnalysis.length 
      : 0
    const totalRecipeCost = recipeCostAnalysis.reduce((sum, recipe) => sum + recipe.totalCost, 0)
    const avgRecipeCost = recipeCostAnalysis.length > 0
      ? totalRecipeCost / recipeCostAnalysis.length
      : 0

    // 4. Inventory Trends Over Time
    const dailyInventoryTrendsMap = inventoryValueAnalysis.reduce((acc, item) => {
      const dateKey = item.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totalValue: 0,
          itemCount: 0,
          avgValue: 0
        }
      }
      
      acc[dateKey].totalValue += item.totalValue
      acc[dateKey].itemCount += 1
      
      return acc
    }, {} as Record<string, {
      date: string;
      totalValue: number;
      itemCount: number;
      avgValue: number;
    }>)

    // Calculate average value per item for each day
    Object.values(dailyInventoryTrendsMap).forEach(day => {
      day.avgValue = day.itemCount > 0 ? Math.round((day.totalValue / day.itemCount) * 100) / 100 : 0
      day.totalValue = Math.round(day.totalValue * 100) / 100
    })

    const inventoryTrends = Object.values(dailyInventoryTrendsMap).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // 5. Recipe Cost Performance
    const sortedRecipes = recipeCostAnalysis
      .filter(recipe => recipe.totalCost > 0)
      .sort((a, b) => b.totalCost - a.totalCost)

    // 6. Inventory Category Analysis
    const inventoryCategoryMap = inventoryValueAnalysis.reduce((acc, item) => {
      const category = item.category
      if (!acc[category]) {
        acc[category] = {
          category,
          itemCount: 0,
          totalValue: 0,
          avgValue: 0,
          totalQuantity: 0
        }
      }
      
      acc[category].itemCount += 1
      acc[category].totalValue += item.totalValue
      acc[category].totalQuantity += item.quantity
      
      return acc
    }, {} as Record<string, {
      category: string;
      itemCount: number;
      totalValue: number;
      avgValue: number;
      totalQuantity: number;
    }>)

    // Calculate averages for categories
    Object.values(inventoryCategoryMap).forEach(category => {
      category.avgValue = category.itemCount > 0 ? Math.round((category.totalValue / category.itemCount) * 100) / 100 : 0
      category.totalValue = Math.round(category.totalValue * 100) / 100
    })

    const inventoryCategoryAnalysis = Object.values(inventoryCategoryMap)
      .sort((a, b) => b.totalValue - a.totalValue)

    // 7. Cost Efficiency Insights
    const costEfficiencyInsights = {
      mostCostEfficientRecipe: sortedRecipes.reduce((min, recipe) => 
        recipe.costPerServing < min.costPerServing && recipe.costPerServing > 0 ? recipe : min, 
        sortedRecipes[0] || { recipeName: 'N/A', costPerServing: 0 }
      ),
      mostExpensiveRecipe: sortedRecipes.reduce((max, recipe) => 
        recipe.costPerServing > max.costPerServing ? recipe : max, 
        sortedRecipes[0] || { recipeName: 'N/A', costPerServing: 0 }
      ),
      highestValueCategory: inventoryCategoryAnalysis[0] || { category: 'N/A', totalValue: 0 }
    }

    // 8. Expiry Analysis
    const currentDate = new Date()
    const nearExpiryItems = inventoryValueAnalysis.filter(item => 
      item.expiryDate && new Date(item.expiryDate) <= new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    )
    const nearExpiryValue = nearExpiryItems.reduce((sum, item) => sum + item.totalValue, 0)

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
          avgInventoryValue: Math.round(avgInventoryValue * 100) / 100,
          totalRecipeCost: Math.round(totalRecipeCost * 100) / 100,
          avgRecipeCost: Math.round(avgRecipeCost * 100) / 100,
          totalInventoryItems: inventoryValueAnalysis.length,
          totalRecipes: recipeCostAnalysis.length,
          nearExpiryValue: Math.round(nearExpiryValue * 100) / 100,
          nearExpiryCount: nearExpiryItems.length
        },
        inventoryValueAnalysis,
        recipeCostAnalysis: sortedRecipes,
        inventoryTrends,
        inventoryCategoryAnalysis,
        costEfficiencyInsights,
        nearExpiryItems,
        recommendations: [
          nearExpiryItems.length > 0 ? 
            `${nearExpiryItems.length} items nearing expiry - prioritize usage to minimize waste` : null,
          totalInventoryValue > avgRecipeCost * recipeCostAnalysis.length * 5 ? 
            'High inventory value relative to recipe costs - optimize inventory levels' : null,
          costEfficiencyInsights.mostExpensiveRecipe.costPerServing > avgRecipeCost * 2 ? 
            `Review cost optimization for ${costEfficiencyInsights.mostExpensiveRecipe.recipeName}` : null,
          inventoryCategoryAnalysis.length > 0 && inventoryCategoryAnalysis[0].totalValue > totalInventoryValue * 0.5 ?
            `${inventoryCategoryAnalysis[0].category} category represents majority of inventory value - monitor closely` : null
        ].filter(Boolean)
      }
    })

  } catch (error) {
    console.error('Financial analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial analytics' },
      { status: 500 }
    )
  }
}
