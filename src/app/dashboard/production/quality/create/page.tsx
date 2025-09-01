"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

const checkpointTypes = [
  { value: "RAW_MATERIAL_INSPECTION", label: "Inspeksi Bahan Baku" },
  { value: "COOKING_PROCESS", label: "Proses Memasak" },
  { value: "FINAL_INSPECTION", label: "Inspeksi Akhir" },
  { value: "PACKAGING_CHECK", label: "Pemeriksaan Kemasan" },
  { value: "TEMPERATURE_MONITORING", label: "Monitoring Suhu" },
  { value: "TASTE_TEST", label: "Tes Rasa" },
  { value: "TEXTURE_EVALUATION", label: "Evaluasi Tekstur" },
  { value: "HYGIENE_CHECK", label: "Pemeriksaan Hygiene" }
]

const statusOptions = [
  { value: "PASS", label: "Pass" },
  { value: "FAIL", label: "Fail" },
  { value: "CONDITIONAL", label: "Conditional" },
  { value: "PENDING", label: "Pending" },
  { value: "REWORK_REQUIRED", label: "Rework Required" }
]

async function fetchProductionPlans() {
  const response = await fetch("/api/production-plans")
  if (!response.ok) throw new Error("Failed to fetch production plans")
  const result = await response.json()
  return result.data || []
}

async function fetchProductionBatches() {
  const response = await fetch("/api/production/batches")
  if (!response.ok) throw new Error("Failed to fetch production batches")
  const result = await response.json()
  return result.data || []
}

async function fetchUsers() {
  const response = await fetch("/api/users")
  if (!response.ok) throw new Error("Failed to fetch users")
  const result = await response.json()
  return result.data || []
}

export default function CreateQualityCheckpointPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    productionPlanId: "",
    batchId: "",
    checkpointType: "",
    status: "",
    temperature: "",
    visualInspection: "",
    tasteTest: "",
    textureEvaluation: "",
    correctiveAction: "",
    notes: "",
    checkedBy: ""
  })

  const { data: productionPlans = [] } = useQuery({
    queryKey: ["production-plans"],
    queryFn: fetchProductionPlans
  })

  const { data: productionBatches = [] } = useQuery({
    queryKey: ["production-batches"],
    queryFn: fetchProductionBatches
  })

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  })

  const handleCreateCheckpoint = async (data: any) => {
    const response = await fetch("/api/production/quality-checkpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error("Failed to create checkpoint")
    return response.json()
  }

  const createMutation = useMutation({
    mutationFn: handleCreateCheckpoint,
    onSuccess: () => {
      alert("Quality checkpoint created successfully!")
      router.push("/dashboard/production/quality")
    },
    onError: (error) => {
      alert(`Error creating checkpoint: ${error.message}`)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      productionPlanId: formData.productionPlanId || null,
      batchId: formData.batchId || null
    }

    createMutation.mutate(submitData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/production/quality">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quality Control
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Quality Checkpoint</h1>
          <p className="text-muted-foreground">
            Add a new quality control checkpoint to monitor production standards
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quality Checkpoint Details</CardTitle>
          <CardDescription>
            Fill in the details for the new quality checkpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productionPlanId">Production Plan (Optional)</Label>
                <Select value={formData.productionPlanId} onValueChange={(value) => handleInputChange("productionPlanId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select production plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {productionPlans.map((plan: any) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.menu?.name} - {new Date(plan.planDate).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchId">Production Batch (Optional)</Label>
                <Select value={formData.batchId} onValueChange={(value) => handleInputChange("batchId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select production batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {productionBatches.map((batch: any) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.batchNumber} - {batch.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkpointType">Checkpoint Type *</Label>
                <Select value={formData.checkpointType} onValueChange={(value) => handleInputChange("checkpointType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select checkpoint type" />
                  </SelectTrigger>
                  <SelectContent>
                    {checkpointTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkedBy">Checked By *</Label>
                <Select value={formData.checkedBy} onValueChange={(value) => handleInputChange("checkedBy", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select checker" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 65.5"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visualInspection">Visual Inspection</Label>
                <Textarea
                  id="visualInspection"
                  placeholder="Describe visual inspection results..."
                  value={formData.visualInspection}
                  onChange={(e) => handleInputChange("visualInspection", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tasteTest">Taste Test</Label>
                <Textarea
                  id="tasteTest"
                  placeholder="Describe taste test results..."
                  value={formData.tasteTest}
                  onChange={(e) => handleInputChange("tasteTest", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textureEvaluation">Texture Evaluation</Label>
                <Textarea
                  id="textureEvaluation"
                  placeholder="Describe texture evaluation results..."
                  value={formData.textureEvaluation}
                  onChange={(e) => handleInputChange("textureEvaluation", e.target.value)}
                />
              </div>

              {(formData.status === "FAIL" || formData.status === "REWORK_REQUIRED") && (
                <div className="space-y-2">
                  <Label htmlFor="correctiveAction">Corrective Action *</Label>
                  <Textarea
                    id="correctiveAction"
                    placeholder="Describe required corrective actions..."
                    value={formData.correctiveAction}
                    onChange={(e) => handleInputChange("correctiveAction", e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes or observations..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={createMutation.isPending || !formData.checkpointType || !formData.status || !formData.checkedBy}
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Create Checkpoint
              </Button>
              <Link href="/dashboard/production/quality">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
