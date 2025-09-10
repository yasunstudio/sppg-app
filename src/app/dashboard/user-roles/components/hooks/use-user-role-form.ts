"use client"

import { useState, useEffect } from "react"
import type { User, Role } from "../utils/user-role-types"

export function useUserRoleForm() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingRoles, setLoadingRoles] = useState(true)

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true)
        const response = await fetch('/api/users?include=roles')
        
        if (response.ok) {
          const data = await response.json()
          setUsers(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [])

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true)
        const response = await fetch('/api/roles')
        
        if (response.ok) {
          const data = await response.json()
          setRoles(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
      } finally {
        setLoadingRoles(false)
      }
    }

    fetchRoles()
  }, [])

  const getAvailableUsers = (excludeUserId?: string) => {
    return users.filter(user => user.id !== excludeUserId && user.isActive)
  }

  const getAvailableRoles = (excludeRoleId?: string) => {
    return roles.filter(role => role.id !== excludeRoleId)
  }

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId)
  }

  const getRoleById = (roleId: string) => {
    return roles.find(role => role.id === roleId)
  }

  const checkUserRoleExists = (userId: string, roleId: string) => {
    const user = getUserById(userId)
    if (!user) return false
    
    return user.roles.some(userRole => userRole.role.id === roleId)
  }

  return {
    users,
    roles,
    loadingUsers,
    loadingRoles,
    isLoading: loadingUsers || loadingRoles,
    getAvailableUsers,
    getAvailableRoles,
    getUserById,
    getRoleById,
    checkUserRoleExists,
  }
}
