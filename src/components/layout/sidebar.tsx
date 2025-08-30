"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import { PermissionGuard, RoleGuard } from "@/hooks/use-permissions"
import { Permission } from "@/lib/permissions"
import {
  LayoutGrid,
  Users,
  School,
  ShoppingCart,
  UtensilsCrossed,
  Truck,
  ClipboardCheck,
  Settings,
  LogOut,
  ChefHat,
  Package,
  Calculator,
  Factory,
  Calendar,
  PlayCircle,
  BarChart3,
  Wrench,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Activity,
  Heart,
  MessageSquare,
  Trash,
  Bell,
  Shield,
  UserCheck,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
    const [productionExpanded, setProductionExpanded] = useState(pathname.startsWith("/dashboard/production"))
  const [menuPlanningExpanded, setMenuPlanningExpanded] = useState(pathname.startsWith("/dashboard/menu-planning") || pathname.startsWith("/dashboard/recipes"))
  const [monitoringExpanded, setMonitoringExpanded] = useState(pathname.startsWith("/dashboard/monitoring"))

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutGrid,
      current: pathname === "/dashboard",
    },
    // CORE OPERATIONS - Main workflow
    {
      name: "Data Sekolah",
      href: "/dashboard/schools",
      icon: School,
      current: pathname.startsWith("/dashboard/schools"),
    },
    {
      name: "Inventaris & Stok",
      href: "/dashboard/inventory",
      icon: ShoppingCart,
      current: pathname.startsWith("/dashboard/inventory"),
    },
    // Menu Planning will be handled as submenu below
    // Production will be handled as submenu below
    {
      name: "Distribusi & Logistik",
      href: "/dashboard/distribution",
      icon: Truck,
      current: pathname.startsWith("/dashboard/distribution"),
    },
    {
      name: "Delivery Tracking",
      href: "/dashboard/delivery-tracking",
      icon: Package,
      current: pathname.startsWith("/dashboard/delivery-tracking"),
    },
    {
      name: "Kontrol Kualitas",
      href: "/dashboard/quality",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/quality"),
    },
    {
      name: "Feedback Management",
      href: "/dashboard/feedback",
      icon: MessageSquare,
      current: pathname.startsWith("/dashboard/feedback"),
    },
    {
      name: "Waste Management",
      href: "/dashboard/waste-management",
      icon: Trash,
      current: pathname.startsWith("/dashboard/waste-management"),
    },
    {
      name: "Posyandu",
      href: "/dashboard/posyandu",
      icon: Heart,
      current: pathname.startsWith("/dashboard/posyandu"),
    },
    // MANAGEMENT & ANALYTICS
    {
      name: "Manajemen Keuangan",
      href: "/dashboard/financial",
      icon: DollarSign,
      current: pathname.startsWith("/dashboard/financial"),
    },
    // Monitoring will be handled as submenu below
    // ADMINISTRATION (at the bottom)
    {
      name: "Manajemen Pengguna",
      href: "/dashboard/users",
      icon: Users,
      current: pathname.startsWith("/dashboard/users"),
    },
    {
      name: "Role Management",
      href: "/dashboard/roles",
      icon: Shield,
      current: pathname.startsWith("/dashboard/roles"),
    },
    {
      name: "User Role Assignment",
      href: "/dashboard/user-roles",
      icon: UserCheck,
      current: pathname.startsWith("/dashboard/user-roles"),
    },
    {
      name: "System Configuration",
      href: "/dashboard/system-config",
      icon: Settings,
      current: pathname.startsWith("/dashboard/system-config"),
    },
    {
      name: "Audit Logs",
      href: "/dashboard/audit-logs",
      icon: Shield,
      current: pathname.startsWith("/dashboard/audit-logs"),
    },
    {
      name: "Admin Panel",
      href: "/dashboard/admin",
      icon: Wrench,
      current: pathname.startsWith("/dashboard/admin"),
    },
  ]

  const menuPlanningSubMenus = [
    {
      name: "Overview",
      href: "/dashboard/menu-planning",
      icon: LayoutGrid,
      current: pathname === "/dashboard/menu-planning",
    },
    {
      name: "Manajemen Resep",
      href: "/dashboard/recipes",
      icon: ChefHat,
      current: pathname.startsWith("/dashboard/recipes"),
    },
    {
      name: "Perencanaan Menu",
      href: "/dashboard/menu-planning/planning",
      icon: Calendar,
      current: pathname.startsWith("/dashboard/menu-planning/planning"),
    },
    {
      name: "Standar Nutrisi",
      href: "/dashboard/menu-planning/nutrition",
      icon: Heart,
      current: pathname.startsWith("/dashboard/menu-planning/nutrition"),
    },
  ]

  const productionSubMenus = [
    {
      name: "Overview",
      href: "/dashboard/production",
      icon: LayoutGrid,
      current: pathname === "/dashboard/production",
    },
    {
      name: "Production Planning",
      href: "/dashboard/production/planning",
      icon: Calendar,
      current: pathname.startsWith("/dashboard/production/planning"),
    },
    {
      name: "Execution",
      href: "/dashboard/production/execution",
      icon: PlayCircle,
      current: pathname.startsWith("/dashboard/production/execution"),
    },
    {
      name: "Quality Control",
      href: "/dashboard/production/quality",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/production/quality"),
    },
    {
      name: "Resources",
      href: "/dashboard/production/resources",
      icon: Wrench,
      current: pathname.startsWith("/dashboard/production/resources"),
    },
    {
      name: "Analytics",
      href: "/dashboard/production/analytics",
      icon: BarChart3,
      current: pathname.startsWith("/dashboard/production/analytics"),
    },
  ]

  const monitoringSubMenus = [
    {
      name: "Dashboard",
      href: "/dashboard/monitoring",
      icon: LayoutGrid,
      current: pathname === "/dashboard/monitoring",
    },
    {
      name: "Analytics",
      href: "/dashboard/monitoring/analytics",
      icon: BarChart3,
      current: pathname.startsWith("/dashboard/monitoring/analytics"),
    },
    {
      name: "Reports",
      href: "/dashboard/monitoring/reports",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/monitoring/reports"),
    },
  ]

  return (
    <div className={cn("pb-12 min-h-screen w-64 border-r bg-background", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-10 px-4 text-xl font-semibold tracking-tight">
              SPPG Admin
            </h2>
            {navigation.map((item) => {
              // Define permission requirements for each menu item
              const getMenuPermissions = (href: string): Permission[] | null => {
                switch (href) {
                  case '/dashboard/schools':
                    return ['posyandu.view', 'activities.read'];
                  case '/dashboard/inventory':
                    return ['inventory.view'];
                  case '/dashboard/distribution':
                    return ['production.view'];
                  case '/dashboard/quality':
                    return ['quality.check'];
                  case '/dashboard/posyandu':
                    return ['posyandu.view'];
                  case '/dashboard/financial':
                    return ['finance.view'];
                  case '/dashboard/users':
                    return ['users.view'];
                  case '/dashboard/roles':
                    return ['system.config'];
                  case '/dashboard/user-roles':
                    return ['users.edit', 'system.config'];
                  case '/dashboard/system-config':
                    return ['system.config'];
                  case '/dashboard/audit-logs':
                    return ['audit.view'];
                  case '/dashboard/admin':
                    return ['system.config'];
                  default:
                    return null;
                }
              };

              const permissions = getMenuPermissions(item.href);
              
              const menuItem = (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    item.current ? "bg-accent" : "transparent",
                    item.current ? "text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );

              // If menu requires permissions, wrap with PermissionGuard
              if (permissions) {
                return (
                  <PermissionGuard key={item.name} permission={permissions} requireAll={false}>
                    {menuItem}
                  </PermissionGuard>
                );
              }

              // For public menu items (like Dashboard), render directly
              return menuItem;
            })}
            
            {/* Menu Planning Menu with Submenu */}
            <PermissionGuard permission={['menus.view', 'nutrition.read']} requireAll={false}>
              <div>
                <button
                  onClick={() => setMenuPlanningExpanded(!menuPlanningExpanded)}
                  className={cn(
                    "flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname.startsWith("/dashboard/menu-planning") || pathname.startsWith("/dashboard/recipes") ? "bg-accent" : "transparent",
                    pathname.startsWith("/dashboard/menu-planning") || pathname.startsWith("/dashboard/recipes") ? "text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Perencanaan Menu
                  {menuPlanningExpanded ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </button>
                
                {menuPlanningExpanded && (
                  <div className="mt-1 space-y-1 pl-6">
                    {menuPlanningSubMenus.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          subItem.current ? "bg-accent" : "transparent",
                          subItem.current ? "text-accent-foreground" : "text-muted-foreground"
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </PermissionGuard>
            
            {/* Production Menu with Submenu */}
            <PermissionGuard permission={['production.view']} requireAll={false}>
              <div>
                <button
                  onClick={() => setProductionExpanded(!productionExpanded)}
                  className={cn(
                    "flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname.startsWith("/dashboard/production") ? "bg-accent" : "transparent",
                    pathname.startsWith("/dashboard/production") ? "text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <Factory className="h-4 w-4" />
                  Produksi Makanan
                  {productionExpanded ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </button>
              
              {productionExpanded && (
                <div className="mt-1 space-y-1 pl-6">
                  {productionSubMenus.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        subItem.current ? "bg-accent" : "transparent",
                        subItem.current ? "text-accent-foreground" : "text-muted-foreground"
                      )}
                    >
                      <subItem.icon className="h-4 w-4" />
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
              </div>
            </PermissionGuard>

            {/* Monitoring Menu with Submenu */}
            <div>
              <button
                onClick={() => setMonitoringExpanded(!monitoringExpanded)}
                className={cn(
                  "flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname.startsWith("/dashboard/monitoring") ? "bg-accent" : "transparent",
                  pathname.startsWith("/dashboard/monitoring") ? "text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <Activity className="h-4 w-4" />
                Monitoring & Reports
                {monitoringExpanded ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </button>
              
              {monitoringExpanded && (
                <div className="mt-1 space-y-1 pl-6">
                  {monitoringSubMenus.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        subItem.current ? "bg-accent" : "transparent",
                        subItem.current ? "text-accent-foreground" : "text-muted-foreground"
                      )}
                    >
                      <subItem.icon className="h-4 w-4" />
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  )
}
