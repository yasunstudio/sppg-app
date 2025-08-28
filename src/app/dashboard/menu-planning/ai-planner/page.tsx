'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calculator } from 'lucide-react'
import { AIMenuPlanner } from '../components'

export default function AIMenuPlannerPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Navigate back to menu planning with a success message
    router.push('/dashboard/menu-planning?success=ai-planner')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Calculator className="w-6 h-6 text-primary-foreground" />
                </div>
                <span>AI Menu Planner</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Gunakan kecerdasan buatan untuk merencanakan menu yang optimal
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
                {/* Main Content */}
        <Card className="shadow-lg border border-border bg-card/80 backdrop-blur-sm">
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
          <Card className="border border-border bg-card/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">🤖 AI Powered</h3>
              <p className="text-sm text-muted-foreground">
                Menggunakan artificial intelligence untuk merencanakan menu yang optimal
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">📊 Data Driven</h3>
              <p className="text-sm text-muted-foreground">
                Berdasarkan data nutrisi dan preferensi yang akurat
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">⚡ Efisien</h3>
              <p className="text-sm text-muted-foreground">
                Menghemat waktu perencanaan menu hingga 80%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
