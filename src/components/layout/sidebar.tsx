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
  Truck,
  Bell
} from "lucide-react"

import type { Permission } from "@/lib/permissions"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const [productionExpanded, setProductionExpanded] = useState(
    pathname.startsWith("/dashboard/production") || 
    pathname.startsWith("/dashboard/production-plans") || 
    pathname.startsWith("/dashboard/resource-usage")
  )
  const [menuPlanningExpanded, setMenuPlanningExpanded] = useState(pathname.startsWith("/dashboard/menu-planning") || pathname.startsWith("/dashboard/recipes"))
  const [distributionExpanded, setDistributionExpanded] = useState(
    pathname.startsWith("/dashboard/distributions") || 
    pathname.startsWith("/dashboard/distribution")
  )
  const [monitoringExpanded, setMonitoringExpanded] = useState(pathname.startsWith("/dashboard/monitoring"))
  const [qualityExpanded, setQualityExpanded] = useState(
    pathname.startsWith("/dashboard/quality") || 
    pathname.startsWith("/dashboard/quality-checks") ||
    pathname.startsWith("/dashboard/food-samples") || 
    pathname.startsWith("/dashboard/nutrition-consultations")
  )

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
      name: "Production Plans",
      href: "/dashboard/production-plans",
      icon: Calendar,
      current: pathname.startsWith("/dashboard/production-plans"),
    },
    {
      name: "Execution",
      href: "/dashboard/production/execution",
      icon: PlayCircle,
      current: pathname.startsWith("/dashboard/production/execution"),
    },
    {
      name: "Resource Usage",
      href: "/dashboard/resource-usage",
      icon: Activity,
      current: pathname.startsWith("/dashboard/resource-usage"),
    },
    {
      name: "Quality Control",
      href: "/dashboard/production/quality",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/production/quality"),
    },
  ]

  const qualitySubMenus = [
    {
      name: "Overview",
      href: "/dashboard/quality",
      icon: LayoutGrid,
      current: pathname === "/dashboard/quality",
    },
    {
      name: "Quality Checks",
      href: "/dashboard/quality-checks",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/quality-checks"),
    },
    {
      name: "Quality Checkpoints",
      href: "/dashboard/quality-checkpoints",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/quality-checkpoints"),
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
      href: "/dashboard/performance",
      icon: TrendingUp,
      current: pathname.startsWith("/dashboard/performance"),
    },
    {
      name: "Reports",
      href: "/dashboard/monitoring/reports",
      icon: FileBarChart,
      current: pathname.startsWith("/dashboard/monitoring/reports"),
    },
  ]

  const distributionSubMenus = [
    {
      name: "Overview",
      href: "/dashboard/distributions",
      icon: LayoutGrid,
      current: pathname === "/dashboard/distributions",
    },
    {
      name: "Distribution Schools",
      href: "/dashboard/distributions/schools",
      icon: School,
      current: pathname.startsWith("/dashboard/distributions/schools"),
    },
    {
      name: "Delivery Tracking",
      href: "/dashboard/distributions/tracking",
      icon: Eye,
      current: pathname.startsWith("/dashboard/distributions/tracking"),
    },
    {
      name: "Route Planning",
      href: "/dashboard/distributions/routes",
      icon: Truck,
      current: pathname.startsWith("/dashboard/distributions/routes"),
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
  ]

  const inventoryManagement = [
    {
      name: "Items Management",
      href: "/dashboard/items",
      icon: Package,
      current: pathname.startsWith("/dashboard/items"),
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
  ]

  const systemManagement = [
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      current: pathname.startsWith("/dashboard/notifications"),
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
    <div className={cn("space-y-1", !isMainSection && "mt-8")}>
      {!isMainSection && (
        <div className="px-3 mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
            {title}
          </h3>
          <div className="h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
        </div>
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
            case '/dashboard/distributions':
              return ['distribution_schools.view'];
            case '/dashboard/distributions/schools':
              return ['distribution_schools.view'];
            case '/dashboard/distributions/tracking':
              return ['delivery.view'];
            case '/dashboard/distributions/routes':
              return ['logistics.plan'];
            case '/dashboard/delivery-tracking':
              return ['production.view'];
            case '/dashboard/production':
              return ['production.view'];
            case '/dashboard/production-plans':
              return ['production.view'];
            case '/dashboard/resource-usage':
              return ['production.view'];
            case '/dashboard/production/execution':
              return ['production.view'];
            case '/dashboard/production/quality':
              return ['quality.check'];
            case '/dashboard/quality-checks':
              return ['quality.check'];
            case '/dashboard/quality-checkpoints':
              return ['quality.check'];
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
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group hover:bg-white hover:shadow-sm border border-transparent",
              item.current 
                ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm font-semibold" 
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <item.icon className={cn(
              "h-4 w-4 flex-shrink-0 transition-colors",
              item.current ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
            )} />
            <span className="truncate">{item.name}</span>
            {item.current && (
              <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
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
    <div className={cn("fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white shadow-xl hidden lg:block", className)} {...props}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-20 items-center border-b px-6 bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm border border-white/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                SPPG System
              </h1>
              <p className="text-xs text-blue-100 font-medium">
                School Food Program Management
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 bg-gray-50/50">
          <div className="space-y-2">
            {/* Core Navigation - No section header */}
            {renderNavSection("", coreNavigation, true)}

            {/* School Management */}
            {renderNavSection("School Management", schoolManagement)}

            {/* Logistics */}
            {renderNavSection("Logistics", logisticsManagement)}

            {/* Distribution with Submenu */}
            {renderExpandableSection(
              "Distribution",
              Package,
              distributionExpanded,
              setDistributionExpanded,
              distributionSubMenus,
              "/dashboard/distributions"
            )}

            {/* Inventory & Supply */}
            {renderNavSection("Inventory & Supply", inventoryManagement)}

            {/* Quality Management with Submenu */}
            {renderExpandableSection(
              "Quality Management",
              ClipboardCheck,
              qualityExpanded,
              setQualityExpanded,
              qualitySubMenus,
              "/dashboard/quality"
            )}

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
