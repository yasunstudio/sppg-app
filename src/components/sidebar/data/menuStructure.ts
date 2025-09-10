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
  User,
  Database,
  FolderOpen,
  Building2,
  FileText,
  Archive
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

// 1. Data Master - Master Data Management
export const DATA_MASTER_PENDIDIKAN: MenuItem[] = [
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

export const DATA_MASTER_MATERIAL: MenuItem[] = [
  {
    name: "Bahan Baku",
    href: "/dashboard/raw-materials",
    icon: Package,
    current: false,
  },
  {
    name: "Item/Produk",
    href: "/dashboard/items",
    icon: Package,
    current: false,
  },
  {
    name: "Pemasok",
    href: "/dashboard/suppliers",
    icon: ShoppingCart,
    current: false,
  },
]

export const DATA_MASTER_TRANSPORTASI: MenuItem[] = [
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

export const DATA_MASTER_TEMPLATE: MenuItem[] = [
  {
    name: "Resep",
    href: "/dashboard/recipes",
    icon: BookOpen,
    current: false,
  },
  {
    name: "Standar Kualitas",
    href: "/dashboard/quality-standards",
    icon: Shield,
    current: false,
  },
]

// Operational Management - Daily Operations
// 2. Pengadaan & Inventori
export const PENGADAAN_INVENTORI: MenuItem[] = [
  {
    name: "Order Pembelian",
    href: "/dashboard/purchase-orders",
    icon: ClipboardCheck,
    current: false,
  },
  {
    name: "Manajemen Inventori",
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

// 3. Perencanaan Menu
export const PERENCANAAN_MENU: MenuItem[] = [
  {
    name: "Ringkasan",
    href: "/dashboard/menu-planning",
    icon: LayoutGrid,
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

export const MENU_PLANNING_SUBMENUS: MenuItem[] = [
  {
    name: "Ringkasan",
    href: "/dashboard/menu-planning",
    icon: LayoutGrid,
    current: false,
    description: "Overview perencanaan menu mingguan"
  },
  {
    name: "Perencanaan Menu",
    href: "/dashboard/menu-planning/planning",
    icon: Calendar,
    current: false,
    description: "Susun menu harian dan mingguan"
  },
  {
    name: "Standar Nutrisi",
    href: "/dashboard/menu-planning/nutrition",
    icon: Heart,
    current: false,
    description: "Kelola standar gizi dan nutrisi"
  },
  {
    name: "AI Menu Planner",
    href: "/dashboard/menu-planning/ai-planner",
    icon: TrendingUp,
    current: false,
    badge: "Beta",
    description: "Rekomendasi menu berbasis AI"
  },
]

// 4. Produksi
export const PRODUKSI: MenuItem[] = [
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

// 5. Manajemen Kualitas
export const MANAJEMEN_KUALITAS: MenuItem[] = [
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
    name: "Dokumentasi Foto",
    href: "/dashboard/production/quality/photo-documentation",
    icon: Eye,
    current: false,
  },
  {
    name: "Laporan Kualitas",
    href: "/dashboard/production/quality/reports",
    icon: FileBarChart,
    current: false,
  },
]

// 6. Distribusi
export const DISTRIBUSI: MenuItem[] = [
  {
    name: "Ringkasan Distribusi",
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

// 7. Monitoring & Laporan
export const MONITORING_LAPORAN: MenuItem[] = [
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

// 8. Layanan Profesional
export const LAYANAN_PROFESIONAL: MenuItem[] = [
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

// 9. Keuangan & Anggaran
export const KEUANGAN_ANGGARAN: MenuItem[] = [
  {
    name: "Keuangan & Anggaran",
    href: "/dashboard/financial",
    icon: DollarSign,
    current: false,
  },
]

// 10. Komunikasi & Feedback
export const KOMUNIKASI_FEEDBACK: MenuItem[] = [
  {
    name: "Notifikasi",
    href: "/dashboard/notifications",
    icon: Bell,
    current: false,
  },
  {
    name: "Evaluasi & Feedback",
    href: "/dashboard/feedback",
    icon: MessageSquare,
    current: false,
  },
]

// 11. Manajemen Limbah
export const MANAJEMEN_LIMBAH: MenuItem[] = [
  {
    name: "Manajemen Limbah",
    href: "/dashboard/waste-records",
    icon: Trash,
    current: false,
  },
]

// 12. Manajemen Pengguna
export const MANAJEMEN_PENGGUNA: MenuItem[] = [
  {
    name: "Profil Pengguna",
    href: "/dashboard/profile",
    icon: User,
    current: false,
  },
]

// 13. Manajemen Sistem
export const MANAJEMEN_SISTEM: MenuItem[] = [
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
    name: "Penugasan Role",
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
    icon: ClipboardCheck,
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
  {
    name: "Manajemen Limbah",
    href: "/dashboard/waste-records",
    icon: Trash,
    current: false,
    description: "Kelola limbah makanan dan daur ulang"
  },
  {
    name: "Analitik Lanjutan",
    href: "/dashboard/analytics",
    icon: BarChart,
    current: false,
    description: "Dashboard analitik komprehensif"
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
    items: [
      ...DATA_MASTER_PENDIDIKAN,
      ...DATA_MASTER_MATERIAL,
      ...DATA_MASTER_TRANSPORTASI,
      ...DATA_MASTER_TEMPLATE,
    ],
    isExpandable: true,
    menuType: "dataMaster",
    pathMatch: "/dashboard/schools",
  },
  {
    title: "Pengadaan & Inventori",
    items: PENGADAAN_INVENTORI,
    isExpandable: true,
    menuType: "procurement",
    pathMatch: "/dashboard/purchase-orders",
  },
  {
    title: "Perencanaan Menu",
    items: PERENCANAAN_MENU,
    isExpandable: true,
    menuType: "menuPlanning",
    pathMatch: "/dashboard/menu-planning",
  },
  {
    title: "Produksi",
    items: PRODUKSI,
    isExpandable: true,
    menuType: "production",
    pathMatch: "/dashboard/production",
  },
  {
    title: "Manajemen Kualitas",
    items: MANAJEMEN_KUALITAS,
    isExpandable: true,
    menuType: "quality",
    pathMatch: "/dashboard/quality",
  },
  {
    title: "Distribusi",
    items: DISTRIBUSI,
    isExpandable: true,
    menuType: "distribution",
    pathMatch: "/dashboard/distribution",
  },
  {
    title: "Monitoring & Laporan",
    items: MONITORING_LAPORAN,
    isExpandable: true,
    menuType: "monitoring",
    pathMatch: "/dashboard/monitoring",
  },
  {
    title: "Layanan Profesional",
    items: LAYANAN_PROFESIONAL,
    isExpandable: false,
  },
  {
    title: "Keuangan & Anggaran",
    items: KEUANGAN_ANGGARAN,
    isExpandable: false,
  },
  {
    title: "Komunikasi & Feedback",
    items: KOMUNIKASI_FEEDBACK,
    isExpandable: false,
  },
  {
    title: "Manajemen Limbah",
    items: MANAJEMEN_LIMBAH,
    isExpandable: false,
  },
  {
    title: "Profil Pengguna",
    items: MANAJEMEN_PENGGUNA,
    isExpandable: false,
  },
  {
    title: "Manajemen Sistem",
    items: MANAJEMEN_SISTEM,
    isExpandable: true,
    menuType: "system",
    pathMatch: "/dashboard/admin",
  },
]
