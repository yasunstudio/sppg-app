"use client"

/**
 * 🏗️ NotificationButton - Notification dropdown button
 * @fileoverview Dropdown button for notifications with unread count
 */

import React from 'react'
import { Bell } from 'lucide-react'
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
import { cn, getRelativeTime } from '../utils'
import type { NotificationButtonProps } from '../types/header.types'
import { useHeaderNotifications } from '../hooks'
import { ARIA_LABELS } from '../constants'

/**
 * Notification button with dropdown
 */
export const NotificationButton: React.FC<NotificationButtonProps> = ({
  className,
  position = "right"
}) => {
  const { notifications, count, loading, markAsRead } = useHeaderNotifications()

  const handleNotificationClick = (notificationId: string, link?: string) => {
    markAsRead(notificationId)
    if (link) {
      // Navigation will be handled by Link component
    }
  }

  return (
    <NoSSR 
      fallback={
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="sr-only">{ARIA_LABELS.NOTIFICATIONS}</span>
        </Button>
      }
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn('relative h-9 w-9', className)}
            aria-label={ARIA_LABELS.NOTIFICATIONS}
          >
            <Bell className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 dark:bg-red-600 text-[10px] text-white font-medium">
                {count > 9 ? '9+' : count}
              </span>
            )}
            <span className="sr-only">{ARIA_LABELS.NOTIFICATIONS}</span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align={position === "right" ? "end" : "start"} 
          className="w-80 dark:bg-slate-800 dark:border-slate-600"
        >
          <DropdownMenuLabel className="dark:text-slate-100">
            Notifikasi
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:border-slate-600" />
          
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground dark:text-slate-400">
                Memuat notifikasi...
              </div>
            ) : notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className="flex flex-col items-start p-3 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-700"
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-slate-500 mt-1">
                        {getRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground dark:text-slate-400">
                Tidak ada notifikasi baru
              </div>
            )}
          </div>
          
          <DropdownMenuSeparator className="dark:border-slate-600" />
          <DropdownMenuItem asChild>
            <Link 
              href="/notifications" 
              className="w-full text-center font-medium dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Lihat semua notifikasi
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </NoSSR>
  )
}
