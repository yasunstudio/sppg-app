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
    <div className={cn("pb-12 min-h-screen w-64 border-r bg-background", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            
            {/* Back to Dashboard Link */}
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors mb-4"
            >
              <ArrowLeft className="mr-3 h-4 w-4" />
              Kembali ke Dasbor
            </Link>

            {/* Admin Navigation */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  item.current
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
