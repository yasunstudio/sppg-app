"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Users, DollarSign, Plus, Eye, Edit, ChefHat } from "lucide-react"

// Fetch production plans from API
async function fetchProductionPlans() {
  const response = await fetch("/api/production/plans?limit=20")
  if (!response.ok) {
    throw new Error("Failed to fetch production plans")
  }
  const data = await response.json()
  return data.data || []
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PLANNED":
      return "bg-blue-100 text-blue-800"
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800"
    case "COMPLETED":
      return "bg-green-100 text-green-800"
    case "CANCELLED":
      return "bg-red-100 text-red-800"
    case "ON_HOLD":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProductionPlanningPage() {
  const { data: productionPlans = [], isLoading, error } = useQuery({
    queryKey: ["production-plans"],
    queryFn: fetchProductionPlans,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Production Planning</h1>
        </div>
        <div className="text-center py-8">Loading production plans...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Production Planning</h1>
        </div>
        <div className="text-center py-8 text-red-600">
          Error loading production plans: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Planning</h1>
          <p className="text-muted-foreground">
            Kelola rencana produksi makanan untuk sekolah
          </p>
        </div>
                <div className="flex space-x-2">
          <Link href="/dashboard/menu-planning">
            <Button variant="outline">
              <ChefHat className="mr-2 h-4 w-4" />
              Lihat Menu Planning
            </Button>
          </Link>
          <Link href="/dashboard/production/planning/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Rencana Produksi
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionPlans.length}</div>
            <p className="text-xs text-muted-foreground">production plans</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productionPlans.filter((p: any) => p.status === "IN_PROGRESS").length}
            </div>
            <p className="text-xs text-muted-foreground">currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Portions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productionPlans.reduce((acc: number, p: any) => {
                const portions = p.targetPortions ?? 0;
                return acc + (typeof portions === 'number' ? portions : 0);
              }, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">total portions planned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productionPlans.filter((p: any) => p.status === "COMPLETED").length}
            </div>
            <p className="text-xs text-muted-foreground">plans completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Production Plans List */}
      <Card>
        <CardHeader>
          <CardTitle>Production Plans</CardTitle>
          <CardDescription>
            Manage and monitor production plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productionPlans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No production plans found. Create your first plan!
              </div>
            ) : (
              productionPlans.map((plan: any) => (
                <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <CalendarDays className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {plan.menu?.name || `Plan ${plan.id.slice(-4)}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(plan.planDate).toLocaleDateString()} • {plan.targetPortions} portions
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {plan.plannedStartTime ? 
                            new Date(plan.plannedStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                            'No start time'
                          } - {plan.plannedEndTime ? 
                            new Date(plan.plannedEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                            'No end time'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan.batches?.length || 0} batches
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/production/planning/${plan.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/production/planning/${plan.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
