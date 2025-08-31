"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  LayoutGrid,
  Users,
  ShoppingCart,
  Package,
  ClipboardCheck,
  MessageSquare,
  Trash,
  DollarSign,
  Activity,
  Settings,
  Shield,
  UserCheck,
  Wrench,
  UtensilsCrossed,
  ChefHat,
  Calendar,
  Heart,
  PlayCircle,
  BarChart,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronRight,
  FileBarChart,
  School,
  GraduationCap,
  TestTube,
  Truck
} from "lucide-react"

import type { Permission } from "@/lib/permissions"

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
    {
      name: "Dashboard Saya",
      href: "/dashboard/basic",
      icon: Activity,
      current: pathname.startsWith("/dashboard/basic"),
    },
    {
      name: "Schools",
      href: "/dashboard/schools",
      icon: School,
      current: pathname.startsWith("/dashboard/schools"),
    },
    {
      name: "Students",
      href: "/dashboard/students",
      icon: GraduationCap,
      current: pathname.startsWith("/dashboard/students"),
    },
    {
      name: "Classes",
      href: "/dashboard/classes",
      icon: Users,
      current: pathname.startsWith("/dashboard/classes"),
    },
    {
      name: "Vehicles",
      href: "/dashboard/vehicles",
      icon: Truck,
      current: pathname.startsWith("/dashboard/vehicles"),
    },
    {
      name: "Drivers",
      href: "/dashboard/drivers",
      icon: UserCheck,
      current: pathname.startsWith("/dashboard/drivers"),
    },
    {
      name: "Raw Materials",
      href: "/dashboard/raw-materials",
      icon: Package,
      current: pathname.startsWith("/dashboard/raw-materials"),
    },
    {
      name: "Suppliers",
      href: "/dashboard/suppliers",
      icon: ShoppingCart,
      current: pathname.startsWith("/dashboard/suppliers"),
    },
    {
      name: "Purchase Orders",
      href: "/dashboard/purchase-orders",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/purchase-orders"),
    },
    {
      name: "Inventory Management",
      href: "/dashboard/inventory",
      icon: Package,
      current: pathname.startsWith("/dashboard/inventory"),
    },
    {
      name: "Distribution Management",
      href: "/dashboard/distribution",
      icon: Package,
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
      name: "Nutrition Consultations",
      href: "/dashboard/nutrition-consultations",
      icon: Heart,
      current: pathname.startsWith("/dashboard/nutrition-consultations"),
    },
    {
      name: "Food Samples",
      href: "/dashboard/food-samples",
      icon: TestTube,
      current: pathname.startsWith("/dashboard/food-samples"),
    },
    {
      name: "Quality Standards",
      href: "/dashboard/quality-standards",
      icon: Shield,
      current: pathname.startsWith("/dashboard/quality-standards"),
    },
    {
      name: "Waste Management",
      href: "/dashboard/waste-management",
      icon: Trash,
      current: pathname.startsWith("/dashboard/waste-management"),
    },
    {
      name: "Manajemen Keuangan",
      href: "/dashboard/financial",
      icon: DollarSign,
      current: pathname.startsWith("/dashboard/financial"),
    },
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
  ]

  const monitoringSubMenus = [
    {
      name: "Real-time Monitoring",
      href: "/dashboard/monitoring/real-time",
      icon: Activity,
      current: pathname.startsWith("/dashboard/monitoring/real-time"),
    },
    {
      name: "Analytics",
      href: "/dashboard/monitoring/analytics",
      icon: BarChart,
      current: pathname.startsWith("/dashboard/monitoring/analytics"),
    },
    {
      name: "Performance",
      href: "/dashboard/monitoring/performance",
      icon: TrendingUp,
      current: pathname.startsWith("/dashboard/monitoring/performance"),
    },
    {
      name: "Reports",
      href: "/dashboard/monitoring/reports",
      icon: FileBarChart,
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
                  case '/dashboard':
                    return ['system.config']; // Only for admin dashboards
                  case '/dashboard/basic':
                    return null; // Available for all authenticated users
                  case '/dashboard/schools':
                    return ['schools.view'];
                  case '/dashboard/students':
                    return ['students.view'];
                  case '/dashboard/classes':
                    return ['students.view']; // Using existing permission since classes don't have separate permission
                  case '/dashboard/vehicles':
                    return ['production.view']; // Using production permission for logistics management
                  case '/dashboard/drivers':
                    return ['production.view']; // Using production permission for driver management
                  case '/dashboard/raw-materials':
                    return ['inventory.view'];
                  case '/dashboard/suppliers':
                    return ['suppliers.view'];
                  case '/dashboard/purchase-orders':
                    return ['purchase_orders.view'];
                  case '/dashboard/inventory':
                    return ['inventory.view'];
                  case '/dashboard/distribution':
                    return ['production.view'];
                  case '/dashboard/delivery-tracking':
                    return ['production.view'];
                  case '/dashboard/quality':
                    return ['quality.check'];
                  case '/dashboard/feedback':
                    return ['feedback.view'];
                  case '/dashboard/nutrition-consultations':
                    return ['nutrition.consult'];
                  case '/dashboard/food-samples':
                    return ['quality.check'];
                  case '/dashboard/quality-standards':
                    return ['quality.check'];
                  case '/dashboard/waste-management':
                    return ['production.view'];
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

              const requiredPermissions = getMenuPermissions(item.href);

              // If no permissions required (like basic dashboard), show for all authenticated users
              if (!requiredPermissions) {
                return (
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
              }

              return (
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
            })}

            {/* Menu Planning with Submenu */}
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
                Menu Planning
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

            {/* Production with Submenu */}
            <div>
              <button
                onClick={() => setProductionExpanded(!productionExpanded)}
                className={cn(
                  "flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname.startsWith("/dashboard/production") ? "bg-accent" : "transparent",
                  pathname.startsWith("/dashboard/production") ? "text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <ChefHat className="h-4 w-4" />
                Production Management
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

            {/* Monitoring Submenu */}
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
    </div>
  )
}
