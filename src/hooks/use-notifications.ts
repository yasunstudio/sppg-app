"use client"

import { useState, useEffect } from "react"

interface Notification {
  id: string
  title: string
  time: string
  type: string
  createdAt: Date
}

interface NotificationsData {
  notifications: Notification[]
  count: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications')
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      
      const data: NotificationsData = await response.json()
      setNotifications(data.notifications)
      setCount(data.count)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Fallback data
      setNotifications([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    notifications,
    count,
    loading,
    error,
    refetch: fetchNotifications
  }
}
