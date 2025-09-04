"use client"

/**
 * 🏗️ useHeaderNotifications Hook - Notifications management
 * @fileoverview Hook for managing header notifications
 */

import { useState, useCallback, useEffect } from 'react'
import type { UseHeaderNotificationsReturn, HeaderNotification } from '../types/header.types'
import { NOTIFICATION_CONFIG } from '../constants'

/**
 * Hook for managing header notifications
 */
export const useHeaderNotifications = (): UseHeaderNotificationsReturn => {
  const [notifications, setNotifications] = useState<HeaderNotification[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      const mockNotifications = await mockNotificationsAPI()
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Mark single notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      // TODO: Replace with actual API call
      await mockMarkAsReadAPI(id)
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      await mockMarkAllAsReadAPI()
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }, [])

  // Refresh notifications
  const refreshNotifications = useCallback(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Calculate unread count
  const count = notifications.filter(n => !n.read).length

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Auto refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications()
    }, NOTIFICATION_CONFIG.REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchNotifications])

  return {
    notifications,
    count,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  }
}

// Mock API functions - replace with actual implementations
const mockNotificationsAPI = async (): Promise<HeaderNotification[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return [
    {
      id: '1',
      title: 'Produksi Selesai',
      message: 'Batch produksi #001 telah selesai',
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/dashboard/production/batches/1'
    },
    {
      id: '2',
      title: 'Stok Rendah',
      message: 'Beras premium tersisa 10kg',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      link: '/dashboard/inventory'
    },
    {
      id: '3',
      title: 'Distribusi Terlambat',
      message: 'Pengiriman ke SD Negeri 01 terlambat',
      type: 'error',
      read: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      link: '/dashboard/distribution'
    }
  ]
}

const mockMarkAsReadAPI = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  console.log(`Marked notification ${id} as read`)
}

const mockMarkAllAsReadAPI = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('Marked all notifications as read')
}
