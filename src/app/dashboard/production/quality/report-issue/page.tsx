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
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertTriangle, Upload, Loader2, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

const issuePriorities = [
  { value: "LOW", label: "Low", color: "bg-blue-100 text-blue-800" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "HIGH", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "CRITICAL", label: "Critical", color: "bg-red-100 text-red-800" }
]

const issueCategories = [
  { value: "TEMPERATURE_DEVIATION", label: "Temperature Deviation" },
  { value: "CONTAMINATION", label: "Contamination" },
  { value: "EQUIPMENT_FAILURE", label: "Equipment Failure" },
  { value: "HYGIENE_VIOLATION", label: "Hygiene Violation" },
  { value: "FOOD_QUALITY", label: "Food Quality Issue" },
  { value: "PORTION_VARIANCE", label: "Portion Variance" },
  { value: "SAFETY_HAZARD", label: "Safety Hazard" },
  { value: "DOCUMENTATION_ERROR", label: "Documentation Error" },
  { value: "OTHER", label: "Other" }
]

async function fetchProductionPlans() {
  const response = await fetch("/api/production/plans")
  if (!response.ok) throw new Error("Failed to fetch production plans")
  const result = await response.json()
  return result.data || []
}

async function fetchUsers() {
  const response = await fetch("/api/users")
  if (!response.ok) throw new Error("Failed to fetch users")
  const result = await response.json()
  return result.data || []
}

// Mock recent issues - in real app this would come from API
const recentIssues = [
  {
    id: "1",
    title: "Temperature Deviation in Cold Storage",
    category: "TEMPERATURE_DEVIATION",
    priority: "HIGH",
    status: "OPEN",
    reportedBy: "Dra. Fatimah Ahmad, S.Gz",
    reportedAt: "2025-08-28T09:30:00Z",
    description: "Cold storage temperature rose to 8°C, exceeding safe limit"
  },
  {
    id: "2", 
    title: "Foreign Object Found in Vegetables",
    category: "CONTAMINATION",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    reportedBy: "Chef Ahmad Subhan",
    reportedAt: "2025-08-28T11:15:00Z",
    description: "Small plastic piece found during vegetable preparation"
  },
  {
    id: "3",
    title: "Hand Washing Station Empty",
    category: "HYGIENE_VIOLATION", 
    priority: "MEDIUM",
    status: "RESOLVED",
    reportedBy: "Supervisor Budi",
    reportedAt: "2025-08-27T14:20:00Z",
    description: "Soap dispenser empty at main hand washing station"
  }
]

export default function ReportIssuePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    productionPlanId: "",
    description: "",
    immediateAction: "",
    reportedBy: ""
  })

  const { data: productionPlans = [] } = useQuery({
    queryKey: ["production-plans"],
    queryFn: fetchProductionPlans
  })

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  })

  const createIssue = useMutation({
    mutationFn: async (data: any) => {
      // In real app, this would POST to /api/quality/issues
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      return { success: true, id: Math.random().toString(36).substr(2, 9) }
    },
    onSuccess: () => {
      alert("Quality issue has been reported successfully")
      router.push("/dashboard/production/quality")
    },
    onError: () => {
      alert("Failed to report issue")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createIssue.mutate(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Clock className="h-4 w-4" />
      case "IN_PROGRESS":
        return <AlertTriangle className="h-4 w-4" />
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    return issuePriorities.find(p => p.value === priority)?.color || "bg-gray-100 text-gray-800"
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
          <h1 className="text-3xl font-bold tracking-tight">Report Quality Issue</h1>
          <p className="text-muted-foreground">
            Report quality control issues and track their resolution
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
              <CardDescription>
                Provide detailed information about the quality issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue category" />
                      </SelectTrigger>
                      <SelectContent>
                        {issueCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        {issuePriorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productionPlanId">Related Production Plan</Label>
                    <Select value={formData.productionPlanId} onValueChange={(value) => handleInputChange("productionPlanId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select production plan (if applicable)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {productionPlans.map((plan: any) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.menu?.name} - {new Date(plan.planDate).toLocaleDateString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="reportedBy">Reported By *</Label>
                    <Select value={formData.reportedBy} onValueChange={(value) => handleInputChange("reportedBy", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reporter" />
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
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of the issue, including when and where it occurred..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="immediateAction">Immediate Action Taken</Label>
                    <Textarea
                      id="immediateAction"
                      placeholder="Describe any immediate actions taken to address the issue..."
                      value={formData.immediateAction}
                      onChange={(e) => handleInputChange("immediateAction", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={createIssue.isPending || !formData.title || !formData.category || !formData.priority || !formData.description || !formData.reportedBy}
                  >
                    {createIssue.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 mr-2" />
                    )}
                    Report Issue
                  </Button>
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Attach Photos
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Issues */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>
                Recently reported quality issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <Card key={issue.id}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm">{issue.title}</h4>
                          <Badge className={getPriorityColor(issue.priority)}>
                            {issue.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {issue.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(issue.status)}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(issue.status)}
                              <span>{issue.status.replace('_', ' ')}</span>
                            </span>
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(issue.reportedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          By: {issue.reportedBy}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Issue Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Open Issues</span>
                  <span className="font-semibold">{recentIssues.filter(i => i.status === 'OPEN').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">In Progress</span>
                  <span className="font-semibold">{recentIssues.filter(i => i.status === 'IN_PROGRESS').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Resolved Today</span>
                  <span className="font-semibold">{recentIssues.filter(i => i.status === 'RESOLVED').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Critical Issues</span>
                  <span className="font-semibold text-red-600">{recentIssues.filter(i => i.priority === 'CRITICAL').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
