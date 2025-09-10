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
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
    current: false,
  },
]

export const EDUCATIONAL_MANAGEMENT: MenuItem[] = [
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
]

export const RESOURCE_MANAGEMENT: MenuItem[] = [
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
    name: "Kendaraan & Driver",
    href: "/dashboard/vehicles",
    icon: Truck,
    current: false,
    submenu: [
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
  },
]

export const OPERATIONS_MANAGEMENT: MenuItem[] = [
  {
    name: "Pengadaan",
    href: "/dashboard/purchase-orders",
    icon: ClipboardCheck,
    current: false,
  },
  {
    name: "Inventori",
    href: "/dashboard/inventory",
    icon: Package,
    current: false,
    submenu: [
      {
        name: "Manajemen Item",
        href: "/dashboard/items",
        icon: Package,
        current: false,
      },
      {
        name: "Stok Inventori",
        href: "/dashboard/inventory",
        icon: Package,
        current: false,
      },
      {
        name: "Penggunaan Sumber Daya",
        href: "/dashboard/resource-usage",
        icon: Activity,
        current: false,
      },
    ]
  },
  {
    name: "Manajemen Resep",
    href: "/dashboard/recipes",
    icon: BookOpen,
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
    badge: "New"
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
    badge: "Beta"
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
    badge: "AI"
  },
  {
    name: "Analitik Produksi",
    href: "/dashboard/production/analytics",
    icon: BarChart,
    current: false,
    badge: "Pro"
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
    description: "Konsultasi dengan ahli gizi profesional"
  },
  {
    name: "Uji Laboratorium",
    href: "/dashboard/food-samples",
    icon: TestTube,
    current: false,
    description: "Analisis kualitas makanan di laboratorium"
  },
]

export const SYSTEM_MANAGEMENT: MenuItem[] = [
  {
    name: "Manajemen Pengguna",
    href: "/dashboard/users",
    icon: Users,
    current: false,
    submenu: [
      {
        name: "Daftar Pengguna",
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
        name: "Penugasan Role",
        href: "/dashboard/user-roles",
        icon: UserCheck,
        current: false,
      },
    ]
  },
  {
    name: "Konfigurasi Sistem",
    href: "/dashboard/system-config",
    icon: Settings,
    current: false,
  },
  {
    name: "Keamanan & Audit",
    href: "/dashboard/audit-logs",
    icon: Shield,
    current: false,
    submenu: [
      {
        name: "Log Audit",
        href: "/dashboard/audit-logs",
        icon: Shield,
        current: false,
      },
      {
        name: "Notifikasi Sistem",
        href: "/dashboard/notifications",
        icon: Bell,
        current: false,
      },
    ]
  },
  {
    name: "Profil Pengguna",
    href: "/dashboard/profile",
    icon: User,
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
    description: "Kelola limbah makanan dan daur ulang"
  },
  {
    name: "Keuangan & Anggaran",
    href: "/dashboard/financial",
    icon: DollarSign,
    current: false,
    description: "Laporan keuangan dan perencanaan anggaran"
  },
  {
    name: "Evaluasi & Feedback",
    href: "/dashboard/feedback",
    icon: MessageSquare,
    current: false,
    description: "Feedback dari siswa dan evaluasi program"
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
    title: "Manajemen Pendidikan",
    items: EDUCATIONAL_MANAGEMENT,
    isExpandable: false,
  },
  {
    title: "Manajemen Sumber Daya",
    items: RESOURCE_MANAGEMENT,
    isExpandable: false,
  },
  {
    title: "Operasional",
    items: OPERATIONS_MANAGEMENT,
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
    title: "Produksi",
    items: PRODUCTION_SUBMENUS,
    isExpandable: true,
    menuType: "production",
    pathMatch: "/dashboard/production",
  },
  {
    title: "Kontrol Kualitas",
    items: QUALITY_SUBMENUS,
    isExpandable: true,
    menuType: "quality",
    pathMatch: "/dashboard/quality",
  },
  {
    title: "Distribusi & Pengiriman",
    items: DISTRIBUTION_SUBMENUS,
    isExpandable: true,
    menuType: "distribution",
    pathMatch: "/dashboard/distribution",
  },
  {
    title: "Monitoring & Analitik",
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
    title: "Administrasi Sistem",
    items: SYSTEM_MANAGEMENT,
    isExpandable: true,
    menuType: "system",
    pathMatch: "/dashboard/system",
  },
  {
    title: "Fitur Tambahan",
    items: OTHER_FEATURES,
    isExpandable: false,
  },
]
