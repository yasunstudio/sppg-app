'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, ChefHat, Lightbulb, Target, CheckCircle2 } from 'lucide-react'
import { MenuForm } from '../components'

export default function CreateMenuPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Navigate back to menu planning with a success message
    router.push('/dashboard/menu-planning?success=menu-created')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-start space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center space-x-2 hover:bg-muted transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Button>
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center space-x-3 text-foreground">
                <div className="p-2 bg-primary rounded-xl">
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </div>
                <span>Buat Menu Baru</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Buat menu bergizi untuk program SPPG dengan panduan nutrisi yang tepat
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
                {/* Main Form Card */}
        <Card className="shadow-xl border border-border bg-card backdrop-blur-sm">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-foreground">Formulir Menu Baru</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Lengkapi informasi menu dengan detail nutrisi dan resep yang sesuai standar SPPG
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-6 md:pb-8">
            <MenuForm />
          </CardContent>
        </Card>

        {/* Guidelines Cards */}
                {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border border-border bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Informasi Dasar</h3>
                  <p className="text-sm text-muted-foreground">
                    Masukkan nama menu, deskripsi, dan jenis makanan sesuai dengan target gizi anak sekolah
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Target Nutrisi</h3>
                  <p className="text-sm text-muted-foreground">
                    Tentukan kalori, protein, karbohidrat, dan nutrisi lainnya berdasarkan AKG Indonesia
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-muted rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Validasi Resep</h3>
                  <p className="text-sm text-muted-foreground">
                    Pastikan resep dan bahan makanan sesuai dengan standar keamanan dan gizi SPPG
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="border-border bg-muted/50">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Tips Membuat Menu</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-muted-foreground">Pastikan menu memenuhi standar gizi anak sekolah</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-muted-foreground">Pertimbangkan variasi rasa dan tekstur makanan</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-muted-foreground">Sesuaikan dengan budget yang tersedia</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-muted-foreground">Gunakan bahan-bahan lokal dan musiman</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
