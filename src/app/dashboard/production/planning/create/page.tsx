"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Calculator, Clock, Users, ChefHat, Factory } from "lucide-react"
import Link from "next/link"

// Fetch menus for selection
async function fetchMenus() {
  const response = await fetch("/api/menus")
  if (!response.ok) {
    throw new Error("Failed to fetch menus")
  }
  return response.json()
}

// Create production plan
async function createProductionPlan(data: any) {
  const response = await fetch("/api/production/plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create production plan")
  }

  return response.json()
}

const availableKitchens = [
  { id: "kitchen-1", name: "Dapur Utama", capacity: 2000 },
  { id: "kitchen-2", name: "Dapur Bantu", capacity: 1000 },
]

export default function CreateProductionPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedMenuId = searchParams.get("menuId")

  const [formData, setFormData] = useState({
    menuId: preselectedMenuId || "",
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

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: menus = [], isLoading: menusLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: fetchMenus,
  })

  // Auto-populate menu if preselected
  useEffect(() => {
    if (preselectedMenuId && menus.length > 0) {
      const selectedMenu = menus.find((menu: any) => menu.id === preselectedMenuId)
      if (selectedMenu) {
        setFormData(prev => ({
          ...prev,
          menuId: preselectedMenuId
        }))
      }
    }
  }, [preselectedMenuId, menus])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-calculate estimates when menu or portions change
    if (field === "menuId" || field === "targetPortions") {
      const menu = menus.find((m: any) => m.id === (field === "menuId" ? value : formData.menuId))
      const portions = parseInt(field === "targetPortions" ? value : formData.targetPortions) || 0
      
      if (menu && portions > 0) {
        // Calculate estimated cost if menu has pricing data
        const estimatedCostPerPortion = menu.estimatedCostPerPortion || 8000 // default estimate
        setEstimatedCost(estimatedCostPerPortion * portions)
      }
    }

    // Calculate estimated duration based on portions and staff
    if (field === "targetPortions" || field === "assignedStaff") {
      const portions = parseInt(field === "targetPortions" ? value : formData.targetPortions) || 0
      const staff = parseInt(field === "assignedStaff" ? value : formData.assignedStaff) || 1
      
      if (portions > 0 && staff > 0) {
        // Assume 1 staff can produce 50 portions per hour
        const productionRate = 50
        const totalHours = Math.ceil(portions / (staff * productionRate))
        setEstimatedDuration(totalHours)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert date and time strings to proper DateTime
      const planDate = new Date(formData.planDate)
      const plannedStartTime = formData.plannedStartTime 
        ? new Date(`${formData.planDate}T${formData.plannedStartTime}:00`)
        : null
      const plannedEndTime = formData.plannedEndTime 
        ? new Date(`${formData.planDate}T${formData.plannedEndTime}:00`)
        : null

      const submitData = {
        menuId: formData.menuId || null,
        planDate: planDate.toISOString(),
        targetPortions: parseInt(formData.targetPortions),
        plannedStartTime: plannedStartTime?.toISOString(),
        plannedEndTime: plannedEndTime?.toISOString(),
        notes: formData.notes || null,
        status: "PLANNED"
      }

      await createProductionPlan(submitData)
      router.push("/dashboard/production/planning")
    } catch (error) {
      console.error("Error creating production plan:", error)
      alert("Failed to create production plan. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Factory className="h-6 w-6 text-white" />
            </div>
            New Production Plan
          </h1>
          <p className="text-muted-foreground">
            Create a new production plan for school menu preparation and resource management
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Rencana Produksi</CardTitle>
            <CardDescription>
              Isi informasi rencana produksi yang akan dibuat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="menu">Menu *</Label>
                <Select 
                  value={formData.menuId} 
                  onValueChange={(value) => handleInputChange("menuId", value)}
                  disabled={!!preselectedMenuId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {menusLoading ? (
                      <SelectItem value="loading" disabled>Loading menus...</SelectItem>
                    ) : (
                      menus.map((menu: any) => (
                        <SelectItem key={menu.id} value={menu.id}>
                          {menu.name} - {menu.mealType}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {preselectedMenuId && (
                  <p className="text-sm text-green-600 flex items-center">
                    <Factory className="mr-1 h-3 w-3" />
                    Menu sudah dipilih dari halaman menu planning
                  </p>
                )}
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
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Menyimpan..." : "Simpan Rencana"}
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
              <CardTitle>Tips Perencanaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Pastikan kapasitas dapur mencukupi untuk target porsi</p>
                <p>• Alokasikan staff yang cukup untuk menghindari overtime</p>
                <p>• Pertimbangkan waktu persiapan bahan sebelum produksi</p>
                <p>• Sediakan buffer waktu untuk quality control</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
