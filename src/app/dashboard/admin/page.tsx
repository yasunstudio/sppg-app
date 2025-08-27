import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Activity,
  AlertTriangle
} from "lucide-react"

// Get real-time system metrics
async function getSystemMetrics() {
  try {
    const [
      totalUsers,
      totalSchools,
      totalStudents,
      totalSuppliers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.school.count(),
      prisma.student.count(),
      prisma.supplier.count()
    ])

    return {
      totalUsers,
      totalSchools,
      totalStudents,
      totalSuppliers,
      systemHealth: {
        database: "healthy",
        api: "healthy", 
        storage: "warning"
      }
    }
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return {
      totalUsers: 0,
      totalSchools: 0,
      totalStudents: 0,
      totalSuppliers: 0,
      systemHealth: {
        database: "error",
        api: "error",
        storage: "error"
      }
    }
  }
}

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/login')
  }

  // Check if user has admin access
  const userRole = session.user?.role
  const hasAdminAccess = userRole && ['ADMIN', 'KEPALA_SPPG'].includes(userRole)

  if (!hasAdminAccess) {
    redirect('/dashboard')
  }

  const metrics = await getSystemMetrics()

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-3 rounded shadow-sm border-0">
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-700">{metrics.totalUsers.toLocaleString()}</span>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-3 rounded shadow-sm border-0">
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-700">{metrics.totalSchools.toLocaleString()}</span>
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-3 rounded shadow-sm border-0">
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-700">{metrics.totalStudents.toLocaleString()}</span>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-3 rounded shadow-sm border-0">
          <div className="flex items-center justify-between">
            <span className="text-lg text-orange-600">3</span>
            <AlertTriangle className="h-5 w-5 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="bg-white p-3 rounded shadow-sm border-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <Database className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700">Online</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <Shield className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-yellow-700">78%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded shadow-sm border-0">
          <div className="grid grid-cols-2 gap-2">
            <button className="h-12 flex items-center justify-center bg-gray-50 hover:bg-blue-50 rounded">
              <Users className="h-4 w-4 text-gray-600" />
            </button>
            <button className="h-12 flex items-center justify-center bg-gray-50 hover:bg-green-50 rounded">
              <Shield className="h-4 w-4 text-gray-600" />
            </button>
            <button className="h-12 flex items-center justify-center bg-gray-50 hover:bg-purple-50 rounded">
              <Database className="h-4 w-4 text-gray-600" />
            </button>
            <button className="h-12 flex items-center justify-center bg-gray-50 hover:bg-orange-50 rounded">
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div className="mt-2 space-y-1">
            <button className="w-full h-8 bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-center">
              <Settings className="h-3 w-3 text-gray-600" />
            </button>
            <button className="w-full h-8 bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-center">
              <BarChart3 className="h-3 w-3 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded shadow-sm border-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">john.doe@example.com</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Database backup</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Failed login attempts</span>
          </div>
        </div>
      </div>
    </div>
  )
}
