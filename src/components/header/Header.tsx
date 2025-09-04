"use client"

/**
 * 🏗️ Header - Main header component
 * @fileoverview Main orchestrator component that combines all header sections
 */

import React from 'react'
import { cn } from './utils'
import type { HeaderProps } from './types/header.types'
import { useHeader } from './hooks'

// Section components
import { HeaderContainer } from './components/HeaderContainer'
import { HeaderLeft } from './components/HeaderLeft'
import { HeaderCenter } from './components/HeaderCenter'
import { HeaderRight } from './components/HeaderRight'
import { MobileSearch } from './components/MobileSearch'

/**
 * Main header component with all functionality
 */
export const Header: React.FC<HeaderProps> = ({
  onMobileSidebarToggle,
  sidebarOpen,
  className
}) => {
  const header = useHeader({
    showSearch: true,
    showNotifications: true,
    showThemeToggle: true,
    showUserMenu: true,
    showMobileMenu: true
  })

  // Override mobile sidebar toggle handler with prop
  const handleMobileSidebarToggle = onMobileSidebarToggle || header.handleMobileSidebarToggle

  return (
    <>
      <HeaderContainer className={className}>
        {/* Left Section - Mobile Menu & Page Title */}
        <HeaderLeft
          onMobileSidebarToggle={handleMobileSidebarToggle}
          sidebarOpen={sidebarOpen}
          pageTitle={header.pageTitle}
        />

        {/* Center Section - Search (Desktop) */}
        <HeaderCenter
          showSearch={header.config.showSearch}
          searchPlaceholder={header.config.searchPlaceholder}
        />

        {/* Right Section - Actions & User Menu */}
        <HeaderRight
          showNotifications={header.config.showNotifications}
          showThemeToggle={header.config.showThemeToggle}
          showUserMenu={header.config.showUserMenu}
        />
      </HeaderContainer>

      {/* Mobile Search Overlay */}
      <MobileSearch />
    </>
  )
}
