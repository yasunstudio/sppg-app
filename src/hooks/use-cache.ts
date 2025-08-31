import { useEffect, useRef, useState } from 'react'

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of cached items
  onExpire?: (key: string, data: any) => void
  onEvict?: (key: string, data: any) => void
}

export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
  hits: number
}

export interface CacheStats {
  size: number
  hits: number
  misses: number
  hitRate: number
  totalItems: number
  memoryUsage: string
}

export function useCache<T = any>(options: CacheOptions = {}) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    maxSize = 100,
    onExpire,
    onEvict
  } = options

  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map())
  const statsRef = useRef({ hits: 0, misses: 0 })
  const [stats, setStats] = useState<CacheStats>({
    size: 0,
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalItems: 0,
    memoryUsage: '0 KB'
  })

  // Clean expired entries
  const cleanExpired = () => {
    const now = Date.now()
    const cache = cacheRef.current
    const toDelete: string[] = []

    cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        toDelete.push(key)
        onExpire?.(key, entry.data)
      }
    })

    toDelete.forEach(key => cache.delete(key))
    updateStats()
  }

  // Evict least recently used items if cache is full
  const evictLRU = () => {
    const cache = cacheRef.current
    if (cache.size < maxSize) return

    let oldestKey: string | null = null
    let oldestTime = Date.now()
    let leastHits = Infinity

    cache.forEach((entry, key) => {
      if (entry.hits < leastHits || (entry.hits === leastHits && entry.timestamp < oldestTime)) {
        oldestKey = key
        oldestTime = entry.timestamp
        leastHits = entry.hits
      }
    })

    if (oldestKey) {
      const evicted = cache.get(oldestKey)
      if (evicted) {
        onEvict?.(oldestKey, evicted.data)
      }
      cache.delete(oldestKey)
    }
  }

  const updateStats = () => {
    const cache = cacheRef.current
    const { hits, misses } = statsRef.current
    const total = hits + misses
    
    // Estimate memory usage (rough calculation)
    const memoryBytes = JSON.stringify([...cache.entries()]).length * 2 // Unicode is 2 bytes per char
    const memoryKB = (memoryBytes / 1024).toFixed(2)

    setStats({
      size: cache.size,
      hits,
      misses,
      hitRate: total > 0 ? (hits / total) * 100 : 0,
      totalItems: total,
      memoryUsage: `${memoryKB} KB`
    })
  }

  const set = (key: string, data: T, customTtl?: number) => {
    cleanExpired()
    evictLRU()

    const cache = cacheRef.current
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl,
      hits: 0
    }

    cache.set(key, entry)
    updateStats()
  }

  const get = (key: string): T | null => {
    cleanExpired()
    
    const cache = cacheRef.current
    const entry = cache.get(key)

    if (entry) {
      entry.hits++
      statsRef.current.hits++
      updateStats()
      return entry.data
    }

    statsRef.current.misses++
    updateStats()
    return null
  }

  const has = (key: string): boolean => {
    cleanExpired()
    return cacheRef.current.has(key)
  }

  const remove = (key: string): boolean => {
    const result = cacheRef.current.delete(key)
    updateStats()
    return result
  }

  const clear = () => {
    cacheRef.current.clear()
    statsRef.current.hits = 0
    statsRef.current.misses = 0
    updateStats()
  }

  const keys = (): string[] => {
    cleanExpired()
    return Array.from(cacheRef.current.keys())
  }

  const values = (): T[] => {
    cleanExpired()
    return Array.from(cacheRef.current.values()).map(entry => entry.data)
  }

  const entries = (): [string, T][] => {
    cleanExpired()
    return Array.from(cacheRef.current.entries()).map(([key, entry]) => [key, entry.data])
  }

  // Auto-cleanup interval
  useEffect(() => {
    const interval = setInterval(cleanExpired, 60000) // Clean every minute
    return () => clearInterval(interval)
  }, [])

  return {
    set,
    get,
    has,
    remove,
    clear,
    keys,
    values,
    entries,
    stats,
    cleanExpired
  }
}
