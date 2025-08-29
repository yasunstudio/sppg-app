"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function EditResourceStatusPage() {
  const router = useRouter()
  const params = useParams()
  const resourceId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingResource, setIsLoadingResource] = useState(true)
  const [resource, setResource] = useState<any>(null)
  const [formData, setFormData] = useState({
    status: "",
    notes: ""
  })

  useEffect(() => {
    fetchResource()
  }, [resourceId])

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/production/resources/${resourceId}`)
      if (!response.ok) throw new Error("Failed to fetch resource")
      
      const data = await response.json()
      setResource(data.data)
      setFormData({
        status: data.data.status,
        notes: data.data.notes || ""
      })
    } catch (error) {
      console.error("Error fetching resource:", error)
      toast.error("Failed to load resource")
    } finally {
      setIsLoadingResource(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/production/resources/${resourceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update resource status")
      }

      toast.success("Resource status updated successfully")
      router.push("/dashboard/production/resources")
    } catch (error) {
      console.error("Error updating resource:", error)
      toast.error("Failed to update resource status")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingResource) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading resource...</div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-red-600">Resource not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Resource Status</h1>
          <p className="text-muted-foreground">
            Update status for {resource.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Status Update</CardTitle>
          <CardDescription>
            Change the current status and add notes if needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{resource.name}</h3>
                <p className="text-muted-foreground">
                  {resource.type} • {resource.location || 'No location'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Current Status: <span className="font-medium">{resource.status}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                                    <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="IN_USE">In Use</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Add notes about this status change..."
                  rows={3}
                />
              </div>
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
                Update Status
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
