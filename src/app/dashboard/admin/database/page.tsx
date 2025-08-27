import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Database,
  HardDrive,
  Activity,
  RefreshCw,
  Download,
  Upload
} from "lucide-react"

export default async function DatabasePage() {
  const session = await auth()
  
  // Allow both ADMIN and KEPALA_SPPG to access database page
  if (!session?.user || !session.user.role || 
      !["ADMIN", "KEPALA_SPPG"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  const dbMetrics = [
    {
      title: "Database Size",
      value: "2.4 GB",
      icon: HardDrive,
    },
    {
      title: "Active Connections",
      value: "8",
      icon: Activity,
    },
    {
      title: "Last Backup",
      value: "2 hours ago",
      icon: Download,
    },
    {
      title: "Query Performance",
      value: "95%",
      icon: RefreshCw,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Database Metrics */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {dbMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Database Operations */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <Download className="h-5 w-5 text-blue-500" />
            </div>
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Create Backup Now
            </button>
            <button className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
              Schedule Automatic Backup
            </button>
            <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              Download Latest Backup
            </button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="h-5 w-5 text-orange-500" />
            </div>
            <button className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
              Upload Backup File
            </button>
            <button className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Restore from Backup
            </button>
            <p className="text-xs text-muted-foreground">
              ⚠️ Restore operations will overwrite current data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Database Status */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">45ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">2.4GB / 10GB (24%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">3</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
