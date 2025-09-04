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
  FileBarChart,
  School,
  GraduationCap,
  TestTube,
  Truck,
  Bell,
  BookOpen,
  User
} from "lucide-react"

import type { MenuItem, MenuSection } from "../types/sidebar.types"

export const CORE_NAVIGATION: MenuItem[] = [
  {
    name: "Beranda",
    href: "/dashboard",
    icon: LayoutGrid,
    current: false,
  },
]

export const DATA_MASTER_MANAGEMENT: MenuItem[] = [
  {
    name: "Sekolah",
    href: "/dashboard/schools",
    icon: School,
    current: false,
  },
  {
    name: "Siswa",
    href: "/dashboard/students",
    icon: GraduationCap,
    current: false,
  },
  {
    name: "Kelas",
    href: "/dashboard/classes",
    icon: Users,
    current: false,
  },
  {
    name: "Bahan Baku",
    href: "/dashboard/raw-materials",
    icon: Package,
    current: false,
  },
  {
    name: "Pemasok",
    href: "/dashboard/suppliers",
    icon: ShoppingCart,
    current: false,
  },
  {
    name: "Kendaraan",
    href: "/dashboard/vehicles",
    icon: Truck,
    current: false,
  },
  {
    name: "Driver",
    href: "/dashboard/drivers",
    icon: UserCheck,
    current: false,
  },
]

export const PROCUREMENT_MANAGEMENT: MenuItem[] = [
  {
    name: "Order Pembelian",
    href: "/dashboard/purchase-orders",
    icon: ClipboardCheck,
    current: false,
  },
]

export const INVENTORY_MANAGEMENT: MenuItem[] = [
  {
    name: "Manajemen Item",
    href: "/dashboard/items",
    icon: Package,
    current: false,
  },
  {
    name: "Inventori",
    href: "/dashboard/inventory",
    icon: Package,
    current: false,
  },
  {
    name: "Resep",
    href: "/dashboard/recipes",
    icon: BookOpen,
    current: false,
  },
  {
    name: "Penggunaan Sumber Daya",
    href: "/dashboard/resource-usage",
    icon: Activity,
    current: false,
  },
]

export const MENU_PLANNING_SUBMENUS: MenuItem[] = [
  {
    name: "Ringkasan",
    href: "/dashboard/menu-planning",
    icon: LayoutGrid,
    current: false,
  },
  {
    name: "Manajemen Resep",
    href: "/dashboard/recipes",
    icon: ChefHat,
    current: false,
  },
  {
    name: "Perencanaan Menu",
    href: "/dashboard/menu-planning/planning",
    icon: Calendar,
    current: false,
  },
  {
    name: "Standar Nutrisi",
    href: "/dashboard/menu-planning/nutrition",
    icon: Heart,
    current: false,
  },
  {
    name: "AI Planner",
    href: "/dashboard/menu-planning/ai-planner",
    icon: TrendingUp,
    current: false,
  },
]

export const PRODUCTION_SUBMENUS: MenuItem[] = [
  {
    name: "Dashboard Produksi",
    href: "/dashboard/production",
    icon: LayoutGrid,
    current: false,
  },
  {
    name: "Rencana Produksi",
    href: "/dashboard/production-plans",
    icon: Calendar,
    current: false,
  },
  {
    name: "Eksekusi Produksi",
    href: "/dashboard/production/execution",
    icon: PlayCircle,
    current: false,
  },
  {
    name: "Batch Produksi",
    href: "/dashboard/production/batches",
    icon: Package,
    current: false,
  },
  {
    name: "Manajemen Sumber Daya",
    href: "/dashboard/production/resources",
    icon: Wrench,
    current: false,
  },
  {
    name: "Optimasi AI",
    href: "/dashboard/production/ai-optimizer",
    icon: TrendingUp,
    current: false,
  },
  {
    name: "Analitik Produksi",
    href: "/dashboard/production/analytics",
    icon: BarChart,
    current: false,
  },
]

export const QUALITY_SUBMENUS: MenuItem[] = [
  {
    name: "Dashboard Kualitas",
    href: "/dashboard/quality",
    icon: LayoutGrid,
    current: false,
  },
  {
    name: "Inspeksi Kualitas",
    href: "/dashboard/quality-checks",
    icon: ClipboardCheck,
    current: false,
  },
  {
    name: "Titik Kontrol Kritis",
    href: "/dashboard/quality-checkpoints",
    icon: ClipboardCheck,
    current: false,
  },
  {
    name: "Standar Mutu",
    href: "/dashboard/quality-standards",
    icon: Shield,
    current: false,
  },
]

export const DISTRIBUTION_SUBMENUS: MenuItem[] = [
  {
    name: "Ringkasan",
    href: "/dashboard/distributions",
    icon: LayoutGrid,
    current: false,
  },
  {
    name: "Sekolah Distribusi",
    href: "/dashboard/distributions/schools",
    icon: School,
    current: false,
  },
  {
    name: "Pelacakan Pengiriman",
    href: "/dashboard/distributions/tracking",
    icon: Eye,
    current: false,
  },
  {
    name: "Perencanaan Rute",
    href: "/dashboard/distributions/routes",
    icon: Truck,
    current: false,
  },
]

