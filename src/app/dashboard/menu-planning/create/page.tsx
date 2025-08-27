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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-start md:items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center space-x-3 text-gray-900 dark:text-gray-50">
                <div className="p-2.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
                  <Plus className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
                <span>Buat Menu Baru</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Tambahkan menu makanan baru untuk program sekolah
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-white dark:bg-gray-900 backdrop-blur-sm ring-1 ring-gray-200 dark:ring-gray-800">
          <CardHeader className="pb-6 px-6 md:px-8 pt-6 md:pt-8">
            <CardTitle className="flex items-center space-x-3 text-lg md:text-xl">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
              <span className="text-gray-900 dark:text-gray-50">Formulir Menu Baru</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-6 md:pb-8">
            <MenuForm />
          </CardContent>
        </Card>

        {/* Guidelines Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm ring-1 ring-gray-200 dark:ring-gray-800 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg">
                  <ChefHat className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Informasi Dasar</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Lengkapi nama, deskripsi, dan jenis waktu makan
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm ring-1 ring-gray-200 dark:ring-gray-800 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Nutrisi</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Masukkan informasi kalori dan kandungan gizi
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm ring-1 ring-gray-200 dark:ring-gray-800 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Bahan Baku</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Tentukan resep dan bahan-bahan yang dibutuhkan
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm ring-1 ring-gray-200 dark:ring-gray-800 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Review</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Periksa kembali sebelum menyimpan menu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-950/50 ring-1 ring-blue-200 dark:ring-blue-800/50">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50">Tips Membuat Menu</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">Pastikan menu memenuhi standar gizi anak sekolah</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">Pertimbangkan variasi rasa dan tekstur makanan</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">Sesuaikan dengan budget yang tersedia</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">Gunakan bahan-bahan lokal dan musiman</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
