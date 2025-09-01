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
  Bell,
  Menu,
  X
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { Permission } from "@/lib/permissions"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ className, isCollapsed = false, onToggle, ...props }: SidebarProps) {
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
  const [purchaseOrdersExpanded, setPurchaseOrdersExpanded] = useState(
    pathname.startsWith("/dashboard/purchase-orders")
  )

  const menuPlanningSubMenus = [
    {
      name: "Overview",
      href: "/dashboard/menu-planning",
      icon: LayoutGrid,
      current: pathname === "/dashboard/menu-planning",
    },
    {
      name: "Recipe Management",
      href: "/dashboard/recipes",
      icon: ChefHat,
      current: pathname.startsWith("/dashboard/recipes"),
    },
    {
      name: "Menu Planning",
      href: "/dashboard/menu-planning/planning",
      icon: Calendar,
      current: pathname.startsWith("/dashboard/menu-planning/planning"),
    },
    {
      name: "Nutrition Standards",
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

  const purchaseOrdersSubMenus = [
    {
      name: "Overview",
      href: "/dashboard/purchase-orders",
      icon: ClipboardCheck,
      current: pathname === "/dashboard/purchase-orders",
    },
    {
      name: "Analytics",
      href: "/dashboard/purchase-orders/analytics",
      icon: BarChart,
      current: pathname.startsWith("/dashboard/purchase-orders/analytics"),
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
      name: "My Dashboard",
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

  const systemManagement = [
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      current: pathname.startsWith("/dashboard/notifications"),
    },
    {
      name: "User Management",
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
      name: "Financial Management",
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

  const renderNavSection = (title: string, items: typeof coreNavigation, isMainSection = false) => {
    // When collapsed and not main section, render as dropdown
    if (isCollapsed && !isMainSection && items.length > 1) {
      const activeItem = items.find(item => item.current)
      const IconComponent = activeItem?.icon || items[0].icon
      
      return (
        <div className="mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                  "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
                  "active:scale-[0.98] group relative overflow-hidden",
                  "px-2 justify-center mx-1",
                  activeItem 
                    ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md border border-accent/20" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={title}
              >
                {/* Animated background for active section */}
                {activeItem && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl" />
                )}
                
                <div className="relative z-10 flex items-center justify-center">
                  <IconComponent className="h-5 w-5 flex-shrink-0 transition-colors duration-200" />
                </div>
                
                {/* Active indicator */}
                {activeItem && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-64 ml-2">
              <DropdownMenuLabel className="font-semibold text-sm">
                {title}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 cursor-pointer",
                      item.current && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                    {item.current && (
                      <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }

    // When collapsed and single item, render as normal button
    if (isCollapsed && !isMainSection && items.length === 1) {
      const item = items[0]
      return (
        <div className="mt-2">
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ease-in-out",
              "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
              "active:scale-[0.98] group relative overflow-hidden",
              "px-2 justify-center mx-1",
              item.current 
                ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md border border-accent/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
            title={item.name}
          >
            {/* Animated background for active item */}
            {item.current && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl" />
            )}
            
            <div className="relative z-10 flex items-center justify-center">
              <item.icon className="h-5 w-5 flex-shrink-0 transition-colors duration-200" />
            </div>
            
            {/* Active indicator */}
            {item.current && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
            )}
          </Link>
        </div>
      )
    }

    // Normal expanded view
    return (
      <div className={cn("space-y-1", !isMainSection && "mt-6")}>
        {!isMainSection && (
          <div className="px-3 mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 flex items-center">
              <span className="bg-gradient-to-r from-muted-foreground/60 to-muted-foreground/40 bg-clip-text">
                {title}
              </span>
            </h3>
            <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent"></div>
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
              case '/dashboard/purchase-orders/analytics':
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
                "flex items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
                "active:scale-[0.98] group relative overflow-hidden",
                isCollapsed ? "px-2 justify-center mx-1" : "px-4 gap-3 mx-2",
                item.current 
                  ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md border border-accent/20" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              {/* Animated background for active item */}
              {item.current && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl" />
              )}
              
              <div className={cn(
                "relative z-10 flex items-center",
                isCollapsed ? "justify-center" : "gap-3 w-full"
              )}>
                <item.icon className={cn(
                  "flex-shrink-0 transition-colors duration-200",
                  isCollapsed ? "h-5 w-5" : "h-4 w-4",
                  item.current ? "text-accent-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                
                <div className={cn(
                  "transition-all duration-300 ease-in-out overflow-hidden",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                  <span className="truncate font-medium">{item.name}</span>
                </div>
              </div>
              
              {/* Active indicator */}
              {item.current && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
              )}
            </Link>
          );
        })}
      </div>
    )
  }

  const renderExpandableSection = (
    title: string,
    IconComponent: any,
    isExpanded: boolean,
    setExpanded: (value: boolean) => void,
    subMenus: any[],
    pathMatch: string
  ) => {
    // When collapsed, render as dropdown
    if (isCollapsed) {
      return (
        <div className="mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                  "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
                  "active:scale-[0.98] group relative overflow-hidden",
                  "px-2 justify-center mx-1",
                  pathname.startsWith(pathMatch) 
                    ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md border border-accent/20" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={title}
              >
                {/* Animated background for active section */}
                {pathname.startsWith(pathMatch) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl" />
                )}
                
                <div className="relative z-10 flex items-center justify-center">
                  <IconComponent className="h-5 w-5 flex-shrink-0 transition-colors duration-200" />
                </div>
                
                {/* Active indicator */}
                {pathname.startsWith(pathMatch) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-64 ml-2">
              <DropdownMenuLabel className="font-semibold text-sm">
                {title}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {subMenus.map((subItem) => (
                <DropdownMenuItem key={subItem.name} asChild>
                  <Link
                    href={subItem.href}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 cursor-pointer",
                      subItem.current && "bg-accent text-accent-foreground"
                    )}
                  >
                    <subItem.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{subItem.name}</span>
                    {subItem.current && (
                      <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }

    // When expanded, render normally
    return (
      <div className="mt-8">
        <div className="px-3 mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 flex items-center">
            <span className="bg-gradient-to-r from-muted-foreground/60 to-muted-foreground/40 bg-clip-text">
              {title}
            </span>
          </h3>
          <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent"></div>
        </div>
        
        <button
          onClick={() => setExpanded(!isExpanded)}
          className={cn(
            "flex w-full items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ease-in-out",
            "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
            "active:scale-[0.98] group relative overflow-hidden",
            "px-4 gap-3 mx-2",
            pathname.startsWith(pathMatch) 
              ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md border border-accent/20" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {/* Animated background for active section */}
          {pathname.startsWith(pathMatch) && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl" />
          )}
          
          <div className="relative z-10 flex items-center w-full gap-3">
            <IconComponent className="h-4 w-4 flex-shrink-0 transition-colors duration-200" />
            
            <div className="flex-1 flex items-center justify-between">
              <span className="truncate font-medium text-left">{title}</span>
              <div className="flex-shrink-0 ml-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                )}
              </div>
            </div>
          </div>
          
          {/* Active indicator */}
          {pathname.startsWith(pathMatch) && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-2 space-y-1 pl-8 border-l-2 border-border/30 ml-6 relative">
            {/* Animated connector line */}
            <div className="absolute -left-[2px] top-0 w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent rounded-full" />
            
            {subMenus.map((subItem) => (
              <Link
                key={subItem.name}
                href={subItem.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                  "hover:bg-accent/50 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.01]",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
                  "active:scale-[0.98] group relative",
                  subItem.current 
                    ? "bg-accent/70 text-accent-foreground shadow-sm border border-accent/30" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <subItem.icon className="h-4 w-4 flex-shrink-0 transition-colors duration-200" />
                <span className="truncate">{subItem.name}</span>
                {subItem.current && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-sm" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xl hidden lg:block transition-all duration-300 ease-in-out",
      "dark:shadow-2xl dark:border-border",
      isCollapsed ? "w-20" : "w-72",
      className
    )} {...props}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={cn(
          "flex h-20 items-center border-b border-border/50 bg-gradient-to-r from-primary to-primary/90 shadow-lg",
          "relative px-4"
        )}>
          {isCollapsed ? (
            // Collapsed header - centered logo with toggle button overlay
            <div className="w-full flex items-center justify-center relative">
              <div className="flex items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 shadow-inner h-12 w-12">
                <Shield className="h-7 w-7 text-primary-foreground drop-shadow-sm" />
              </div>
              
              {/* Toggle button positioned at bottom-right corner */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className={cn(
                  "absolute -bottom-3 -right-1 h-7 w-7 p-0",
                  "text-primary-foreground/80 hover:text-primary-foreground",
                  "hover:bg-primary-foreground/20 focus:bg-primary-foreground/20",
                  "transition-all duration-200 rounded-full shadow-sm",
                  "hover:scale-110 active:scale-95",
                  "border border-primary-foreground/30 bg-primary-foreground/10"
                )}
                title="Expand sidebar"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // Expanded header - normal layout
            <div className="flex items-center w-full px-2">
              <div className="flex items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 shadow-inner h-11 w-11">
                <Shield className="h-6 w-6 text-primary-foreground drop-shadow-sm" />
              </div>
              
              <div className="flex-1 ml-4 transition-all duration-300 ease-in-out">
                <h1 className="text-xl font-bold text-primary-foreground tracking-tight leading-tight">
                  SPPG System
                </h1>
                <p className="text-xs text-primary-foreground/75 font-medium">
                  School Food Program Management
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className={cn(
                  "text-primary-foreground hover:bg-primary-foreground/15 focus:bg-primary-foreground/15",
                  "transition-all duration-200 hover:scale-105 active:scale-95 rounded-lg shadow-sm",
                  "ml-2"
                )}
                title="Collapse sidebar"
              >
                <ChevronRight className="h-5 w-5 transition-transform duration-200 rotate-180" />
              </Button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 bg-gradient-to-b from-muted/30 to-muted/10 custom-scrollbar">
          <div className="space-y-2">
            {/* Core Navigation - No section header */}
            {renderNavSection("", coreNavigation, true)}

            {/* 1. PLANNING PHASE */}
            {/* Menu Planning with Submenu */}
            {renderExpandableSection(
              "Menu Planning",
              UtensilsCrossed,
              menuPlanningExpanded,
              setMenuPlanningExpanded,
              menuPlanningSubMenus,
              "/dashboard/menu-planning"
            )}

            {/* 2. PROCUREMENT PHASE */}
            {renderNavSection("Procurement", [
              {
                name: "Suppliers",
                href: "/dashboard/suppliers",
                icon: ShoppingCart,
                current: pathname.startsWith("/dashboard/suppliers"),
              }
            ])}

            {/* Purchase Orders with Submenu */}
            {renderExpandableSection(
              "Purchase Orders",
              ClipboardCheck,
              purchaseOrdersExpanded,
              setPurchaseOrdersExpanded,
              purchaseOrdersSubMenus,
              "/dashboard/purchase-orders"
            )}

            {/* 3. INVENTORY PHASE */}
            {renderNavSection("Inventory & Materials", [
              {
                name: "Raw Materials",
                href: "/dashboard/raw-materials",
                icon: Package,
                current: pathname.startsWith("/dashboard/raw-materials"),
              },
              {
                name: "Items Management",
                href: "/dashboard/items",
                icon: Package,
                current: pathname.startsWith("/dashboard/items"),
              },
              {
                name: "Inventory Management",
                href: "/dashboard/inventory",
                icon: Package,
                current: pathname.startsWith("/dashboard/inventory"),
              }
            ])}

            {/* 4. PRODUCTION PHASE */}
            {/* Production with Submenu */}
            {renderExpandableSection(
              "Production",
              ChefHat,
              productionExpanded,
              setProductionExpanded,
              productionSubMenus,
              "/dashboard/production"
            )}

            {/* 5. QUALITY CONTROL PHASE */}
            {/* Quality Management with Submenu */}
            {renderExpandableSection(
              "Quality Management",
              ClipboardCheck,
              qualityExpanded,
              setQualityExpanded,
              qualitySubMenus,
              "/dashboard/quality"
            )}

            {/* 6. DISTRIBUTION PHASE */}
            {/* Distribution with Submenu */}
            {renderExpandableSection(
              "Distribution",
              Package,
              distributionExpanded,
              setDistributionExpanded,
              distributionSubMenus,
              "/dashboard/distributions"
            )}

            {/* Logistics Support */}
            {renderNavSection("Logistics Support", logisticsManagement)}

            {/* 7. MONITORING & ANALYTICS */}
            {/* Monitoring Submenu */}
            {renderExpandableSection(
              "Monitoring & Reports",
              Activity,
              monitoringExpanded,
              setMonitoringExpanded,
              monitoringSubMenus,
              "/dashboard/monitoring"
            )}

            {/* 8. SCHOOL MANAGEMENT */}
            {renderNavSection("School Management", schoolManagement)}

            {/* 9. OTHER FEATURES */}
            {renderNavSection("Other Features", otherFeatures)}

            {/* 10. SYSTEM MANAGEMENT */}
            {renderNavSection("System Management", systemManagement)}
          </div>
        </div>
      </div>
    </div>
  )
}
