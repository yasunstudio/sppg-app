"use client"

/**
 * 🏗️ PageTitle - Page title display component
 * @fileoverview Displays the current page title with responsive truncation
 */

import React from 'react'
import { cn } from '../utils'
import type { PageTitleProps } from '../types/header.types'
import { formatTitleForDisplay } from '../utils'

/**
 * Page title display component
 */
export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  className,
  showBreadcrumb = false
}) => {
  if (!title) return null

  return (
    <h1 className={cn(
      'text-lg sm:text-xl font-semibold text-foreground dark:text-slate-100 truncate',
      className
    )}>
      {formatTitleForDisplay(title, 50)}
    </h1>
  )
}
