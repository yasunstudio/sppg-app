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

  // Group navigation items by logical sections
  const coreNavigation = [
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
  ]

  const schoolManagement = [
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
  ]

  const logisticsManagement = [
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
  ]

  const inventoryManagement = [
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
  ]

  const qualityManagement = [
    {
      name: "Kontrol Kualitas",
      href: "/dashboard/quality",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/quality"),
    },
    {
      name: "Quality Standards",
      href: "/dashboard/quality-standards",
      icon: Shield,
      current: pathname.startsWith("/dashboard/quality-standards"),
    },
    {
      name: "Food Samples",
      href: "/dashboard/food-samples",
      icon: TestTube,
      current: pathname.startsWith("/dashboard/food-samples"),
    },
    {
      name: "Nutrition Consultations",
      href: "/dashboard/nutrition-consultations",
      icon: Heart,
      current: pathname.startsWith("/dashboard/nutrition-consultations"),
    },
  ]

  const systemManagement = [
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

  const otherFeatures = [
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
      name: "Feedback Management",
      href: "/dashboard/feedback",
      icon: MessageSquare,
      current: pathname.startsWith("/dashboard/feedback"),
    },
  ]

  const renderNavSection = (title: string, items: typeof coreNavigation, isMainSection = false) => (
    <div className={cn("space-y-1", !isMainSection && "mt-6")}>
      {!isMainSection && (
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </h3>
      )}
      {items.map((item) => {
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

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              item.current ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </Link>
        );
      })}
    </div>
  )

  const renderExpandableSection = (
    title: string,
    IconComponent: any,
    isExpanded: boolean,
    setExpanded: (value: boolean) => void,
    subMenus: any[],
    pathMatch: string
  ) => (
    <div className="mt-6">
      <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h3>
      <button
        onClick={() => setExpanded(!isExpanded)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
          pathname.startsWith(pathMatch) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )}
      >
        <IconComponent className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left truncate">{title}</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-1 space-y-1 pl-6">
          {subMenus.map((subItem) => (
            <Link
              key={subItem.name}
              href={subItem.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                subItem.current ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <subItem.icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{subItem.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className={cn("fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden lg:block", className)} {...props}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold tracking-tight">
            SPPG Admin
          </h2>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {/* Core Navigation - No section header */}
            {renderNavSection("", coreNavigation, true)}

            {/* School Management */}
            {renderNavSection("School Management", schoolManagement)}

            {/* Logistics */}
            {renderNavSection("Logistics", logisticsManagement)}

            {/* Inventory & Supply */}
            {renderNavSection("Inventory & Supply", inventoryManagement)}

            {/* Quality Management */}
            {renderNavSection("Quality Management", qualityManagement)}

            {/* Menu Planning with Submenu */}
            {renderExpandableSection(
              "Menu Planning",
              UtensilsCrossed,
              menuPlanningExpanded,
              setMenuPlanningExpanded,
              menuPlanningSubMenus,
              "/dashboard/menu-planning"
            )}

            {/* Production with Submenu */}
            {renderExpandableSection(
              "Production",
              ChefHat,
              productionExpanded,
              setProductionExpanded,
              productionSubMenus,
              "/dashboard/production"
            )}

            {/* Monitoring Submenu */}
            {renderExpandableSection(
              "Monitoring & Reports",
              Activity,
              monitoringExpanded,
              setMonitoringExpanded,
              monitoringSubMenus,
              "/dashboard/monitoring"
            )}

            {/* Other Features */}
            {renderNavSection("Other Features", otherFeatures)}

            {/* System Management */}
            {renderNavSection("System Management", systemManagement)}
          </div>
        </div>
      </div>
    </div>
  )
}
