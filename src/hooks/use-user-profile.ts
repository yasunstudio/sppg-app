"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface UserProfile {
  id: string
  name: string
  email: string
  roles: Array<{
    id: string
    userId: string
    roleId: string
    assignedAt: Date
    role: {
      id: string
      name: string
      description?: string
    }
  }>
  avatar?: string
}

export function useUserProfile() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/users/profile?email=${session.user.email}`)
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          // Fallback to session data
          setProfile({
            id: session.user.id || '',
            name: session.user.name || '',
            email: session.user.email || '',
            roles: [], // Empty roles array for fallback
          })
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Fallback to session data
        setProfile({
          id: session.user.id || '',
          name: session.user.name || '',
          email: session.user.email || '',
          roles: [], // Empty roles array for fallback
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [session])

  const getRoleDisplay = () => {
    if (!profile?.roles || profile.roles.length === 0) {
      return 'User'
    }
    // Extract role name from the role object
    return profile.roles[0].role.name || 'User'
  }

  return {
    profile,
    loading,
    getRoleDisplay
  }
}
