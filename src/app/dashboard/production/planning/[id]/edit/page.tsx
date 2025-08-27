"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Calculator, Clock, Users, ChefHat } from "lucide-react"
import Link from "next/link"

// Mock data untuk demo
const availableMenus = [
  { id: "menu-1", name: "Nasi Ayam Wortel", estimatedCostPerPortion: 8500 },
  { id: "menu-2", name: "Gado-gado Sehat", estimatedCostPerPortion: 7200 },
  { id: "menu-3", name: "Soto Ayam Kuning", estimatedCostPerPortion: 9100 },
  { id: "menu-4", name: "Rendang Daging Sapi", estimatedCostPerPortion: 12000 },
]

const availableKitchens = [
  { id: "kitchen-1", name: "Dapur Utama", capacity: 2000 },
  { id: "kitchen-2", name: "Dapur Bantu", capacity: 1000 },
]

// Mock existing plan data
const mockPlanData = {
  "1": {
    id: "1",
    menuId: "menu-1",
    planDate: "2025-08-27",
    targetPortions: "2000",
    kitchenId: "kitchen-1",
    plannedStartTime: "06:00",
    plannedEndTime: "12:00",
    assignedStaff: "5",
    notes: "Produksi untuk 5 sekolah di wilayah Jakarta Pusat",
  }
}

export default function EditProductionPlanPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id as string

  const [formData, setFormData] = useState({
    menuId: "",
    planDate: "",
    targetPortions: "",
    kitchenId: "",
    plannedStartTime: "",
    plannedEndTime: "",
    assignedStaff: "",
    notes: "",
  })

  const [estimatedCost, setEstimatedCost] = useState(0)
  const [estimatedDuration, setEstimatedDuration] = useState(0)

  // Load existing plan data
  useEffect(() => {
    const existingPlan = mockPlanData[planId as keyof typeof mockPlanData]
    if (existingPlan) {
      setFormData(existingPlan)
      // Calculate initial estimates
      const menu = availableMenus.find(m => m.id === existingPlan.menuId)
      if (menu) {
        setEstimatedCost(menu.estimatedCostPerPortion * parseInt(existingPlan.targetPortions))
      }
      const portions = parseInt(existingPlan.targetPortions)
      const staff = parseInt(existingPlan.assignedStaff)
      if (portions > 0 && staff > 0) {
        setEstimatedDuration(Math.ceil(portions / (staff * 50)))
      }
    }
  }, [planId])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Calculate estimated cost when menu or portions change
    if (field === "menuId" || field === "targetPortions") {
      const menu = availableMenus.find(m => m.id === (field === "menuId" ? value : formData.menuId))
      const portions = parseInt(field === "targetPortions" ? value : formData.targetPortions) || 0
      
      if (menu && portions > 0) {
        setEstimatedCost(menu.estimatedCostPerPortion * portions)
      }
    }

    // Calculate estimated duration based on portions and staff
    if (field === "targetPortions" || field === "assignedStaff") {
      const portions = parseInt(field === "targetPortions" ? value : formData.targetPortions) || 0
      const staff = parseInt(field === "assignedStaff" ? value : formData.assignedStaff) || 1
      
      if (portions > 0 && staff > 0) {
        const productionRate = 50
        const totalHours = Math.ceil(portions / (staff * productionRate))
        setEstimatedDuration(totalHours)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would typically send the data to your API
    console.log("Updating production plan:", { planId, ...formData })
    
    // For demo, just redirect back
    router.push("/dashboard/production/planning")
  }

  const selectedMenu = availableMenus.find(m => m.id === formData.menuId)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/production/planning">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Rencana Produksi</h1>
          <p className="text-muted-foreground">
            Edit rencana produksi #{planId}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Rencana Produksi</CardTitle>
            <CardDescription>
              Edit informasi rencana produksi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="menu">Menu</Label>
                <Select 
                  value={formData.menuId} 
                  onValueChange={(value) => handleInputChange("menuId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMenus.map((menu) => (
                      <SelectItem key={menu.id} value={menu.id}>
                        {menu.name} - Rp {menu.estimatedCostPerPortion.toLocaleString()}/porsi
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planDate">Tanggal Produksi</Label>
                <Input
                  id="planDate"
                  type="date"
                  value={formData.planDate}
                  onChange={(e) => handleInputChange("planDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetPortions">Target Porsi</Label>
                <Input
                  id="targetPortions"
                  type="number"
                  placeholder="Masukkan jumlah porsi"
                  value={formData.targetPortions}
                  onChange={(e) => handleInputChange("targetPortions", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kitchen">Dapur</Label>
                <Select 
                  value={formData.kitchenId} 
                  onValueChange={(value) => handleInputChange("kitchenId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih dapur" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableKitchens.map((kitchen) => (
                      <SelectItem key={kitchen.id} value={kitchen.id}>
                        {kitchen.name} (Kapasitas: {kitchen.capacity.toLocaleString()} porsi)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Waktu Mulai</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.plannedStartTime}
                    onChange={(e) => handleInputChange("plannedStartTime", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Waktu Selesai</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.plannedEndTime}
                    onChange={(e) => handleInputChange("plannedEndTime", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedStaff">Jumlah Staff</Label>
                <Input
                  id="assignedStaff"
                  type="number"
                  placeholder="Jumlah staff yang dialokasikan"
                  value={formData.assignedStaff}
                  onChange={(e) => handleInputChange("assignedStaff", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan tambahan untuk produksi"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Update Rencana
                </Button>
                <Link href="/dashboard/production/planning" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Batal
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Estimation Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estimasi Produksi</CardTitle>
              <CardDescription>
                Perkiraan biaya dan waktu produksi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Total Biaya</span>
                  </div>
                  <span className="text-lg font-bold">
                    Rp {estimatedCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Biaya per Porsi</span>
                  </div>
                  <span className="text-lg font-bold">
                    Rp {formData.targetPortions ? Math.round(estimatedCost / parseInt(formData.targetPortions)).toLocaleString() : 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Estimasi Durasi</span>
                  </div>
                  <span className="text-lg font-bold">
                    {estimatedDuration} jam
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Produktivitas</span>
                  </div>
                  <span className="text-lg font-bold">
                    {formData.assignedStaff && formData.targetPortions 
                      ? Math.round(parseInt(formData.targetPortions) / parseInt(formData.assignedStaff))
                      : 0} porsi/staff
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Menu</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMenu ? (
                <div className="space-y-2">
                  <p className="font-medium">{selectedMenu.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Biaya per porsi: Rp {selectedMenu.estimatedCostPerPortion.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Pilih menu untuk melihat informasi</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
