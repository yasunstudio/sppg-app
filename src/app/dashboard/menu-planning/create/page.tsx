'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, ChefHat } from 'lucide-react'
import { MenuForm } from '../components'

export default function CreateMenuPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Navigate back to menu planning with a success message
    router.push('/dashboard/menu-planning?success=menu-created')
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
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span>Buat Menu Baru</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Tambahkan menu makanan baru untuk program sekolah
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              <span>Formulir Menu Baru</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MenuForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>

        {/* Guidelines Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <ChefHat className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold">Informasi Dasar</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Lengkapi nama, deskripsi, dan jenis waktu makan
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <h3 className="font-semibold">Nutrisi</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Masukkan informasi kalori dan kandungan gizi
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <h3 className="font-semibold">Bahan Baku</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Tentukan resep dan bahan-bahan yang dibutuhkan
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <h3 className="font-semibold">Review</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Periksa kembali sebelum menyimpan menu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Tips Membuat Menu</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p>• Pastikan menu memenuhi standar gizi anak sekolah</p>
                <p>• Pertimbangkan variasi rasa dan tekstur</p>
              </div>
              <div>
                <p>• Sesuaikan dengan budget yang tersedia</p>
                <p>• Gunakan bahan-bahan lokal dan musiman</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
