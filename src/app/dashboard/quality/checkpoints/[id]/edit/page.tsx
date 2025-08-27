"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

const checkpointTypes = {
  "RAW_MATERIAL_INSPECTION": "Inspeksi Bahan Baku",
  "COOKING_PROCESS": "Proses Memasak", 
  "FINAL_INSPECTION": "Inspeksi Akhir",
  "PACKAGING_CHECK": "Pemeriksaan Kemasan",
  "TEMPERATURE_MONITORING": "Monitoring Suhu",
  "TASTE_TEST": "Tes Rasa",
  "TEXTURE_EVALUATION": "Evaluasi Tekstur",
  "HYGIENE_CHECK": "Pemeriksaan Hygiene"
}

const qualityStatuses = {
  "PASS": "Pass",
  "FAIL": "Fail", 
  "CONDITIONAL": "Conditional",
  "PENDING": "Pending",
  "REWORK_REQUIRED": "Rework Required"
}

export default function EditQualityCheckpointPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const id = params.id as string

  const [formData, setFormData] = useState({
    checkpointType: "",
    status: "",
    productionPlanId: "none",
    batchId: "none",
    temperature: "",
    visualInspection: "",
    tasteTest: "",
    textureEvaluation: "",
    correctiveAction: "",
    notes: ""
  })

  // Fetch current checkpoint data
  const { data: checkpoint, isLoading: isLoadingCheckpoint } = useQuery({
    queryKey: ["quality-checkpoint", id],
    queryFn: async () => {
      const response = await fetch(`/api/quality/checkpoints/${id}`)
      if (!response.ok) throw new Error("Failed to fetch quality checkpoint")
      return response.json()
    },
    enabled: !!id
  })

  // Fetch production plans for dropdown
  const { data: productionPlans = [] } = useQuery({
    queryKey: ["production-plans"],
    queryFn: async () => {
      const response = await fetch("/api/production/plans")
      if (!response.ok) throw new Error("Failed to fetch production plans")
      return response.json()
    }
  })

  // Fetch production batches for dropdown
  const { data: productionBatches = [] } = useQuery({
    queryKey: ["production-batches"],
    queryFn: async () => {
      const response = await fetch("/api/production/batches")
      if (!response.ok) throw new Error("Failed to fetch production batches")
      return response.json()
    }
  })

  // Populate form when checkpoint data loads
  useEffect(() => {
    if (checkpoint) {
      setFormData({
        checkpointType: checkpoint.checkpointType || "",
        status: checkpoint.status || "",
        productionPlanId: checkpoint.productionPlanId || "none",
        batchId: checkpoint.batchId || "none",
        temperature: checkpoint.temperature?.toString() || "",
        visualInspection: checkpoint.visualInspection || "",
        tasteTest: checkpoint.tasteTest || "",
        textureEvaluation: checkpoint.textureEvaluation || "",
        correctiveAction: checkpoint.correctiveAction || "",
        notes: checkpoint.notes || ""
      })
    }
  }, [checkpoint])

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/quality/checkpoints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update quality checkpoint")
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality-checkpoints"] })
      queryClient.invalidateQueries({ queryKey: ["quality-checkpoint", id] })
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Success",
        description: "Quality checkpoint updated successfully",
      })
      router.push(`/dashboard/quality/checkpoints/${id}`)
    },
    onError: (error: Error) => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: error.message,
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.checkpointType || !formData.status) {
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Validation Error",
        description: "Please fill in required fields: Checkpoint Type and Status",
      })
      return
    }

    const submitData = {
      ...formData,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      productionPlanId: formData.productionPlanId === "none" ? null : formData.productionPlanId || null,
      batchId: formData.batchId === "none" ? null : formData.batchId || null
    }

    updateMutation.mutate(submitData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isLoadingCheckpoint) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <Card>
            <CardContent className="py-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!checkpoint) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Quality Checkpoint Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The quality checkpoint you're looking for doesn't exist.
              </p>
              <Link href="/dashboard/quality">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Quality Control
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/dashboard/quality/checkpoints/${id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Quality Checkpoint</h1>
          <p className="text-muted-foreground">Update quality checkpoint information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription className="text-sm">Essential details for the quality checkpoint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkpointType">Checkpoint Type *</Label>
                <Select value={formData.checkpointType} onValueChange={(value) => handleInputChange("checkpointType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select checkpoint type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(checkpointTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(qualityStatuses).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productionPlan">Production Plan</Label>
                <Select value={formData.productionPlanId} onValueChange={(value) => handleInputChange("productionPlanId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select production plan (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Production Plan</SelectItem>
                    {productionPlans && Array.isArray(productionPlans) && productionPlans.map((plan: any) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.menu?.name || `Plan ${plan.id}`} - {new Date(plan.planDate).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="batch">Production Batch</Label>
                <Select value={formData.batchId} onValueChange={(value) => handleInputChange("batchId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Batch</SelectItem>
                    {productionBatches && Array.isArray(productionBatches) && productionBatches.map((batch: any) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.batchNumber} - {batch.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="Enter temperature measurement"
                value={formData.temperature}
                onChange={(e) => handleInputChange("temperature", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quality Assessment */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quality Assessment</CardTitle>
            <CardDescription className="text-sm">Detailed quality evaluation results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="visualInspection">Visual Inspection</Label>
              <Textarea
                id="visualInspection"
                placeholder="Describe visual appearance, color, consistency, etc."
                value={formData.visualInspection}
                onChange={(e) => handleInputChange("visualInspection", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tasteTest">Taste Test</Label>
              <Textarea
                id="tasteTest"
                placeholder="Describe taste, flavor balance, seasoning, etc."
                value={formData.tasteTest}
                onChange={(e) => handleInputChange("tasteTest", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="textureEvaluation">Texture Evaluation</Label>
              <Textarea
                id="textureEvaluation"
                placeholder="Describe texture, consistency, mouthfeel, etc."
                value={formData.textureEvaluation}
                onChange={(e) => handleInputChange("textureEvaluation", e.target.value)}
                rows={3}
              />
            </div>

            {(formData.status === "FAIL" || formData.status === "CONDITIONAL" || formData.status === "REWORK_REQUIRED") && (
              <div>
                <Label htmlFor="correctiveAction">Corrective Action Required</Label>
                <Textarea
                  id="correctiveAction"
                  placeholder="Describe corrective actions needed to address issues"
                  value={formData.correctiveAction}
                  onChange={(e) => handleInputChange("correctiveAction", e.target.value)}
                  rows={3}
                  className="border-destructive focus:border-destructive"
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional observations or comments"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Link href={`/dashboard/quality/checkpoints/${id}`}>
            <Button variant="outline" type="button" className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={updateMutation.isPending} className="w-full sm:w-auto">
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Quality Checkpoint
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
