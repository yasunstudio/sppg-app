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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <Calculator className="w-6 h-6 text-white" />
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
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
              <span>Konfigurasi AI Menu Planner</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AIMenuPlanner onSuccess={handleSuccess} />
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="font-semibold">Optimasi Nutrisi</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                AI akan mengoptimalkan kandungan nutrisi sesuai kebutuhan kalori dan gizi
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold">Analisis Biaya</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Perhitungan otomatis biaya produksi dan rekomendasi efisiensi anggaran
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 className="font-semibold">Rekomendasi Cerdas</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Saran menu berdasarkan data historis dan preferensi siswa
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
