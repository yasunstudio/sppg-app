import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Settings,
  Globe,
  Mail,
  Bell,
  Palette,
  Database
} from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()
  
  // Allow both ADMIN and KEPALA_SPPG to access settings page
  if (!session?.user || !session.user.role || 
      !["ADMIN", "KEPALA_SPPG"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-4">
      {/* Settings Categories */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <input 
                type="text" 
                value="SPPG Management System"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                readOnly
              />
            </div>
            <div>
              <select className="w-full mt-1 px-3 py-2 border rounded-md">
                <option>Asia/Jakarta (GMT+7)</option>
                <option>Asia/Singapore (GMT+8)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="smtp.gmail.com"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <input 
                type="number" 
                placeholder="587"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Test Connection
            </button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex items-center justify-between">
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <input type="checkbox" className="toggle" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <input 
                type="number" 
                value="10"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                readOnly
              />
            </div>
            <div>
              <input 
                type="number" 
                value="30"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                readOnly
              />
            </div>
            <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              Apply Changes
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 border rounded-md hover:bg-gray-50 transition">
          Reset to Defaults
        </button>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          Save All Settings
        </button>
      </div>
    </div>
  )
}
