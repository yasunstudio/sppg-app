"use client"

/**
 * 🏗️ useHeaderUser Hook - User management
 * @fileoverview Hook for managing user-related functionality in header
 */

import { useState, useCallback, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useUserProfile } from '@/hooks/use-user-profile'
import type { UseHeaderUserReturn, HeaderUser } from '../types/header.types'

/**
 * Hook for managing user data and authentication
 */
export const useHeaderUser = (): UseHeaderUserReturn => {
  const { data: session, status } = useSession()
  const { profile, loading: profileLoading } = useUserProfile()

  // Transform session and profile data to HeaderUser format
  const user: HeaderUser | null = session?.user ? {
    id: session.user.id || '',
    name: profile?.name || session.user.name || '',
    email: session.user.email || '',
    avatar: undefined, // Avatar will be handled by profile data
    roles: profile?.roles?.map(r => ({
      id: r.role.id,
      name: r.role.name,
      displayName: r.role.name
    })) || []
  } : null

  // Get primary role display
  const role = profile?.roles?.[0]?.role?.name || 'Pengguna'

  // Handle sign out
  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: '/auth/login' })
  }, [])

  // Loading state
  const isLoading = status === 'loading' || profileLoading

  return {
    user,
    profile,
    role,
    handleSignOut,
    isLoading
  }
}
