"use client"

/**
 * 🏗️ SearchBar Component - Search input with suggestions
 * @fileoverview Search input with suggestions and keyboard navigation
 */

import React, { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '../utils'
import type { SearchBarProps } from '../types/header.types'
import { useHeaderSearch } from '../hooks'
import { SEARCH_CONFIG, ARIA_LABELS } from '../constants'

/**
 * Search bar component with autocomplete
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = SEARCH_CONFIG.PLACEHOLDER,
  onSearch,
  className,
  showMobileSearch = false
}) => {
  const search = useHeaderSearch()
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.query.trim()
    if (query) {
      search.handleSearch(query)
      onSearch?.(query)
      inputRef.current?.blur()
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search.setQuery(e.target.value)
  }

  // Focus management for mobile
  useEffect(() => {
    if (showMobileSearch && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showMobileSearch])

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-slate-400" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className={cn(
            'pl-9 w-full bg-background border-input hover:border-ring focus:border-ring transition-colors',
            'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400',
            {
              'ring-2 ring-ring': isFocused
            }
          )}
          value={search.query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label={ARIA_LABELS.SEARCH_INPUT}
        />
        
        {/* Loading indicator */}
        {search.isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground"></div>
          </div>
        )}
      </div>
    </form>
  )
}
