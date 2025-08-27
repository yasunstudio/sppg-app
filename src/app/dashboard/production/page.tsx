"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, ChefHat, Factory, TrendingUp, AlertTriangle, CheckCircle, Clock, Plus, Bot, Zap } from "lucide-react"
import Link from "next/link"

// Fetch production overview data
async function fetchProductionOverview() {
  const [plansRes, batchesRes, resourcesRes, qualityRes] = await Promise.all([
    fetch("/api/production/plans?limit=5"),
    fetch("/api/production/batches?limit=5"),
    fetch("/api/production/resources?limit=10"),
    fetch("/api/production/quality-checkpoints?limit=10")
  ])

  const [plans, batches, resources, quality] = await Promise.all([
    plansRes.json(),
    batchesRes.json(),
    resourcesRes.json(),
    qualityRes.json()
  ])

  return {
    plans: plans.data || [],
    batches: batches.data || [],
    resources: resources.data || [],
    qualityCheckpoints: quality.data || []
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800"
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800"
    case "PLANNED":
      return "bg-gray-100 text-gray-800"
    case "CANCELLED":
      return "bg-red-100 text-red-800"
    case "PASS":
      return "bg-green-100 text-green-800"
    case "FAIL":
      return "bg-red-100 text-red-800"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProductionPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["production-overview"],
    queryFn: fetchProductionOverview,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Production Management</h1>
        </div>
        <div className="text-center py-8">Loading production overview...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Production Management</h1>
        </div>
        <div className="text-center py-8 text-red-600">
          Error loading production data: {error.message}
        </div>
      </div>
    )
  }

  const { plans = [], batches = [], resources = [], qualityCheckpoints = [] } = data || {}

  // Calculate metrics
  const todayPlans = plans.filter((plan: any) => {
    const planDate = new Date(plan.planDate)
    const today = new Date()
    return planDate.toDateString() === today.toDateString()
  })
  
  const activeBatches = batches.filter((batch: any) => batch.status === "IN_PROGRESS")
  const todayPortions = todayPlans.reduce((total: number, plan: any) => total + plan.targetPortions, 0)
  const passedQuality = qualityCheckpoints.filter((check: any) => check.status === "PASS").length
  const totalQuality = qualityCheckpoints.length

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage your food production operations and quality control
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/production/ai-optimizer">
            <Button variant="outline" className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600">
              <Bot className="mr-2 h-4 w-4" />
              AI Recipe Optimizer
            </Button>
          </Link>
          <Link href="/dashboard/production/planning/create">
            <Button>
              <Factory className="mr-2 h-4 w-4" />
              New Production Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Production Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Production
            </CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPortions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              portions scheduled ({todayPlans.length} plans)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Batches
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBatches.length}</div>
            <p className="text-xs text-muted-foreground">
              currently in production
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quality Score
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalQuality > 0 ? Math.round((passedQuality / totalQuality) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              passed quality checks ({passedQuality}/{totalQuality})
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resource Efficiency
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              resource utilization rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Production Plans</TabsTrigger>
          <TabsTrigger value="batches">Active Batches</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Production Plans */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Production Plans</CardTitle>
                <Link href="/dashboard/production/planning">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plans.slice(0, 5).map((plan: any) => (
                    <div key={plan.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{plan.menu?.name || 'Unknown Menu'}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          {new Date(plan.planDate).toLocaleDateString('id-ID')}
                          <span className="mx-2">•</span>
                          <span>{plan.targetPortions} portions</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Production Batches */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Production Batches</CardTitle>
                <Link href="/dashboard/production/batches">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeBatches.slice(0, 5).map((batch: any) => (
                    <div key={batch.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Batch #{batch.batchNumber}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          Started: {new Date(batch.actualStartTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          <span className="mx-2">•</span>
                          <span>{batch.actualPortions || batch.plannedPortions} portions</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </div>
                  ))}
                  {activeBatches.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No active production batches
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common production management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/production/planning/create">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Production Plan
                  </Button>
                </Link>
                <Link href="/dashboard/production/batches">
                  <Button variant="outline" className="w-full justify-start">
                    <Factory className="mr-2 h-4 w-4" />
                    Monitor Batches
                  </Button>
                </Link>
                <Link href="/dashboard/production/quality">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Quality Control
                  </Button>
                </Link>
                <Link href="/dashboard/production/ai-optimizer">
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="mr-2 h-4 w-4" />
                    AI Optimization
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Production Plans</CardTitle>
              <Link href="/dashboard/production/planning">
                <Button variant="outline" size="sm">
                  Manage All Plans
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan: any) => (
                  <div key={plan.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{plan.menu?.name || 'Unknown Menu'}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {new Date(plan.planDate).toLocaleDateString('id-ID')}
                        <span className="mx-2">•</span>
                        <span>{plan.targetPortions} portions</span>
                        <span className="mx-2">•</span>
                        <span>{plan.kitchen?.name || 'Unknown Kitchen'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                      <Link href={`/dashboard/production/planning/${plan.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Production Batches</CardTitle>
              <Link href="/dashboard/production/batches">
                <Button variant="outline" size="sm">
                  Manage All Batches
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batches.map((batch: any) => (
                  <div key={batch.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Batch #{batch.batchNumber}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {batch.actualStartTime 
                          ? `Started: ${new Date(batch.actualStartTime).toLocaleString('id-ID')}`
                          : `Planned: ${new Date(batch.plannedStartTime).toLocaleString('id-ID')}`
                        }
                        <span className="mx-2">•</span>
                        <span>{batch.actualPortions || batch.plannedPortions} portions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                      <Link href={`/dashboard/production/batches/${batch.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quality Control Checkpoints</CardTitle>
              <Link href="/dashboard/production/quality">
                <Button variant="outline" size="sm">
                  Manage Quality Control
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityCheckpoints.map((checkpoint: any) => (
                  <div key={checkpoint.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{checkpoint.checkType}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(checkpoint.checkDate).toLocaleString('id-ID')}
                        <span className="mx-2">•</span>
                        <span>Batch #{checkpoint.batch?.batchNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(checkpoint.status)}>
                        {checkpoint.status}
                      </Badge>
                      {checkpoint.status === "FAIL" && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Resource Management</CardTitle>
              <Link href="/dashboard/production/resources">
                <Button variant="outline" size="sm">
                  Manage Resources
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources.map((resource: any) => (
                  <div key={resource.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{resource.resourceType}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>Available: {resource.availableQuantity || 0}</span>
                        <span className="mx-2">•</span>
                        <span>Reserved: {resource.reservedQuantity || 0}</span>
                      </div>
                    </div>
                    <Badge variant={resource.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                      {resource.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
