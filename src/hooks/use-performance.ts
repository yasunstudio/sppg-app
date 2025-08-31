import { useEffect, useRef, useState } from 'react'

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  category: 'api' | 'ui' | 'database' | 'cache' | 'memory' | 'network'
}

export interface PerformanceStats {
  apiCalls: {
    total: number
    average: number
    fastest: number
    slowest: number
  }
  cacheStats: {
    hitRate: number
    totalItems: number
    memoryUsage: number
  }
  memoryUsage: {
    used: number
    total: number
    percentage: number
  }
  networkStats: {
    totalRequests: number
    failedRequests: number
    averageLatency: number
  }
}

export interface UsePerformanceOptions {
  trackMemory?: boolean
  trackNetwork?: boolean
  trackCache?: boolean
  sampleRate?: number // 0-1, percentage of events to track
  maxMetrics?: number // Maximum metrics to keep in memory
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    trackMemory = true,
    trackNetwork = true,
    trackCache = true,
    sampleRate = 1.0,
    maxMetrics = 1000
  } = options

  const metricsRef = useRef<PerformanceMetric[]>([])
  const [stats, setStats] = useState<PerformanceStats>({
    apiCalls: { total: 0, average: 0, fastest: 0, slowest: 0 },
    cacheStats: { hitRate: 0, totalItems: 0, memoryUsage: 0 },
    memoryUsage: { used: 0, total: 0, percentage: 0 },
    networkStats: { totalRequests: 0, failedRequests: 0, averageLatency: 0 }
  })

  // Performance observer for web vitals
  const observerRef = useRef<PerformanceObserver | null>(null)

  const addMetric = (metric: PerformanceMetric) => {
    // Sample rate check
    if (Math.random() > sampleRate) return

    const metrics = metricsRef.current
    metrics.push(metric)

    // Keep only the most recent metrics
    if (metrics.length > maxMetrics) {
      metrics.splice(0, metrics.length - maxMetrics)
    }

    updateStats()
  }

  const measureAPI = async <T>(
    name: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await apiCall()
      const endTime = performance.now()
      const duration = endTime - startTime

      addMetric({
        name,
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'api'
      })

      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime

      addMetric({
        name: `${name}_error`,
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'api'
      })

      throw error
    }
  }

  const measureUI = (name: string, uiOperation: () => void) => {
    const startTime = performance.now()
    
    uiOperation()
    
    const endTime = performance.now()
    const duration = endTime - startTime

    addMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'ui'
    })
  }

  const trackCachePerformance = (
    operation: 'hit' | 'miss' | 'set' | 'clear',
    key: string,
    duration?: number
  ) => {
    addMetric({
      name: `cache_${operation}`,
      value: duration || 0,
      unit: duration ? 'ms' : 'count',
      timestamp: Date.now(),
      category: 'cache'
    })
  }

  const getMemoryUsage = (): { used: number; total: number; percentage: number } => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      }
    }
    return { used: 0, total: 0, percentage: 0 }
  }

  const updateStats = () => {
    const metrics = metricsRef.current
    const now = Date.now()
    const last24h = metrics.filter(m => now - m.timestamp < 24 * 60 * 60 * 1000)

    // API call stats
    const apiMetrics = last24h.filter(m => m.category === 'api' && !m.name.includes('_error'))
    const apiCallStats = {
      total: apiMetrics.length,
      average: apiMetrics.length > 0 ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length : 0,
      fastest: apiMetrics.length > 0 ? Math.min(...apiMetrics.map(m => m.value)) : 0,
      slowest: apiMetrics.length > 0 ? Math.max(...apiMetrics.map(m => m.value)) : 0
    }

    // Cache stats
    const cacheMetrics = last24h.filter(m => m.category === 'cache')
    const cacheHits = cacheMetrics.filter(m => m.name === 'cache_hit').length
    const cacheMisses = cacheMetrics.filter(m => m.name === 'cache_miss').length
    const totalCacheOps = cacheHits + cacheMisses
    const cacheStats = {
      hitRate: totalCacheOps > 0 ? (cacheHits / totalCacheOps) * 100 : 0,
      totalItems: cacheMetrics.length,
      memoryUsage: 0 // This would be set from actual cache implementation
    }

    // Memory usage
    const memoryUsage = trackMemory ? getMemoryUsage() : { used: 0, total: 0, percentage: 0 }

    // Network stats
    const networkMetrics = last24h.filter(m => m.category === 'network')
    const failedRequests = last24h.filter(m => m.name.includes('_error')).length
    const networkStats = {
      totalRequests: networkMetrics.length,
      failedRequests,
      averageLatency: networkMetrics.length > 0 ? 
        networkMetrics.reduce((sum, m) => sum + m.value, 0) / networkMetrics.length : 0
    }

    setStats({
      apiCalls: apiCallStats,
      cacheStats,
      memoryUsage,
      networkStats
    })
  }

  const getMetrics = (category?: PerformanceMetric['category'], limit?: number) => {
    let filtered = metricsRef.current
    
    if (category) {
      filtered = filtered.filter(m => m.category === category)
    }
    
    if (limit) {
      filtered = filtered.slice(-limit)
    }
    
    return filtered
  }

  const clearMetrics = () => {
    metricsRef.current = []
    updateStats()
  }

  const exportMetrics = () => {
    return {
      metrics: metricsRef.current,
      stats,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
  }

  // Initialize performance observer
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      try {
        observerRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          
          entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              addMetric({
                name: 'page_load',
                value: navEntry.loadEventEnd - navEntry.fetchStart,
                unit: 'ms',
                timestamp: Date.now(),
                category: 'ui'
              })
            }
            
            if (entry.entryType === 'paint') {
              addMetric({
                name: entry.name,
                value: entry.startTime,
                unit: 'ms',
                timestamp: Date.now(),
                category: 'ui'
              })
            }
          })
        })

        observerRef.current.observe({ entryTypes: ['navigation', 'paint', 'measure'] })
      } catch (error) {
        console.warn('Performance Observer not supported:', error)
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(updateStats, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return {
    stats,
    addMetric,
    measureAPI,
    measureUI,
    trackCachePerformance,
    getMetrics,
    clearMetrics,
    exportMetrics,
    getMemoryUsage
  }
}
