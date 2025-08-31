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
    maxReconnectAttempts = 5
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

      wsRef.current.onclose = () => {
        setConnected(false)
        onDisconnect?.()

        // Auto-reconnect if enabled and not manually closed
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)
            connect()
          }, reconnectDelay)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          toast.error('Failed to reconnect to real-time server')
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        const wsError = new Error('WebSocket connection error')
        onError?.(wsError)
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      onError?.(error as Error)
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
      console.warn('Cannot send event: WebSocket not connected')
    }
  }

  const clearEvents = () => {
    setEvents([])
    setLastEvent(null)
  }

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [url])

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
