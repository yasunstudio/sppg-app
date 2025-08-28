"use client"

import { use } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type FormData = {
  status: string
  temperature?: number
  visualInspection?: string
  tasteTest?: string
  textureEvaluation?: string
  correctiveAction?: string
  notes?: string
}

async function fetchQualityCheckpoint(id: string) {
  const response = await fetch(`/api/quality/checkpoints/${id}`)
  if (!response.ok) throw new Error("Failed to fetch quality checkpoint")
  return response.json()
}

async function updateQualityCheckpoint(id: string, data: FormData) {
  const response = await fetch(`/api/quality/checkpoints/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error("Failed to update checkpoint")
  return response.json()
}

export default function EditQualityCheckpointPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  
  const { data: checkpoint, isLoading, error } = useQuery({
    queryKey: ["quality-checkpoint", id],
    queryFn: () => fetchQualityCheckpoint(id)
  })

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>()

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateQualityCheckpoint(id, data),
    onSuccess: () => {
      alert("Quality checkpoint updated successfully!")
      router.push(`/dashboard/production/quality/checkpoints/${id}`)
    },
    onError: (error) => {
      alert(`Error updating checkpoint: ${error.message}`)
    }
  })

  // Set form values when checkpoint data loads
  if (checkpoint && !watch("status")) {
    setValue("status", checkpoint.status)
    setValue("temperature", checkpoint.temperature)
    setValue("visualInspection", checkpoint.visualInspection || "")
    setValue("tasteTest", checkpoint.tasteTest || "")
    setValue("textureEvaluation", checkpoint.textureEvaluation || "")
    setValue("correctiveAction", checkpoint.correctiveAction || "")
    setValue("notes", checkpoint.notes || "")
  }

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkpoint
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Quality Checkpoint</h1>
          </div>
        </div>
        <div className="text-center py-8">Loading checkpoint details...</div>
      </div>
    )
  }

  if (error || !checkpoint) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkpoint
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Quality Checkpoint</h1>
          </div>
        </div>
        <div className="text-center py-8 text-red-600">
          Error loading checkpoint: {error?.message || "Checkpoint not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkpoint
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Quality Checkpoint</h1>
          <p className="text-muted-foreground">
            {checkpoint.checkpointType?.replace(/_/g, ' ')} - {checkpoint.productionPlan?.menu?.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Checkpoint Status</CardTitle>
                <CardDescription>
                  Update the status and basic information of this quality checkpoint
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={watch("status")}
                      onValueChange={(value) => setValue("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PASS">Pass</SelectItem>
                        <SelectItem value="FAIL">Fail</SelectItem>
                        <SelectItem value="CONDITIONAL">Conditional</SelectItem>
                        <SelectItem value="REWORK_REQUIRED">Rework Required</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-600 mt-1">Status is required</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 72.5"
                      {...register("temperature", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Evaluations</CardTitle>
                <CardDescription>
                  Update the detailed quality evaluation results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="visualInspection">Visual Inspection</Label>
                  <Textarea
                    id="visualInspection"
                    placeholder="Describe visual appearance, color, texture..."
                    className="min-h-[80px]"
                    {...register("visualInspection")}
                  />
                </div>

                <div>
                  <Label htmlFor="tasteTest">Taste Test</Label>
                  <Textarea
                    id="tasteTest"
                    placeholder="Describe taste, seasoning, flavor balance..."
                    className="min-h-[80px]"
                    {...register("tasteTest")}
                  />
                </div>

                <div>
                  <Label htmlFor="textureEvaluation">Texture Evaluation</Label>
                  <Textarea
                    id="textureEvaluation"
                    placeholder="Describe texture, consistency, mouthfeel..."
                    className="min-h-[80px]"
                    {...register("textureEvaluation")}
                  />
                </div>

                <div>
                  <Label htmlFor="correctiveAction">Corrective Action Required</Label>
                  <Textarea
                    id="correctiveAction"
                    placeholder="Describe any corrective actions needed..."
                    className="min-h-[80px]"
                    {...register("correctiveAction")}
                  />
                  {watch("correctiveAction") && (
                    <div className="flex items-center space-x-2 mt-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">
                        This checkpoint will be flagged for follow-up
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional observations or comments..."
                    className="min-h-[80px]"
                    {...register("notes")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Checkpoint Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="text-sm mt-1">{checkpoint.checkpointType?.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-sm mt-1">{new Date(checkpoint.checkedAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Checked By</Label>
                  <p className="text-sm mt-1">{checkpoint.checker?.name || 'Unknown'}</p>
                </div>
                {checkpoint.productionPlan && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Production Plan</Label>
                    <p className="text-sm mt-1">{checkpoint.productionPlan.menu?.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(checkpoint.productionPlan.planDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Link href={`/dashboard/production/quality/checkpoints/${id}`}>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <strong className="text-green-800">Pass:</strong> Meets all quality standards
                  </div>
                  <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                    <strong className="text-yellow-800">Conditional:</strong> Minor issues, acceptable with monitoring
                  </div>
                  <div className="p-2 bg-red-50 rounded border border-red-200">
                    <strong className="text-red-800">Fail:</strong> Does not meet standards, reject
                  </div>
                  <div className="p-2 bg-orange-50 rounded border border-orange-200">
                    <strong className="text-orange-800">Rework:</strong> Correctable issues identified
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
