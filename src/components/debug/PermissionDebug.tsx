"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function PermissionDebug() {
  const { data: session } = useSession()
  const [userPermissions, setUserPermissions] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!session?.user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/permissions/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUserPermissions(data)
        } else {
          console.error('Failed to fetch permissions:', response.status)
        }
      } catch (error) {
        console.error('Error fetching permissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [session?.user?.id])

  if (loading) {
    return <div className="p-4 bg-yellow-100 text-yellow-800">Loading permissions...</div>
  }

  if (!session) {
    return <div className="p-4 bg-red-100 text-red-800">Not logged in</div>
  }

  return (
    <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
      <h3 className="font-bold text-lg mb-4">Permission Debug Info</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">User Session:</h4>
        <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto">
          {JSON.stringify(session.user, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">User Permissions Context:</h4>
        <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto">
          {userPermissions ? JSON.stringify(userPermissions, null, 2) : 'No permissions data'}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Roles:</h4>
        <div className="text-sm">
          {userPermissions?.roles?.map((role: any) => (
            <div key={role.name} className="bg-white p-2 rounded mt-1">
              <strong>{role.name}</strong> (Priority: {role.priority})
              <div className="text-xs mt-1">
                Permissions: {role.permissions?.length || 0} permissions
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">All Permissions ({userPermissions?.permissions?.length || 0}):</h4>
        <div className="text-xs bg-white p-2 rounded mt-2 max-h-40 overflow-auto">
          {userPermissions?.permissions?.join(', ') || 'No permissions'}
        </div>
      </div>
    </div>
  )
}
