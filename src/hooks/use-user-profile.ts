'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { authenticatedApiCall } from '@/lib/api-utils'

export interface UserProfile {
  id: string
  email: string
  username?: string
  name: string
  phone?: string
  address?: string
  avatar?: string
  isActive: boolean
  roles: {
    role: {
      id: string
      name: string
      description?: string
      permissions: string[]
    }
  }[]
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileData {
  name?: string
  username?: string
  phone?: string
  address?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function useUserProfile() {
  const { data: session, update: updateSession } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch current user profile
  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users/profile')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON')
      }
      
      const data = await response.json()

      if (data.success) {
        setProfile(data.data)
      } else {
        setError(data.error || 'Failed to fetch profile')
      }
    } catch (error) {
      setError('Failed to fetch profile')
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  // Update profile
  const updateProfile = async (profileData: UpdateProfileData): Promise<{ success: boolean; error?: string }> => {
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON')
      }

      const data = await response.json()

      if (data.success) {
        setProfile(data.data)
        
        // Update session if name changed
        if (profileData.name) {
          await updateSession({ name: profileData.name })
        }
        
        return { success: true }
      } else {
        setError(data.error || 'Failed to update profile')
        return { success: false, error: data.error }
      }
    } catch (error) {
      const errorMsg = 'Failed to update profile'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (passwordData: ChangePasswordData): Promise<{ success: boolean; error?: string }> => {
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return { success: false, error: 'New passwords do not match' }
    }

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to change password' }
      }
    } catch (error) {
      return { success: false, error: 'Failed to change password' }
    }
  }

  // Upload avatar
  const uploadAvatar = async (file: File): Promise<{ success: boolean; avatarUrl?: string; error?: string }> => {
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setProfile(prev => prev ? { ...prev, avatar: data.avatarUrl } : null)
        return { success: true, avatarUrl: data.avatarUrl }
      } else {
        return { success: false, error: data.error || 'Failed to upload avatar' }
      }
    } catch (error) {
      return { success: false, error: 'Failed to upload avatar' }
    }
  }

  // Get user permissions
  const getUserPermissions = useCallback((): string[] => {
    if (!profile?.roles) return []
    
    const allPermissions = new Set<string>()
    profile.roles.forEach(userRole => {
      userRole.role.permissions.forEach(permission => {
        allPermissions.add(permission)
      })
    })
    
    return Array.from(allPermissions)
  }, [profile?.roles])

  // Check if user has specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    const permissions = getUserPermissions()
    return permissions.includes(permission)
  }, [getUserPermissions])

  // Check if user has any of the permissions
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    const userPermissions = getUserPermissions()
    return permissions.some(permission => userPermissions.includes(permission))
  }, [getUserPermissions])

  // Get primary role
  const getPrimaryRole = useCallback((): string | null => {
    if (!profile?.roles || profile.roles.length === 0) return null
    
    // Check if user has ADMIN role
    const adminRole = profile.roles.find(ur => ur.role.name === 'ADMIN')
    if (adminRole) return 'ADMIN'
    
    // Return first role
    return profile.roles[0]?.role.name || null
  }, [profile?.roles])

  // Refresh profile
  const refreshProfile = useCallback(() => {
    fetchProfile()
  }, [fetchProfile])

  // Initial load
  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session?.user, fetchProfile])

  // Update profile when session changes
  useEffect(() => {
    if (session?.user && !profile) {
      setProfile({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        roles: session.user.roles || [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as UserProfile)
    }
  }, [session?.user, profile])

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
    uploadAvatar,
    getUserPermissions,
    hasPermission,
    hasAnyPermission,
    getPrimaryRole,
    refreshProfile
  }
}
