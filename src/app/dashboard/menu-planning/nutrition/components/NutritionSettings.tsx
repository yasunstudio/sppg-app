'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface NutritionSettingsData {
  nutritionStandard: 'akg-indonesia' | 'who' | 'usda'
  unitSystem: 'metric' | 'imperial'
  displayOptions: {
    showPercentages: boolean
    showProgress: boolean
    showRecommendations: boolean
    groupByCategory: boolean
  }
  analysisDepth: 'basic' | 'detailed' | 'comprehensive'
}

interface NutritionSettingsProps {
  settings: NutritionSettingsData
  onSettingsChange: (settings: NutritionSettingsData) => void
}

export default function NutritionSettings({ settings, onSettingsChange }: NutritionSettingsProps) {
  const handleSettingChange = (field: keyof NutritionSettingsData, value: any) => {
    onSettingsChange({
      ...settings,
      [field]: value
    })
  }

  const handleDisplayOptionChange = (option: keyof NutritionSettingsData['displayOptions'], checked: boolean) => {
    onSettingsChange({
      ...settings,
      displayOptions: {
        ...settings.displayOptions,
        [option]: checked
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Standar Nutrisi */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Standar Referensi Nutrisi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nutrition-standard">Standar yang Digunakan</Label>
            <Select 
              value={settings.nutritionStandard} 
              onValueChange={(value) => handleSettingChange('nutritionStandard', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih standar nutrisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="akg-indonesia">AKG Indonesia 2019</SelectItem>
                <SelectItem value="who">WHO/FAO Guidelines</SelectItem>
                <SelectItem value="usda">USDA Dietary Guidelines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit-system">Sistem Satuan</Label>
            <Select 
              value={settings.unitSystem} 
              onValueChange={(value) => handleSettingChange('unitSystem', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih sistem satuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metrik (g, mg, μg)</SelectItem>
                <SelectItem value="imperial">Imperial (oz, lb)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Opsi Tampilan */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Opsi Tampilan Analisis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-percentages"
                checked={settings.displayOptions.showPercentages}
                onCheckedChange={(checked) => handleDisplayOptionChange('showPercentages', !!checked)}
              />
              <Label htmlFor="show-percentages" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Tampilkan persentase dari target
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-progress"
                checked={settings.displayOptions.showProgress}
                onCheckedChange={(checked) => handleDisplayOptionChange('showProgress', !!checked)}
              />
              <Label htmlFor="show-progress" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Tampilkan progress bar
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-recommendations"
                checked={settings.displayOptions.showRecommendations}
                onCheckedChange={(checked) => handleDisplayOptionChange('showRecommendations', !!checked)}
              />
              <Label htmlFor="show-recommendations" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Tampilkan rekomendasi nutrisi
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="group-by-category"
                checked={settings.displayOptions.groupByCategory}
                onCheckedChange={(checked) => handleDisplayOptionChange('groupByCategory', !!checked)}
              />
              <Label htmlFor="group-by-category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Kelompokkan berdasarkan kategori
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tingkat Analisis */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Tingkat Detail Analisis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="analysis-depth">Kedalaman Analisis</Label>
            <Select 
              value={settings.analysisDepth} 
              onValueChange={(value) => handleSettingChange('analysisDepth', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tingkat analisis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Dasar (Kalori dan makronutrien)</SelectItem>
                <SelectItem value="detailed">Detail (Termasuk vitamin utama)</SelectItem>
                <SelectItem value="comprehensive">Komprehensif (Semua mikronutrien)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Aksi */}
      <div className="flex gap-2">
        <Button variant="outline">
          Reset Default
        </Button>
        <Button>
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  )
}
