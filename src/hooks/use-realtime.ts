import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export interface RealtimeEvent {
  type: string
  data: any
  timestamp: string
  userId?: string
}

export interface UseRealtimeOptions {
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
  onReconnect?: () => void
  autoReconnect?: boolean
  reconnectDelay?: number
  maxReconnectAttempts?: number
  disabled?: boolean // New option to disable WebSocket entirely
}

export function useRealtime(
  url: string = '/api/realtime',
  options: UseRealtimeOptions = {}
) {
  const [connected, setConnected] = useState(false)
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    onConnect,
    onDisconnect,
    onError,
    onReconnect,
    autoReconnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
    disabled = false
  } = options

  const connect = () => {
    try {
      // Convert HTTP URL to WebSocket URL
      const wsUrl = url.replace(/^http/, 'ws')
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setConnected(true)
        reconnectAttemptsRef.current = 0
        onConnect?.()
        
        if (reconnectAttemptsRef.current > 0) {
          toast.success('Real-time connection restored')
          onReconnect?.()
        }
      }

      wsRef.current.onmessage = (event) => {
        try {
          const realtimeEvent: RealtimeEvent = JSON.parse(event.data)
          setEvents(prev => [...prev.slice(-99), realtimeEvent]) // Keep last 100 events
          setLastEvent(realtimeEvent)
        } catch (error) {
          console.error('Failed to parse realtime event:', error)
        }
      }

      wsRef.current.onclose = (event) => {
        setConnected(false)
        onDisconnect?.()

        // Check if it's a server error (WebSocket not supported)
        if (event.code === 1006 || event.code === 1002) {
          console.warn('WebSocket not supported by server, running in polling mode')
          return // Don't attempt to reconnect for unsupported servers
        }

        // Auto-reconnect if enabled and not manually closed
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)
            connect()
          }, reconnectDelay)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.warn('Real-time connection unavailable, using manual refresh')
        }
      }

      wsRef.current.onerror = (error) => {
        // Silently handle WebSocket errors since server may not support WebSockets
        console.warn('Real-time connection unavailable:', error)
        // Don't call onError for unsupported WebSocket scenarios
      }
    } catch (error) {
      console.warn('WebSocket not supported, using manual refresh mode:', error)
      // Don't call onError for unsupported WebSocket scenarios
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setConnected(false)
    reconnectAttemptsRef.current = maxReconnectAttempts // Prevent auto-reconnect
  }

  const sendEvent = (type: string, data: any) => {
    if (wsRef.current && connected) {
      const event: RealtimeEvent = {
        type,
        data,
        timestamp: new Date().toISOString()
      }
      wsRef.current.send(JSON.stringify(event))
    } else {
      console.warn('Real-time not available: using manual refresh mode')
      // Could implement fallback to HTTP API here if needed
    }
  }

  const clearEvents = () => {
    setEvents([])
    setLastEvent(null)
  }

  useEffect(() => {
    if (!disabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [url, disabled])

  return {
    connected,
    events,
    lastEvent,
    connect,
    disconnect,
    sendEvent,
    clearEvents,
    reconnectAttempts: reconnectAttemptsRef.current
  }
}
