"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot, Zap, TrendingUp, Utensils, DollarSign, Clock } from "lucide-react"
import Link from "next/link"
import { AIRecipeOptimizer } from "../components"

export default function AIRecipeOptimizerPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/production">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Production
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            AI Recipe Optimizer
          </h1>
          <p className="text-muted-foreground">
            Optimize your recipes with AI-powered analysis for better nutrition, cost efficiency, and production planning
          </p>
        </div>
      </div>

      {/* Feature Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nutrition Analysis</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">AI-Powered</div>
            <p className="text-xs text-muted-foreground">
              Optimize nutritional balance automatically
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Smart</div>
            <p className="text-xs text-muted-foreground">
              Reduce costs while maintaining quality
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Optimized</div>
            <p className="text-xs text-muted-foreground">
              Streamline preparation workflows
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipe Innovation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Enhanced</div>
            <p className="text-xs text-muted-foreground">
              Discover new recipe variations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recipe Optimizer Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Recipe Optimization Engine
          </CardTitle>
          <CardDescription>
            Use advanced AI algorithms to analyze and optimize your recipes for better nutrition, cost efficiency, and production planning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIRecipeOptimizer
            onSuccess={() => {
              // Handle success - could redirect or show success message
              console.log("Recipe optimization completed successfully!")
            }}
          />
        </CardContent>
      </Card>

      {/* How it Works Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            How AI Recipe Optimization Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                  1
                </Badge>
                <h4 className="font-medium">Recipe Analysis</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-10">
                AI analyzes your current recipes for nutritional content, ingredient costs, and preparation complexity.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                  2
                </Badge>
                <h4 className="font-medium">Smart Optimization</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-10">
                Advanced algorithms suggest ingredient substitutions and portion adjustments for better outcomes.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                  3
                </Badge>
                <h4 className="font-medium">Production Integration</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-10">
                Optimized recipes are seamlessly integrated into your production planning and inventory management.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
