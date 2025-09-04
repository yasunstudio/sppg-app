"use client"

/**
 * 🏗️ HeaderRight - Right section component
 * @fileoverview Right section containing actions and user menu
 */

import React from 'react'
import { cn } from '../utils'
import type { HeaderRightProps } from '../types/header.types'
import { SearchMobileToggle, NotificationButton, ThemeToggle, UserMenu } from '.'

/**
 * Right section of header (actions & user menu)
 */
export const HeaderRight: React.FC<HeaderRightProps> = ({
  children,
  className,
  showNotifications = true,
  showThemeToggle = true,
  showUserMenu = true
}) => {
  return (
    <div className={cn(
      'flex items-center space-x-1 sm:space-x-2 flex-shrink-0',
      className
    )}>
      {/* Mobile Search Toggle */}
      <div className="lg:hidden">
        <SearchMobileToggle />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {/* Notifications */}
        {showNotifications && <NotificationButton />}

        {/* Theme Toggle */}
        {showThemeToggle && <ThemeToggle />}
      </div>

      {/* User Menu - with separator */}
      {showUserMenu && (
        <>
          <div className="hidden sm:block w-px h-5 bg-border/40 mx-2" />
          <UserMenu />
        </>
      )}

      {/* Additional content */}
      {children}
    </div>
  )
}
