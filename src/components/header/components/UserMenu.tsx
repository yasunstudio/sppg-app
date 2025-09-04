"use client"

/**
 * 🏗️ UserMenu - User profile dropdown menu
 * @fileoverview Dropdown menu showing user info and account actions
 */

import React from 'react'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { NoSSR } from '@/components/ui/no-ssr'
import { cn } from '../utils'
import type { UserMenuProps } from '../types/header.types'
import { useHeaderUser } from '../hooks'
import { USER_MENU_ITEMS, ARIA_LABELS } from '../constants'

/**
 * User menu dropdown component
 */
export const UserMenu: React.FC<UserMenuProps> = ({
  className,
  showRole = true,
  showAvatar = true
}) => {
  const { user, role, handleSignOut, isLoading } = useHeaderUser()

  if (isLoading || !user) {
    return (
      <Button variant="ghost" className="relative h-9 w-auto px-2 sm:px-3">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-md">
            ?
          </div>
        </div>
      </Button>
    )
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : '?'

  return (
    <NoSSR 
      fallback={
        <Button variant="ghost" className="relative h-9 w-auto px-2 sm:px-3">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-md">
              {userInitial}
            </div>
          </div>
        </Button>
      }
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              'relative h-9 w-auto px-2 sm:px-3 hover:bg-muted/50 dark:hover:bg-slate-700 max-w-48',
              className
            )}
            aria-label={ARIA_LABELS.USER_MENU}
          >
            <div className="flex items-center space-x-2 min-w-0">
              {/* User Avatar */}
              {showAvatar && (
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-md flex-shrink-0">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>
              )}
              
              {/* User Info (Desktop) */}
              <div className="hidden sm:flex sm:flex-col sm:items-start min-w-0 flex-1">
                <span className="text-sm font-medium leading-none dark:text-slate-200 truncate max-w-32">
                  {user.name}
                </span>
                {showRole && (
                  <span className="text-xs text-muted-foreground dark:text-slate-400 leading-none mt-1 truncate max-w-32">
                    {role}
                  </span>
                )}
              </div>
              
              <ChevronDown className="h-3 w-3 text-muted-foreground dark:text-slate-400 ml-1 hidden sm:block flex-shrink-0" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-56 dark:bg-slate-800 dark:border-slate-600"
        >
          <DropdownMenuLabel className="dark:text-slate-100">
            <div className="flex flex-col space-y-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">
                {user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground dark:text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="dark:border-slate-600" />
          
          {/* Menu Items */}
          {USER_MENU_ITEMS.map((item) => {
            const IconComponent = item.icon
            return (
              <DropdownMenuItem key={item.id} asChild>
                <Link 
                  href={item.href} 
                  className="cursor-pointer hover:bg-muted/50 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
          
          <DropdownMenuSeparator className="dark:border-slate-600" />
          
          {/* Logout */}
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </NoSSR>
  )
}
