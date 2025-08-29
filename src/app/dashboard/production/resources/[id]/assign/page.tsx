"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Fetch production batches for assignment
async function fetchProductionBatches() {
  const response = await fetch("/api/production/batches/for-assignment")
  if (!response.ok) {
    throw new Error("Failed to fetch production batches")
  }
  const data = await response.json()
  return data.data || []
}

export default function AssignToBatchPage() {
  const router = useRouter()
  const params = useParams()
  const resourceId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingResource, setIsLoadingResource] = useState(true)
  const [resource, setResource] = useState<any>(null)
  const [selectedBatchId, setSelectedBatchId] = useState("")
  const [notes, setNotes] = useState("")

  const { data: batches = [], isLoading: batchesLoading } = useQuery({
    queryKey: ["production-batches-for-assignment"],
    queryFn: fetchProductionBatches,
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
    } catch (error) {
      console.error("Error fetching resource:", error)
      toast.error("Failed to load resource")
    } finally {
      setIsLoadingResource(false)
    }
  }

  const handleAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/production/resources/${resourceId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchId: selectedBatchId,
          notes: notes
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign resource to batch")
      }

      toast.success("Resource assigned to batch successfully")
      router.push("/dashboard/production/resources")
    } catch (error) {
      console.error("Error assigning resource:", error)
      toast.error("Failed to assign resource to batch")
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
          <h1 className="text-3xl font-bold tracking-tight">Assign to Batch</h1>
          <p className="text-muted-foreground">
            Assign {resource.name} to a production batch
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resource Assignment</CardTitle>
              <CardDescription>
                Select a production batch to assign this resource
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignment} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{resource.name}</h3>
                    <p className="text-muted-foreground">
                      {resource.type} • {resource.location || 'No location'}
                    </p>
                    <Badge className="mt-2">
                      {resource.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Production Batch</label>
                    <Select 
                      value={selectedBatchId} 
                      onValueChange={setSelectedBatchId}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a production batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batchesLoading ? (
                          <SelectItem value="loading" disabled>Loading batches...</SelectItem>
                        ) : batches.length === 0 ? (
                          <SelectItem value="no-batches" disabled>No active batches found</SelectItem>
                        ) : (
                          batches.map((batch: any) => (
                            <SelectItem key={batch.id} value={batch.id}>
                              {batch.batchNumber} - {batch.recipe?.name || 'Unknown Recipe'}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assignment Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this assignment..."
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
                  <Button 
                    type="submit" 
                    disabled={isLoading || !selectedBatchId}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Assign Resource
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Available Batches</CardTitle>
              <CardDescription>
                Active production batches that can be assigned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {batchesLoading ? (
                  <div className="text-center py-4">Loading batches...</div>
                ) : batches.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No active batches available
                  </div>
                ) : (
                  batches.slice(0, 5).map((batch: any) => (
                    <div 
                      key={batch.id} 
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        selectedBatchId === batch.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedBatchId(batch.id)}
                    >
                      <div className="font-medium text-sm">{batch.batchNumber}</div>
                      <div className="text-xs text-muted-foreground">
                        {batch.recipe?.name || 'Unknown Recipe'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Quantity: {batch.plannedQuantity} portions
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {batch.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
