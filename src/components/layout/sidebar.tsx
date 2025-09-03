"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { hasPermission } from "@/lib/permissions"
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
  BookOpen,
  User,
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
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ className, isCollapsed = false, onToggle, isMobileOpen = false, onMobileClose, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  // Get user roles for permission checking
  const userRoles = session?.user?.roles?.map((ur: any) => ur.role.name) || []
  
  // Helper function to check if user has permission
  const checkPermission = (permissions: Permission[] | null): boolean => {
    if (!permissions || permissions.length === 0) return true // No permission required
    return permissions.some(permission => hasPermission(userRoles, permission))
  }
  
  // Helper function to check if user has access to any submenu items
  const hasAnySubMenuAccess = (subMenus: any[]): boolean => {
    return subMenus.some(subItem => checkPermission(getMenuPermissions(subItem.href)))
  }
  
  // Define permission requirements for each menu item
  const getMenuPermissions = (href: string): Permission[] | null => {
    switch (href) {
      case '/dashboard':
        return ['system.config']; // Only for admin dashboards
      case '/dashboard/schools':
        return ['schools.view'];
      case '/dashboard/students':
        return ['students.view'];
      case '/dashboard/classes':
        return ['students.view']; // Using existing permission since classes don't have separate permission
      case '/dashboard/vehicles':
        return ['production.view']; // Using production permission for logistics management
      case '/dashboard/drivers':
        return ['drivers.view']; // Updated to use new driver permission
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
        return ['distributions.view']; // Updated to use new distribution permission
      case '/dashboard/distributions/schools':
        return ['distributions.view']; // Updated to use new distribution permission
      case '/dashboard/distributions/tracking':
        return ['distributions.track']; // Updated to use new distribution permission
      case '/dashboard/distributions/routes':
        return ['distributions.view']; // Updated to use new distribution permission
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
      case '/dashboard/recipes':
        return ['recipes.view']; // Updated to use new recipe permission
      case '/dashboard/menu-planning':
        return ['menus.view']; // Updated to use new menu permission
      case '/dashboard/menu-planning/create':
        return ['menus.create'];
      case '/dashboard/menu-planning/planning':
        return ['menus.view'];
      case '/dashboard/recipes/new':
        return ['recipes.create'];
      case '/dashboard/feedback':
        return ['feedback.view'];
      case '/dashboard/nutrition-consultations':
        return ['nutrition.consult'];
      case '/dashboard/food-samples':
        return ['quality.check'];
      case '/dashboard/quality-standards':
        return ['quality.check'];
      case '/dashboard/waste-management':
        return ['waste.view']; // Updated to use new waste permission
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
  
  // Helper function to handle link clicks on mobile
  const handleMobileLinkClick = () => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose()
    }
  }
  
  const [productionExpanded, setProductionExpanded] = useState(false)
  const [menuPlanningExpanded, setMenuPlanningExpanded] = useState(false)
  const [distributionExpanded, setDistributionExpanded] = useState(false)
  const [monitoringExpanded, setMonitoringExpanded] = useState(false)
  const [qualityExpanded, setQualityExpanded] = useState(false)

  // Set initial expanded state based on current pathname
  useEffect(() => {
    setProductionExpanded(
      pathname.startsWith("/dashboard/production") || 
      pathname.startsWith("/dashboard/production-plans") || 
      pathname.startsWith("/dashboard/resource-usage")
    )
    setMenuPlanningExpanded(
      pathname.startsWith("/dashboard/menu-planning") || 
      pathname.startsWith("/dashboard/recipes")
    )
    setDistributionExpanded(
      pathname.startsWith("/dashboard/distributions") || 
      pathname.startsWith("/dashboard/distribution")
    )
    setMonitoringExpanded(pathname.startsWith("/dashboard/monitoring"))
    setQualityExpanded(
      pathname.startsWith("/dashboard/quality") || 
      pathname.startsWith("/dashboard/quality-checks") ||
      pathname.startsWith("/dashboard/food-samples") || 
      pathname.startsWith("/dashboard/nutrition-consultations")
    )
  }, [pathname])

  const menuPlanningSubMenus = [
    {
      name: "Ringkasan",
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
    {
      name: "AI Planner",
      href: "/dashboard/menu-planning/ai-planner",
      icon: TrendingUp,
      current: pathname.startsWith("/dashboard/menu-planning/ai-planner"),
    },
  ]

  const productionSubMenus = [
    {
      name: "Dashboard Produksi",
      href: "/dashboard/production",
      icon: LayoutGrid,
      current: pathname === "/dashboard/production",
    },
    {
      name: "Rencana Produksi",
      href: "/dashboard/production-plans",
      icon: Calendar,
      current: pathname.startsWith("/dashboard/production-plans"),
    },
    {
      name: "Eksekusi Produksi",
      href: "/dashboard/production/execution",
      icon: PlayCircle,
      current: pathname.startsWith("/dashboard/production/execution"),
    },
    {
      name: "Batch Produksi",
      href: "/dashboard/production/batches",
      icon: Package,
      current: pathname.startsWith("/dashboard/production/batches"),
    },
    {
      name: "Manajemen Sumber Daya",
      href: "/dashboard/production/resources",
      icon: Wrench,
      current: pathname.startsWith("/dashboard/production/resources"),
    },
    {
      name: "Optimasi AI",
      href: "/dashboard/production/ai-optimizer",
      icon: TrendingUp,
      current: pathname.startsWith("/dashboard/production/ai-optimizer"),
    },
    {
      name: "Analitik Produksi",
      href: "/dashboard/production/analytics",
      icon: BarChart,
      current: pathname.startsWith("/dashboard/production/analytics"),
    },
  ]

  const qualitySubMenus = [
    {
      name: "Dashboard Kualitas",
      href: "/dashboard/quality",
      icon: LayoutGrid,
      current: pathname === "/dashboard/quality",
    },
    {
      name: "Inspeksi Kualitas",
      href: "/dashboard/quality-checks",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/quality-checks"),
    },
    {
      name: "Titik Kontrol Kritis",
      href: "/dashboard/quality-checkpoints",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/quality-checkpoints"),
    },
    {
      name: "Standar Mutu",
      href: "/dashboard/quality-standards",
      icon: Shield,
      current: pathname.startsWith("/dashboard/quality-standards"),
    },
  ]

  const monitoringSubMenus = [
    {
      name: "Dashboard Monitoring",
      href: "/dashboard/monitoring",
      icon: LayoutGrid,
      current: pathname === "/dashboard/monitoring",
    },
    {
      name: "Monitoring Real-time",
      href: "/dashboard/monitoring/real-time",
      icon: Activity,
      current: pathname.startsWith("/dashboard/monitoring/real-time"),
    },
    {
      name: "Analitik & Insights",
      href: "/dashboard/monitoring/analytics",
      icon: BarChart,
      current: pathname.startsWith("/dashboard/monitoring/analytics"),
    },
    {
      name: "Evaluasi Kinerja",
      href: "/dashboard/performance",
      icon: TrendingUp,
      current: pathname.startsWith("/dashboard/performance"),
    },
    {
      name: "Laporan Eksekutif",
      href: "/dashboard/monitoring/reports",
      icon: FileBarChart,
      current: pathname.startsWith("/dashboard/monitoring/reports"),
    },
  ]

  const distributionSubMenus = [
    {
      name: "Ringkasan",
      href: "/dashboard/distributions",
      icon: LayoutGrid,
      current: pathname === "/dashboard/distributions",
    },
    {
      name: "Sekolah Distribusi",
      href: "/dashboard/distributions/schools",
      icon: School,
      current: pathname.startsWith("/dashboard/distributions/schools"),
    },
    {
      name: "Pelacakan Pengiriman",
      href: "/dashboard/distributions/tracking",
      icon: Eye,
      current: pathname.startsWith("/dashboard/distributions/tracking"),
    },
    {
      name: "Perencanaan Rute",
      href: "/dashboard/distributions/routes",
      icon: Truck,
      current: pathname.startsWith("/dashboard/distributions/routes"),
    },
  ]

  // Group navigation items by logical sections
  const coreNavigation = [
    {
      name: "Beranda",
      href: "/dashboard",
      icon: LayoutGrid,
      current: pathname === "/dashboard",
    },
  ]

  // DATA MASTER SECTION - Foundation data
  const dataMasterManagement = [
    {
      name: "Sekolah",
      href: "/dashboard/schools",
      icon: School,
      current: pathname.startsWith("/dashboard/schools"),
    },
    {
      name: "Siswa",
      href: "/dashboard/students",
      icon: GraduationCap,
      current: pathname.startsWith("/dashboard/students"),
    },
    {
      name: "Kelas",
      href: "/dashboard/classes",
      icon: Users,
      current: pathname.startsWith("/dashboard/classes"),
    },
    {
      name: "Bahan Baku",
      href: "/dashboard/raw-materials",
      icon: Package,
      current: pathname.startsWith("/dashboard/raw-materials"),
    },
    {
      name: "Pemasok",
      href: "/dashboard/suppliers",
      icon: ShoppingCart,
      current: pathname.startsWith("/dashboard/suppliers"),
    },
    {
      name: "Kendaraan",
      href: "/dashboard/vehicles",
      icon: Truck,
      current: pathname.startsWith("/dashboard/vehicles"),
    },
    {
      name: "Driver",
      href: "/dashboard/drivers",
      icon: UserCheck,
      current: pathname.startsWith("/dashboard/drivers"),
    },
  ]

  // PROCUREMENT SECTION - Combined procurement activities
  const procurementManagement = [
    {
      name: "Order Pembelian",
      href: "/dashboard/purchase-orders",
      icon: ClipboardCheck,
      current: pathname.startsWith("/dashboard/purchase-orders"),
    },
  ]

  // INVENTORY SECTION - After procurement
  const inventoryManagement = [
    {
      name: "Manajemen Item",
      href: "/dashboard/items",
      icon: Package,
      current: pathname.startsWith("/dashboard/items"),
    },
    {
      name: "Inventori",
      href: "/dashboard/inventory",
      icon: Package,
      current: pathname.startsWith("/dashboard/inventory"),
    },
    {
      name: "Resep",
      href: "/dashboard/recipes",
      icon: BookOpen,
      current: pathname.startsWith("/dashboard/recipes"),
    },
    {
      name: "Penggunaan Sumber Daya",
      href: "/dashboard/resource-usage",
      icon: Activity,
      current: pathname.startsWith("/dashboard/resource-usage"),
    },
  ]

  // PROFESSIONAL SERVICES
  const professionalServices = [
    {
      name: "Konsultasi Ahli Gizi",
      href: "/dashboard/nutrition-consultations",
      icon: Heart,
      current: pathname.startsWith("/dashboard/nutrition-consultations"),
    },
    {
      name: "Uji Laboratorium",
      href: "/dashboard/food-samples",
      icon: TestTube,
      current: pathname.startsWith("/dashboard/food-samples"),
    },
  ]

  // USER MANAGEMENT
  const userManagement = [
    {
      name: "Profil Pengguna",
      href: "/dashboard/profile",
      icon: User,
      current: pathname.startsWith("/dashboard/profile"),
    },
  ]

  const systemManagement = [
    {
      name: "Notifikasi",
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
      name: "Manajemen Role",
      href: "/dashboard/roles",
      icon: Shield,
      current: pathname.startsWith("/dashboard/roles"),
    },
    {
      name: "Penugasan Role Pengguna",
      href: "/dashboard/user-roles",
      icon: UserCheck,
      current: pathname.startsWith("/dashboard/user-roles"),
    },
    {
      name: "Konfigurasi Sistem",
      href: "/dashboard/system-config",
      icon: Settings,
      current: pathname.startsWith("/dashboard/system-config"),
    },
    {
      name: "Log Audit",
      href: "/dashboard/audit-logs",
      icon: Shield,
      current: pathname.startsWith("/dashboard/audit-logs"),
    },
    {
      name: "Panel Admin",
      href: "/dashboard/admin",
      icon: Wrench,
      current: pathname.startsWith("/dashboard/admin"),
    },
  ]

  const otherFeatures = [
    {
      name: "Manajemen Limbah",
      href: "/dashboard/waste-management",
      icon: Trash,
      current: pathname.startsWith("/dashboard/waste-management"),
    },
    {
      name: "Keuangan & Anggaran",
      href: "/dashboard/financial",
      icon: DollarSign,
      current: pathname.startsWith("/dashboard/financial"),
    },
    {
      name: "Evaluasi & Feedback",
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
                    onClick={handleMobileLinkClick}
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
            onClick={handleMobileLinkClick}
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
          const requiredPermissions = getMenuPermissions(item.href);
          
          // Skip rendering this menu item if user doesn't have required permissions
          if (!checkPermission(requiredPermissions)) {
            return null;
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleMobileLinkClick}
              className={cn(
                "flex items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
                "active:scale-[0.98] group relative overflow-hidden",
                isCollapsed ? "px-2 justify-center mx-1" : "px-4 gap-3 mx-2",
                item.current 
                  ? "bg-primary/15 text-primary border border-primary/25 shadow-md font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              {/* Active indicator */}
              {item.current && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
              )}
              
              <div className={cn(
                "relative z-10 flex items-center",
                isCollapsed ? "justify-center" : "gap-3 w-full"
              )}>
                <item.icon className={cn(
                  "flex-shrink-0 transition-colors duration-200",
                  isCollapsed ? "h-5 w-5" : "h-4 w-4",
                  item.current ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
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
    // Check if user has access to any submenu items
    if (!hasAnySubMenuAccess(subMenus)) {
      return null; // Don't render the section if user has no access to any submenu
    }
    
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
              {subMenus.map((subItem) => {
                const subMenuPermissions = getMenuPermissions(subItem.href);
                
                // Skip rendering this submenu item if user doesn't have required permissions
                if (!checkPermission(subMenuPermissions)) {
                  return null;
                }
                
                return (
                  <DropdownMenuItem key={subItem.name} asChild>
                    <Link
                      href={subItem.href}
                      onClick={handleMobileLinkClick}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 cursor-pointer",
                        subItem.current 
                          ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <subItem.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{subItem.name}</span>
                      {subItem.current && (
                        <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
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
              ? "bg-primary/15 text-primary border border-primary/25 shadow-md font-semibold" 
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
            
            {subMenus.map((subItem) => {
              const subMenuPermissions = getMenuPermissions(subItem.href);
              
              // Skip rendering this submenu item if user doesn't have required permissions
              if (!checkPermission(subMenuPermissions)) {
                return null;
              }
              
              return (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  onClick={handleMobileLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                    "hover:bg-accent/50 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.01]",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/40",
                    "active:scale-[0.98] group relative",
                    subItem.current 
                      ? "bg-primary/10 text-primary border border-primary/20 font-semibold shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <subItem.icon className="h-4 w-4 flex-shrink-0 transition-colors duration-200" />
                  <span className="truncate">{subItem.name}</span>
                  {subItem.current && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-primary rounded-full shadow-sm" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
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
                title="Buka sidebar"
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
                  Aplikasi SPPG
                </h1>
                <p className="text-xs text-primary-foreground/75 font-medium">
                  Sistem Program Pangan Gizi Sekolah
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
                title="Tutup sidebar"
              >
                <ChevronRight className="h-5 w-5 transition-transform duration-200 rotate-180" />
              </Button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 bg-gradient-to-b from-muted/30 to-muted/10 custom-scrollbar">
          <div className="space-y-2">
            {/* 1. CORE NAVIGATION */}
            {renderNavSection("", coreNavigation, true)}

            {/* 2. DATA MASTER - Foundation Data */}
            {renderNavSection("Data Master", dataMasterManagement)}

            {/* 3. PLANNING PHASE */}
            {renderExpandableSection(
              "Perencanaan Menu",
              UtensilsCrossed,
              menuPlanningExpanded,
              setMenuPlanningExpanded,
              menuPlanningSubMenus,
              "/dashboard/menu-planning"
            )}

            {/* 4. PROCUREMENT PHASE */}
            {renderNavSection("Pengadaan", procurementManagement)}

            {/* 5. INVENTORY PHASE */}
            {renderNavSection("Inventori & Material", inventoryManagement)}

            {/* 6. PRODUCTION PHASE */}
            {renderExpandableSection(
              "Produksi",
              ChefHat,
              productionExpanded,
              setProductionExpanded,
              productionSubMenus,
              "/dashboard/production"
            )}

            {/* 7. QUALITY CONTROL PHASE */}
            {renderExpandableSection(
              "Manajemen Kualitas",
              ClipboardCheck,
              qualityExpanded,
              setQualityExpanded,
              qualitySubMenus,
              "/dashboard/quality"
            )}

            {/* 8. DISTRIBUTION PHASE */}
            {renderExpandableSection(
              "Distribusi",
              Package,
              distributionExpanded,
              setDistributionExpanded,
              distributionSubMenus,
              "/dashboard/distributions"
            )}

            {/* 9. MONITORING & ANALYTICS */}
            {renderExpandableSection(
              "Monitoring & Laporan",
              Activity,
              monitoringExpanded,
              setMonitoringExpanded,
              monitoringSubMenus,
              "/dashboard/monitoring"
            )}

            {/* 10. PROFESSIONAL SERVICES */}
            {renderNavSection("Layanan Profesional", professionalServices)}

            {/* 11. USER MANAGEMENT */}
            {renderNavSection("Pengguna", userManagement)}

            {/* 12. OTHER FEATURES */}
            {renderNavSection("Fitur Lainnya", otherFeatures)}

            {/* 13. SYSTEM MANAGEMENT */}
            {renderNavSection("Manajemen Sistem", systemManagement)}
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-screen w-72 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xl lg:hidden transition-all duration-300 ease-in-out",
        "dark:shadow-2xl dark:border-border",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Mobile Header */}
          <div className="flex h-16 items-center border-b border-border/50 bg-gradient-to-r from-primary to-primary/90 shadow-lg px-4">
            <div className="flex items-center w-full">
              <div className="flex items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 shadow-inner h-10 w-10">
                <Shield className="h-5 w-5 text-primary-foreground drop-shadow-sm" />
              </div>
              
              <div className="flex-1 ml-3">
                <h1 className="text-lg font-bold text-primary-foreground tracking-tight leading-tight">
                  Aplikasi SPPG
                </h1>
                <p className="text-xs text-primary-foreground/75 font-medium">
                  Sistem Program Pangan Gizi Sekolah
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileClose}
                className="text-primary-foreground hover:bg-primary-foreground/15 focus:bg-primary-foreground/15 transition-all duration-200 hover:scale-105 active:scale-95 rounded-lg shadow-sm ml-2"
                title="Tutup menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3 bg-gradient-to-b from-muted/30 to-muted/10">
            <div className="space-y-2">
              {/* Core Navigation */}
              {renderNavSection("", coreNavigation, true)}

              {/* Data Master */}
              {renderNavSection("Data Master", dataMasterManagement)}

              {/* Menu Planning */}
              {renderExpandableSection(
                "Perencanaan Menu",
                UtensilsCrossed,
                menuPlanningExpanded,
                setMenuPlanningExpanded,
                menuPlanningSubMenus,
                "/dashboard/menu-planning"
              )}

              {/* Procurement */}
              {renderNavSection("Pengadaan", procurementManagement)}

              {/* Inventory */}
              {renderNavSection("Inventori & Material", inventoryManagement)}

              {/* Production */}
              {renderExpandableSection(
                "Produksi",
                ChefHat,
                productionExpanded,
                setProductionExpanded,
                productionSubMenus,
                "/dashboard/production"
              )}

              {/* Quality Management */}
              {renderExpandableSection(
                "Manajemen Kualitas",
                ClipboardCheck,
                qualityExpanded,
                setQualityExpanded,
                qualitySubMenus,
                "/dashboard/quality"
              )}

              {/* Distribution */}
              {renderExpandableSection(
                "Distribusi",
                Package,
                distributionExpanded,
                setDistributionExpanded,
                distributionSubMenus,
                "/dashboard/distributions"
              )}

              {/* Monitoring */}
              {renderExpandableSection(
                "Monitoring & Laporan",
                Activity,
                monitoringExpanded,
                setMonitoringExpanded,
                monitoringSubMenus,
                "/dashboard/monitoring"
              )}

              {/* Professional Services */}
              {renderNavSection("Layanan Profesional", professionalServices)}

              {/* User Management */}
              {renderNavSection("Pengguna", userManagement)}

              {/* Other Features */}
              {renderNavSection("Fitur Lainnya", otherFeatures)}

              {/* System Management */}
              {renderNavSection("Manajemen Sistem", systemManagement)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
