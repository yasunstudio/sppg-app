"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, Filter } from "lucide-react"
import Link from "next/link"

async function fetchQualityCheckpoints() {
  const response = await fetch("/api/production/quality-checkpoints?limit=100")
  if (!response.ok) throw new Error("Failed to fetch quality checkpoints")
  const result = await response.json()
  return result.data || []
}

async function fetchQualityStandards() {
  const response = await fetch("/api/production/quality-standards?isActive=true")
  if (!response.ok) throw new Error("Failed to fetch quality standards")
  const result = await response.json()
  return result.data || []
}

const reportTypes = [
  { value: "daily", label: "Daily Report" },
  { value: "weekly", label: "Weekly Report" },
  { value: "monthly", label: "Monthly Report" },
  { value: "custom", label: "Custom Range" }
]

const reportFormats = [
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "excel", label: "Excel", icon: BarChart3 },
  { value: "csv", label: "CSV", icon: FileText }
]

export default function QualityReportsPage() {
  const [reportType, setReportType] = useState("daily")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [format, setFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  const { data: qualityCheckpoints = [], isLoading } = useQuery({
    queryKey: ["quality-checkpoints"],
    queryFn: fetchQualityCheckpoints
  })

  const { data: qualityStandards = [] } = useQuery({
    queryKey: ["quality-standards"],
    queryFn: fetchQualityStandards
  })

  // Calculate analytics
  const totalCheckpoints = qualityCheckpoints.length
  const passedCheckpoints = qualityCheckpoints.filter((qc: any) => qc.status === "PASS").length
  const failedCheckpoints = qualityCheckpoints.filter((qc: any) => qc.status === "FAIL").length
  const pendingCheckpoints = qualityCheckpoints.filter((qc: any) => qc.status === "PENDING").length
  const passRate = totalCheckpoints > 0 ? (passedCheckpoints / totalCheckpoints) * 100 : 0

  // Group checkpoints by type
  const checkpointsByType = qualityCheckpoints.reduce((acc: any, checkpoint: any) => {
    const type = checkpoint.checkpointType || "Unknown"
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  // Calculate compliance by category
  const complianceByCategory = qualityStandards.reduce((acc: any, standard: any) => {
    const category = standard.category || "Other"
    const compliance = (standard.currentValue / standard.targetValue) * 100
    
    if (!acc[category]) {
      acc[category] = { total: 0, count: 0, standards: [] }
    }
    
    acc[category].total += compliance
    acc[category].count += 1
    acc[category].standards.push(standard)
    
    return acc
  }, {})

  Object.keys(complianceByCategory).forEach(category => {
    complianceByCategory[category].average = complianceByCategory[category].total / complianceByCategory[category].count
  })

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real app, this would call API to generate report
    const reportData = {
      type: reportType,
      format,
      startDate: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      data: {
        totalCheckpoints,
        passRate,
        failedCheckpoints,
        complianceByCategory
      }
    }

    console.log("Generated report:", reportData)
    alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`)
    
    setIsGenerating(false)
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Quality Control Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive quality control reports and analytics
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>
                Configure your quality control report parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {reportType === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Export Format</Label>
                <div className="grid grid-cols-3 gap-2">
                  {reportFormats.map((fmt) => {
                    const Icon = fmt.icon
                    return (
                      <Button
                        key={fmt.value}
                        variant={format === fmt.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormat(fmt.value)}
                        className="flex flex-col items-center space-y-1 h-auto py-3"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{fmt.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Checkpoints</span>
                  <span className="font-semibold">{totalCheckpoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pass Rate</span>
                  <span className="font-semibold text-green-600">{passRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Failed Checks</span>
                  <span className="font-semibold text-red-600">{failedCheckpoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending Reviews</span>
                  <span className="font-semibold text-yellow-600">{pendingCheckpoints}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="checkpoints">Checkpoints</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5" />
                      <span>Quality Status Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Passed</span>
                        </div>
                        <span className="font-semibold">{passedCheckpoints}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Failed</span>
                        </div>
                        <span className="font-semibold">{failedCheckpoints}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Pending</span>
                        </div>
                        <span className="font-semibold">{pendingCheckpoints}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Performance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Overall Pass Rate</span>
                          <span className="text-sm font-medium">{passRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${passRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Quality Score</span>
                          <span className="text-sm font-medium">87.5/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "87.5%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="checkpoints" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Checkpoint Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(checkpointsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{type.replace(/_/g, ' ')}</span>
                        <Badge variant="outline">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standards Compliance by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(complianceByCategory).map(([category, data]: [string, any]) => (
                      <div key={category}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{category.replace(/_/g, ' ')}</span>
                          <span className="text-sm">{data.average.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${data.average >= 95 ? 'bg-green-500' : data.average >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(data.average, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Trends</CardTitle>
                  <CardDescription>
                    Historical quality performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                    <p>Trend analysis chart would be displayed here</p>
                    <p className="text-sm mt-2">Showing quality metrics over the selected time period</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