export const MONITORING_SUBMENUS: MenuItem[] = [
  {
    name: "Dashboard Monitoring",
    href: "/dashboard/monitoring",
    icon: LayoutGrid,
    current: false,
  },
  {
    name: "Monitoring Real-time",
    href: "/dashboard/monitoring/real-time",
    icon: Activity,
    current: false,
  },
  {
    name: "Analitik & Insights",
    href: "/dashboard/monitoring/analytics",
    icon: BarChart,
    current: false,
  },
  {
    name: "Evaluasi Kinerja",
    href: "/dashboard/performance",
    icon: TrendingUp,
    current: false,
  },
  {
    name: "Laporan Eksekutif",
    href: "/dashboard/monitoring/reports",
    icon: FileBarChart,
    current: false,
  },
]

export const PROFESSIONAL_SERVICES: MenuItem[] = [
  {
    name: "Konsultasi Ahli Gizi",
    href: "/dashboard/nutrition-consultations",
    icon: Heart,
    current: false,
  },
  {
    name: "Uji Laboratorium",
    href: "/dashboard/food-samples",
    icon: TestTube,
    current: false,
  },
]

export const USER_MANAGEMENT: MenuItem[] = [
  {
    name: "Profil Pengguna",
    href: "/dashboard/profile",
    icon: User,
    current: false,
  },
]

export const SYSTEM_MANAGEMENT: MenuItem[] = [
  {
    name: "Notifikasi",
    href: "/dashboard/notifications",
    icon: Bell,
    current: false,
  },
  {
    name: "Manajemen Pengguna",
    href: "/dashboard/users",
    icon: Users,
    current: false,
  },
  {
    name: "Manajemen Role",
    href: "/dashboard/roles",
    icon: Shield,
    current: false,
  },
  {
    name: "Penugasan Role Pengguna",
    href: "/dashboard/user-roles",
    icon: UserCheck,
    current: false,
  },
  {
    name: "Konfigurasi Sistem",
    href: "/dashboard/system-config",
    icon: Settings,
    current: false,
  },
  {
    name: "Log Audit",
    href: "/dashboard/audit-logs",
    icon: Shield,
    current: false,
  },
  {
    name: "Panel Admin",
    href: "/dashboard/admin",
    icon: Wrench,
    current: false,
  },
]

export const OTHER_FEATURES: MenuItem[] = [
  {
    name: "Manajemen Limbah",
    href: "/dashboard/waste-management",
    icon: Trash,
    current: false,
  },
  {
    name: "Keuangan & Anggaran",
    href: "/dashboard/financial",
    icon: DollarSign,
    current: false,
  },
  {
    name: "Evaluasi & Feedback",
    href: "/dashboard/feedback",
    icon: MessageSquare,
    current: false,
  },
]

// Main menu structure configuration
export const SIDEBAR_MENU_STRUCTURE: MenuSection[] = [
  {
    title: "",
    items: CORE_NAVIGATION,
    isExpandable: false,
  },
  {
    title: "Data Master",
    items: DATA_MASTER_MANAGEMENT,
    isExpandable: false,
  },
  {
    title: "Perencanaan Menu",
    items: MENU_PLANNING_SUBMENUS,
    isExpandable: true,
    menuType: "menuPlanning",
    pathMatch: "/dashboard/menu-planning",
  },
  {
    title: "Pengadaan",
    items: PROCUREMENT_MANAGEMENT,
    isExpandable: false,
  },
  {
    title: "Inventori & Material",
    items: INVENTORY_MANAGEMENT,
    isExpandable: false,
  },
  {
    title: "Produksi",
    items: PRODUCTION_SUBMENUS,
    isExpandable: true,
    menuType: "production",
    pathMatch: "/dashboard/production",
  },
  {
    title: "Manajemen Kualitas",
    items: QUALITY_SUBMENUS,
    isExpandable: true,
    menuType: "quality",
    pathMatch: "/dashboard/quality",
  },
  {
    title: "Distribusi",
    items: DISTRIBUTION_SUBMENUS,
    isExpandable: true,
    menuType: "distribution",
    pathMatch: "/dashboard/distribution",
  },
  {
    title: "Monitoring & Laporan",
    items: MONITORING_SUBMENUS,
    isExpandable: true,
    menuType: "monitoring",
    pathMatch: "/dashboard/monitoring",
  },
  {
    title: "Layanan Profesional",
    items: PROFESSIONAL_SERVICES,
    isExpandable: false,
  },
  {
    title: "Pengguna",
    items: USER_MANAGEMENT,
    isExpandable: false,
  },
  {
    title: "Fitur Lainnya",
    items: OTHER_FEATURES,
    isExpandable: false,
  },
  {
    title: "Manajemen Sistem",
    items: SYSTEM_MANAGEMENT,
    isExpandable: false,
  },
]
