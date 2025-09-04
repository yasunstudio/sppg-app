"use client"

/**
 * 🏗️ HeaderLeft - Left section component
 * @fileoverview Left section containing mobile menu toggle and page title
 */

import React from 'react'
import { cn } from '../utils'
import type { HeaderLeftProps } from '../types/header.types'
import { MobileMenuToggle, PageTitle } from '.'

/**
 * Left section of header (mobile menu + page title)
 */
export const HeaderLeft: React.FC<HeaderLeftProps> = ({
  children,
  className,
  onMobileSidebarToggle,
  sidebarOpen,
  pageTitle
}) => {
  return (
    <div className={cn(
      'flex items-center space-x-3 flex-1 min-w-0',
      className
    )}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden">
        <MobileMenuToggle
          isOpen={sidebarOpen}
          onToggle={onMobileSidebarToggle}
        />
      </div>

      {/* Page Title */}
      <div className="min-w-0 flex-1">
        <PageTitle title={pageTitle} />
      </div>

      {/* Additional content */}
      {children}
    </div>
  )
}
