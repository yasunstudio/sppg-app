"use client"

/**
 * 🏗️ HeaderLeft - Left section component
 * @fileoverview Left section containing mobile menu toggle and page title
 */

import React from 'react'
import { cn } from '../utils'
import type { HeaderLeftProps } from '../types/header.types'
import { MobileMenuToggle, PageTitle } from '.'
import { SidebarToggle } from './SidebarToggle'

/**
 * Left section of header (mobile menu + sidebar toggle + page title)
 */
const HeaderLeft: React.FC<HeaderLeftProps> = ({
  children,
  className,
  onMobileSidebarToggle,
  sidebarOpen,
  pageTitle,
  // Add sidebar collapse props
  sidebarCollapsed,
  onSidebarToggle
}) => {
  return (
    <div className={cn(
      "flex items-center gap-4 lg:gap-6 min-w-0 flex-1 pl-4 lg:pl-6 pr-2",
      className
    )}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden">
        <MobileMenuToggle
          isOpen={sidebarOpen}
          onToggle={onMobileSidebarToggle}
        />
      </div>

      {/* Sidebar Toggle Button (Desktop) */}
      {onSidebarToggle && (
        <div className="hidden lg:flex items-center">
          <SidebarToggle
            isCollapsed={sidebarCollapsed || false}
            onToggle={onSidebarToggle}
            variant="default"
            size="sm"
          />
        </div>
      )}

      {/* Page Title */}
      <div className="min-w-0 flex-1 ml-2 lg:ml-4">
        <PageTitle title={pageTitle} />
      </div>

      {/* Additional content */}
      {children}
    </div>
  )
}

export { HeaderLeft }
