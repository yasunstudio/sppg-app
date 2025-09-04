"use client"

/**
 * 🏗️ useHeaderSearch Hook - Search functionality
 * @fileoverview Hook for managing header search functionality
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { UseHeaderSearchReturn, SearchResult } from '../types/header.types'
import { SEARCH_CONFIG, STORAGE_KEYS } from '../constants'
import { debounce, getStorageItem, setStorageItem } from '../utils'

/**
 * Hook for managing header search functionality
 */
export const useHeaderSearch = (): UseHeaderSearchReturn => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = getStorageItem(STORAGE_KEYS.RECENT_SEARCHES, [])
    setRecentSearches(saved)
  }, [])

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      
      try {
        // TODO: Replace with actual API call
        const mockResults = await mockSearchAPI(searchQuery)
        setResults(mockResults)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, SEARCH_CONFIG.DEBOUNCE_MS),
    []
  )

  // Update query and trigger search
  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery)
    debouncedSearch(newQuery)
  }, [debouncedSearch])

  // Handle search submission
  const handleSearch = useCallback((searchQuery: string) => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) return

    // Add to recent searches
    const updatedRecentSearches = [
      trimmedQuery,
      ...recentSearches.filter(s => s !== trimmedQuery)
    ].slice(0, 5) // Keep only 5 recent searches

    setRecentSearches(updatedRecentSearches)
    setStorageItem(STORAGE_KEYS.RECENT_SEARCHES, updatedRecentSearches)

    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
  }, [recentSearches, router])

  // Clear search
  const handleClearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setIsSearching(false)
  }, [])

  // Remove from recent searches
  const removeFromRecentSearches = useCallback((searchToRemove: string) => {
    const updatedRecentSearches = recentSearches.filter(s => s !== searchToRemove)
    setRecentSearches(updatedRecentSearches)
    setStorageItem(STORAGE_KEYS.RECENT_SEARCHES, updatedRecentSearches)
  }, [recentSearches])

  return {
    query,
    setQuery: updateQuery,
    results,
    isSearching,
    handleSearch,
    handleClearSearch,
    recentSearches
  }
}

// Mock search API - replace with actual implementation
const mockSearchAPI = async (query: string): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))

  // Mock search results
  const mockData: SearchResult[] = [
    {
      id: '1',
      title: 'John Doe',
      description: 'john.doe@example.com',
      type: 'user',
      url: '/dashboard/users/1',
    },
    {
      id: '2',
      title: 'SD Negeri 01',
      description: 'Jakarta Pusat',
      type: 'school',
      url: '/dashboard/schools/2',
    },
    {
      id: '3',
      title: 'Laporan Bulanan',
      description: 'Laporan produksi bulan ini',
      type: 'report',
      url: '/dashboard/reports/3',
    },
  ]

  // Filter based on query
  return mockData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  )
}
