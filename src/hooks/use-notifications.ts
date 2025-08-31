'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  priority: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

interface UseNotificationsReturn {
  notifications: Notification[]
  loading: boolean
  error: string | null
  refresh: () => void
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  stats: {
    total: number
    unread: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  }
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current user ID - this should come from auth context
      const userId = 'user-1' // Mock user ID for now
      
      const response = await fetch(`/api/notifications?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
      console.error('Fetch notifications error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [notificationId], markAsRead: true })
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, isRead: true } 
            : n
        )
      )
      
      toast.success('Notification marked as read')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      )
      
      toast.success('Semua notifikasi ditandai sudah dibaca')
    } catch (err) {
      toast.error('Gagal menandai semua notifikasi sebagai dibaca')
      console.error('Mark all as read error:', err)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }
      
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      )
      
      toast.success('Notifikasi berhasil dihapus')
    } catch (err) {
      toast.error('Gagal menghapus notifikasi')
      console.error('Delete notification error:', err)
    }
  }

  const refresh = () => {
    fetchNotifications()
  }

  // Calculate stats
  const stats = {
    total: notifications?.length || 0,
    unread: notifications?.filter(n => !n.isRead).length || 0,
    byType: (notifications || []).reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    byPriority: (notifications || []).reduce((acc, notification) => {
      acc[notification.priority] = (acc[notification.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  return {
    notifications,
    loading,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    stats
  }
}
