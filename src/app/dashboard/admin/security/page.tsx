import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isAuthorizedAdmin } from '@/lib/auth-utils'
import { 
  Shield,
  Key,
  AlertTriangle,
  Activity,
  Lock
} from "lucide-react"

export default async function SecurityPage() {
  const session = await auth()

  if (!session?.user || !isAuthorizedAdmin(session)) {
    redirect('/auth/login')
  }  const securityMetrics = [
    { value: "24", icon: Activity, status: "normal" },
    { value: "3", icon: AlertTriangle, status: "warning" },
    { value: "98%", icon: Shield, status: "good" },
    { value: "12/15", icon: Lock, status: "normal" },
  ]

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon
          const getColor = (status: string) => {
            switch (status) {
              case "good": return "text-green-600"
              case "warning": return "text-orange-600"
              case "danger": return "text-red-600"
              default: return "text-gray-600"
            }
          }
          
          return (
            <div key={index} className="bg-white p-3 rounded shadow-sm border-0">
              <div className="flex items-center justify-between">
                <span className={`text-lg ${getColor(metric.status)}`}>
                  {metric.value}
                </span>
                <Icon className={`h-5 w-5 ${getColor(metric.status)}`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="bg-white p-3 rounded shadow-sm border-0">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Configure user roles, permissions, and access levels.
          </p>
          <button className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
            Manage
          </button>
        </div>

        <div className="bg-white p-3 rounded shadow-sm border-0">
          <div className="flex items-center space-x-2 mb-3">
            <Key className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Set password policies and authentication.
          </p>
          <button className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">
            Settings
          </button>
        </div>
      </div>

      <div className="bg-white p-3 rounded shadow-sm border-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">admin@sppg.com</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600">unknown@example.com</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">user@sppg.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}
