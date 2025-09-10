'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface UserDetailsData {
  id: string
  fullName: string
  email: string
  phone?: string
  avatar?: string
  isActive: boolean
  lastLogin?: string
  lastActivity?: string
  loginCount?: number
  createdAt: string
  updatedAt: string
  roles?: {
    role: {
      name: string
      permissions: string[]
    }
  }[]
}

interface ActivityData {
  id: string
  action: string
  description?: string
  createdAt: string
  metadata?: Record<string, any>
}

interface UseUserDetailsReturn {
  user: UserDetailsData | null
  activities: ActivityData[]
  isLoading: boolean
  isActivitiesLoading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  refreshActivities: () => Promise<void>
}

export function useUserDetails(userId: string): UseUserDetailsReturn {
  const [user, setUser] = useState<UserDetailsData | null>(null)
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'User not found')
      }

      setUser(result.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user'
      setError(errorMessage)
      console.error('Error fetching user:', err)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      setIsActivitiesLoading(true)

      const response = await fetch(`/api/users/${userId}/activities`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        setActivities(result.data)
      } else {
        setActivities([])
      }
    } catch (err) {
      console.error('Error fetching activities:', err)
      setActivities([])
      // Don't show toast for activities error, it's not critical
    } finally {
      setIsActivitiesLoading(false)
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  const refreshActivities = async () => {
    await fetchActivities()
  }

  useEffect(() => {
    if (userId) {
      fetchUser()
      fetchActivities()
    }
  }, [userId])

  return {
    user,
    activities,
    isLoading,
    isActivitiesLoading,
    error,
    refreshUser,
    refreshActivities
  }
}
