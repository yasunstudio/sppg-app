'use client'

import { useState, useEffect } from 'react'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  // Placeholder implementation
  useEffect(() => {
    setNotifications([])
    setLoading(false)
  }, [])

  return {
    notifications,
    loading,
    markAsRead: () => {},
    markAllAsRead: () => {},
    deleteNotification: () => {}
  }
}
