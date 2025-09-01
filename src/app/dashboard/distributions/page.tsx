import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  School, 
  Truck, 
  Eye, 
  Plus,
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export const metadata: Metadata = {
  title: 'Distribution Overview | SPPG Dashboard',
  description: 'Overview of distribution management and tracking'
}

export default function DistributionsOverviewPage() {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.view">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Distribution Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track food distribution to schools
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  Active distribution points
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">18 completed</span> • 6 pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portions</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,230</div>
                <p className="text-xs text-muted-foreground">
                  Planned for today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days average
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Distribution Schools */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <School className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Distribution Schools</CardTitle>
                    <CardDescription>
                      Manage school-specific distribution tracking
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Schools</span>
                  <Badge variant="secondary">156</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Today's Routes</span>
                  <Badge variant="outline">12</Badge>
                </div>
                <Link href="/dashboard/distributions/schools">
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Manage Schools
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Delivery Tracking */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Delivery Tracking</CardTitle>
                    <CardDescription>
                      Real-time delivery monitoring and updates
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Deliveries</span>
                  <Badge variant="secondary">6</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completed Today</span>
                  <Badge className="bg-green-100 text-green-800">18</Badge>
                </div>
                <Link href="/dashboard/distributions/tracking">
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Track Deliveries
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Route Planning */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Route Planning</CardTitle>
                    <CardDescription>
                      Optimize delivery routes and schedules
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Routes</span>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Avg. Efficiency</span>
                  <Badge className="bg-blue-100 text-blue-800">92%</Badge>
                </div>
                <Link href="/dashboard/distributions/routes">
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Plan Routes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common distribution management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EnhancedPermissionGuard permission="distribution_schools.create">
                    <Link href="/dashboard/distributions/schools/new">
                      <Button className="w-full h-20 flex-col space-y-2">
                        <Plus className="h-6 w-6" />
                        <span>Create Distribution Schools</span>
                      </Button>
                    </Link>
                  </EnhancedPermissionGuard>
                  
                  <Link href="/dashboard/distributions/tracking">
                    <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                      <Eye className="h-6 w-6" />
                      <span>View Active Deliveries</span>
                    </Button>
                  </Link>
                  
                  <Link href="/dashboard/distributions/routes">
                    <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                      <Calendar className="h-6 w-6" />
                      <span>Plan Tomorrow's Routes</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EnhancedPermissionGuard>
  )
}
