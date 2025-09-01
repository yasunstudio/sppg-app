"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Calendar, Users, Clock } from "lucide-react"
import { toast } from "sonner"

interface Menu {
  id: string
  name: string
  description?: string
  mealType: string
  targetGroup: string
  totalCalories?: number
}

export function ProductionPlanCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [menus, setMenus] = useState<Menu[]>([])

  const [formData, setFormData] = useState({
    planDate: '',
    targetPortions: '',
    menuId: 'none',
    kitchenId: '',
    plannedStartTime: '',
    plannedEndTime: '',
    notes: ''
  })

  useEffect(() => {
    fetchMenus()
  }, [])

  useEffect(() => {
    console.log('Menus state updated:', menus.length, 'menus')
  }, [menus])

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menus')
      if (response.ok) {
        const data = await response.json()
        // API returns the array directly, not wrapped in a data property
        setMenus(Array.isArray(data) ? data : data.data || [])
      } else {
        console.error('Failed to fetch menus:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching menus:', error)
      toast.error('Failed to load menu data')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.planDate || !formData.targetPortions) {
      toast.error('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    if (Number(formData.targetPortions) <= 0) {
      toast.error('Target portions must be greater than 0')
      return
    }

    try {
      setLoading(true)

      const requestData = {
        planDate: new Date(formData.planDate).toISOString(),
        targetPortions: Number(formData.targetPortions),
        ...(formData.menuId && formData.menuId !== 'none' && { menuId: formData.menuId }),
        ...(formData.kitchenId && { kitchenId: formData.kitchenId }),
        ...(formData.plannedStartTime && { plannedStartTime: new Date(formData.plannedStartTime).toISOString() }),
        ...(formData.plannedEndTime && { plannedEndTime: new Date(formData.plannedEndTime).toISOString() }),
        notes: formData.notes || null
      }

      const response = await fetch('/api/production-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create production plan')
      }

      const result = await response.json()
      toast.success('Production plan created successfully')
      router.push(`/dashboard/production-plans/${result.id}`)
    } catch (error: any) {
      console.error('Error creating production plan:', error)
      toast.error(error.message || 'Failed to create production plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          size="icon"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Production Plan</h1>
          <p className="text-muted-foreground">
            Create a new food production plan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter basic information for the production plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="planDate">Plan Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="planDate"
                    type="date"
                    value={formData.planDate}
                    onChange={(e) => handleInputChange('planDate', e.target.value)}
                    className="pl-8"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetPortions">Target Portions <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="targetPortions"
                    type="number"
                    min="1"
                    value={formData.targetPortions}
                    onChange={(e) => handleInputChange('targetPortions', e.target.value)}
                    placeholder="e.g., 500"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="menuId">Menu</Label>
              <Select value={formData.menuId} onValueChange={(value) => handleInputChange('menuId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select menu (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No menu</SelectItem>
                  {menus.map((menu) => {
                    console.log('Rendering menu:', menu.name);
                    return (
                      <SelectItem key={menu.id} value={menu.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{menu.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {menu.mealType} - {menu.targetGroup}
                            {menu.totalCalories && ` (${menu.totalCalories} kcal)`}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Schedule</CardTitle>
            <CardDescription>
              Set the planned start and end times for production
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plannedStartTime">Planned Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="plannedStartTime"
                    type="datetime-local"
                    value={formData.plannedStartTime}
                    onChange={(e) => handleInputChange('plannedStartTime', e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plannedEndTime">Planned End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="plannedEndTime"
                    type="datetime-local"
                    value={formData.plannedEndTime}
                    onChange={(e) => handleInputChange('plannedEndTime', e.target.value)}
                    min={formData.plannedStartTime}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {formData.plannedStartTime && formData.plannedEndTime && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Planned Duration:</strong> {
                    Math.round((new Date(formData.plannedEndTime).getTime() - new Date(formData.plannedStartTime).getTime()) / (1000 * 60 * 60 * 100)) / 10
                  } hours
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Add notes or other important information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kitchenId">Kitchen ID</Label>
              <Input
                id="kitchenId"
                value={formData.kitchenId}
                onChange={(e) => handleInputChange('kitchenId', e.target.value)}
                placeholder="Enter kitchen ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter production plan notes..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Production Plan
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
