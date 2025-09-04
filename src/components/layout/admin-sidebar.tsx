"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import {
  LayoutGrid,
  Users,
  Settings,
  Database,
  Shield,
  Activity,
  FileText,
  BarChart3,
  ArrowLeft,
  Wrench,
  Bell,
  Key,
  Server,
  HardDrive,
  Network,
  ChevronLeft,
} from "lucide-react"

interface AdminSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className, ...props }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: "Manajemen Pengguna",
      href: "/dashboard/admin/users",
      icon: Users,
      current: pathname.startsWith("/dashboard/admin/users"),
    },
    {
      name: "Keamanan Sistem",
      href: "/dashboard/admin/security",
      icon: Shield,
      current: pathname.startsWith("/dashboard/admin/security"),
    },
    {
      name: "Manajemen Database",
      href: "/dashboard/admin/database",
      icon: Database,
      current: pathname.startsWith("/dashboard/admin/database"),
    },
    {
      name: "Monitor Sistem",
      href: "/dashboard/admin/monitoring",
      icon: Activity,
      current: pathname.startsWith("/dashboard/admin/monitoring"),
    },
    {
      name: "Server & Infrastructure",
      href: "/dashboard/admin/infrastructure",
      icon: Server,
      current: pathname.startsWith("/dashboard/admin/infrastructure"),
    },
    {
      name: "Backup & Storage",
      href: "/dashboard/admin/backup",
      icon: HardDrive,
      current: pathname.startsWith("/dashboard/admin/backup"),
    },
    {
      name: "Network & API",
      href: "/dashboard/admin/network",
      icon: Network,
      current: pathname.startsWith("/dashboard/admin/network"),
    },
    {
      name: "Notifikasi Sistem",
      href: "/dashboard/admin/notifications",
      icon: Bell,
      current: pathname.startsWith("/dashboard/admin/notifications"),
    },
    {
      name: "Laporan Sistem",
      href: "/dashboard/admin/reports",
      icon: FileText,
      current: pathname.startsWith("/dashboard/admin/reports"),
    },
    {
      name: "Analytics Advanced",
      href: "/dashboard/admin/analytics",
      icon: BarChart3,
      current: pathname.startsWith("/dashboard/admin/analytics"),
    },
    {
      name: "Konfigurasi Sistem",
      href: "/dashboard/admin/settings",
      icon: Settings,
      current: pathname.startsWith("/dashboard/admin/settings"),
    },
    {
      name: "Maintenance Tools",
      href: "/dashboard/admin/maintenance",
      icon: Wrench,
      current: pathname.startsWith("/dashboard/admin/maintenance"),
    },
  ]

  return (
    <div className={cn(
      "flex flex-col h-full w-64 min-w-64 bg-background border-r border-border/40",
      "shadow-sm dark:bg-slate-900/95 dark:border-slate-700",
      className
    )} {...props}>
      {/* Header Section */}
      <div className="flex items-center p-4 border-b border-border/40 min-h-[64px]">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <LayoutGrid className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="text-lg font-semibold text-foreground truncate block">
              SPPG Admin
            </span>
            <span className="text-xs text-muted-foreground block">
              Control Panel
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto py-4 min-h-0">
        <div className="px-3 space-y-1">
          {/* Back to Dashboard Link */}
          <Link
            href="/home"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md min-w-0",
              "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              "transition-all duration-200 ease-in-out group mb-4"
            )}
          >
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 flex-shrink-0" />
            <span className="truncate">Kembali ke Dasbor</span>
          </Link>

          {/* Navigation Items */}
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md min-w-0",
                  "transition-all duration-200 ease-in-out group",
                  item.current
                    ? "bg-primary/10 text-primary border-r-2 border-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                title={item.name} // Tooltip untuk nama lengkap
              >
                <item.icon className={cn(
                  "mr-3 h-4 w-4 transition-colors flex-shrink-0",
                  item.current ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-border/40 min-h-[56px]">
        <div className="flex flex-col items-center text-xs text-muted-foreground space-y-1">
          <span className="font-medium">SPPG Admin</span>
          <span className="text-[10px]">Version 1.0.0</span>
        </div>
      </div>
    </div>
  )
}
