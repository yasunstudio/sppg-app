"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AddResourcePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    resourceType: "",
    status: "AVAILABLE",
    capacity: "",
    unit: "",
    location: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/production/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : null
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create resource")
      }

      toast.success("Resource created successfully")
      router.push("/dashboard/production/resources")
    } catch (error) {
      console.error("Error creating resource:", error)
      toast.error("Failed to create resource")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Resource</h1>
          <p className="text-muted-foreground">
            Create a new production resource (equipment or staff)
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Information</CardTitle>
          <CardDescription>
            Fill in the details for the new production resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Resource Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Industrial Oven #1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resourceType">Resource Type</Label>
                <Select 
                  value={formData.resourceType} 
                  onValueChange={(value) => handleInputChange("resourceType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="IN_USE">In Use</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="OUT_OF_ORDER">Out of Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Kitchen Area 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", e.target.value)}
                  placeholder="e.g., 100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  placeholder="e.g., portions/hour, kg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional information about this resource..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Create Resource
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
