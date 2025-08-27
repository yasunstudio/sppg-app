"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface UserProfile {
  id: string
  name: string
  email: string
  roles: string[]
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
            roles: ['Administrator'], // Default role
          })
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Fallback to session data
        setProfile({
          id: session.user.id || '',
          name: session.user.name || '',
          email: session.user.email || '',
          roles: ['Administrator'], // Default role
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
    return profile.roles[0] // Show primary role
  }

  return {
    profile,
    loading,
    getRoleDisplay
  }
}
