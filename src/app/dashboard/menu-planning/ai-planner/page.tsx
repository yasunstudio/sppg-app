'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calculator, Bot, TrendingUp, Sparkles } from 'lucide-react'
import { AIMenuPlanner } from '../components'

export default function AIMenuPlannerPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Navigate back to menu planning with a success message
    router.push('/dashboard/menu-planning?success=ai-planner')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Calculator className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              AI Menu Planner
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gunakan kecerdasan buatan untuk merencanakan menu yang optimal
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="bg-card/80 dark:bg-card/80 border-border hover:bg-muted backdrop-blur-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>AI Menu Planner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AIMenuPlanner onSuccess={handleSuccess} />
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-foreground">AI Powered</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Menggunakan artificial intelligence untuk merencanakan menu yang optimal
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Data Driven</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Berdasarkan data nutrisi dan preferensi yang akurat
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-foreground">Efisien</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Menghemat waktu perencanaan menu hingga 80%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
