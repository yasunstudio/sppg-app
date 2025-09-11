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

// INSTITUTION MANAGEMENT - School System Core
export const INSTITUTION_MANAGEMENT: MenuItem[] = [
  {
    name: "Sekolah",
    href: "/dashboard/schools",
    icon: Building2,
    current: false,
    description: "Data sekolah dan informasi institusi",
  },
  {
    name: "Siswa",
    href: "/dashboard/students",
    icon: GraduationCap,
    current: false,
    description: "Data siswa dan informasi pribadi",
  },
  {
    name: "Kelas",
    href: "/dashboard/classes",
    icon: BookOpen,
    current: false,
    description: "Manajemen kelas dan kapasitas",
  },
]

// SUPPLY CHAIN MANAGEMENT - Core Materials & Suppliers
export const SUPPLY_CHAIN_MANAGEMENT: MenuItem[] = [
  {
    name: "Bahan Baku",
    href: "/dashboard/raw-materials",
    icon: Package,
    current: false,
    description: "Master data bahan baku dan nutrisi",
  },
  {
    name: "Pemasok",
    href: "/dashboard/suppliers",
    icon: Building2,
    current: false,
    description: "Data vendor dan pemasok bahan",
  },
  {
    name: "Item Master",
    href: "/dashboard/items",
    icon: Archive,
    current: false,
    description: "Katalog item dan produk",
  },
]

// LOGISTICS & TRANSPORTATION - Fleet Management
export const LOGISTICS_MANAGEMENT: MenuItem[] = [
  {
    name: "Kendaraan",
    href: "/dashboard/vehicles",
    icon: Truck,
    current: false,
    description: "Manajemen armada dan kendaraan",
  },
  {
    name: "Driver",
    href: "/dashboard/drivers",
    icon: User,
    current: false,
    description: "Data pengemudi dan jadwal",
  },
]

// PROCUREMENT & INVENTORY - Purchase & Stock Management  
export const PROCUREMENT_INVENTORY: MenuItem[] = [
  {
    name: "Purchase Orders",
    href: "/dashboard/purchase-orders",
    icon: ClipboardCheck,
    current: false,
    description: "Pembelian dan pengadaan bahan",
  },
  {
    name: "Inventori",
    href: "/dashboard/inventory",
    icon: Package,
    current: false,
    description: "Stok dan manajemen gudang",
  },
  {
    name: "Resource Usage",
    href: "/dashboard/resource-usage",
    icon: Activity,
    current: false,
    description: "Tracking penggunaan resources",
  },
]

export const QUALITY_STANDARDS_TEMPLATES: MenuItem[] = [
  {
    name: "Standar Kualitas",
    href: "/dashboard/quality-standards",
    icon: TestTube,
    current: false,
    description: "Template dan parameter kualitas",
  },
  {
    name: "Quality Checkpoints",
    href: "/dashboard/quality-checkpoints",
    icon: ClipboardCheck,
    current: false,
    description: "Titik kontrol kualitas",
  },
  {
    name: "Resep & Formula",
    href: "/dashboard/recipes",
    icon: ChefHat,
    current: false,
    description: "Master resep dan formula makanan",
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

export const PRODUCTION_SUBMENUS: MenuItem[] = [
  {
    name: "Dashboard Produksi",
    href: "/dashboard/production",
    icon: LayoutGrid,
    current: false,
    description: "Overview aktivitas produksi harian"
  },
  {
    name: "Rencana Produksi",
    href: "/dashboard/production-plans",
    icon: Calendar,
    current: false,
    description: "Jadwal dan rencana produksi"
  },
  {
    name: "Eksekusi Produksi",
    href: "/dashboard/production/execution",
    icon: PlayCircle,
    current: false,
    description: "Pantau proses produksi real-time"
  },
  {
    name: "Batch Produksi",
    href: "/dashboard/production/batches",
    icon: Package,
    current: false,
    description: "Kelola batch dan lot produksi"
  },
  {
    name: "Manajemen Sumber Daya",
    href: "/dashboard/production/resources",
    icon: Wrench,
    current: false,
    description: "Alat, peralatan, dan maintenance"
  },
  {
    name: "Optimasi AI",
    href: "/dashboard/production/ai-optimizer",
    icon: TrendingUp,
    current: false,
    badge: "AI",
    description: "Optimasi produksi dengan AI"
  },
  {
    name: "Analitik Produksi",
    href: "/dashboard/production/analytics",
    icon: BarChart,
    current: false,
    badge: "Pro",
    description: "Laporan dan analisis performa"
  },
]

export const QUALITY_SUBMENUS: MenuItem[] = [
  {
    name: "Dashboard Kualitas",
    href: "/dashboard/quality",
    icon: LayoutGrid,
    current: false,
    description: "Ringkasan kontrol kualitas harian"
  },
  {
    name: "Inspeksi Kualitas",
    href: "/dashboard/quality-checks",
    icon: ClipboardCheck,
    current: false,
    description: "Pemeriksaan dan validasi kualitas"
  },
  {
    name: "Standar Kualitas",
    href: "/dashboard/quality-standards",
    icon: TestTube,
    current: false,
    description: "Kelola standar dan parameter"
  },
  {
    name: "Dokumentasi Foto",
    href: "/dashboard/production/quality/photo-documentation",
    icon: Eye,
    current: false,
    description: "Dokumentasi visual kualitas"
  },
  {
    name: "Sampel Makanan",
    href: "/dashboard/food-samples",
    icon: TestTube,
    current: false,
    description: "Kelola sampel untuk pengujian"
  },
]

export const DISTRIBUTION_SUBMENUS: MenuItem[] = [
  {
    name: "Ringkasan Distribusi",
    href: "/dashboard/distributions",
    icon: LayoutGrid,
    current: false,
    description: "Overview distribusi dan pengiriman"
  },
  {
    name: "Sekolah Distribusi",
    href: "/dashboard/distributions/schools",
    icon: School,
    current: false,
    description: "Kelola distribusi per sekolah"
  },
  {
    name: "Pelacakan Pengiriman",
    href: "/dashboard/distributions/tracking",
    icon: Eye,
    current: false,
    description: "Real-time tracking pengiriman"
  },
  {
    name: "Perencanaan Rute",
    href: "/dashboard/distributions/routes",
    icon: Truck,
    current: false,
    description: "Optimasi rute pengiriman"
  },
  {
    name: "Kendaraan & Driver",
    href: "/dashboard/vehicles",
    icon: Truck,
    current: false,
    description: "Manajemen armada dan driver",
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

export const MONITORING_SUBMENUS: MenuItem[] = [
  {
    name: "Dashboard Monitoring",
    href: "/dashboard/monitoring",
    icon: LayoutGrid,
    current: false,
    description: "Pusat kendali monitoring sistem"
  },
  {
    name: "Monitoring Real-time",
    href: "/dashboard/monitoring/real-time",
    icon: Activity,
    current: false,
    description: "Pantau aktivitas real-time"
  },
  {
    name: "Analitik & Insights",
    href: "/dashboard/monitoring/analytics",
    icon: BarChart,
    current: false,
    description: "Analisis mendalam dan insights"
  },
  {
    name: "Evaluasi Kinerja",
    href: "/dashboard/performance",
    icon: TrendingUp,
    current: false,
    description: "KPI dan evaluasi performa"
  },
  {
    name: "Laporan Eksekutif",
    href: "/dashboard/monitoring/reports",
    icon: FileBarChart,
    current: false,
    description: "Laporan untuk manajemen"
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
    description: "Kelola pengguna dan akses sistem",
    submenu: [
      {
        name: "Daftar Pengguna",
        href: "/dashboard/users",
        icon: Users,
        current: false,
        description: "Data lengkap pengguna sistem"
      },
      {
        name: "Manajemen Role",
        href: "/dashboard/roles",
        icon: Shield,
        current: false,
        description: "Kelola peran dan hak akses"
      },
      {
        name: "Penugasan Role",
        href: "/dashboard/user-roles",
        icon: UserCheck,
        current: false,
        description: "Assign role ke pengguna"
      },
    ]
  },
  {
    name: "Keamanan & Audit",
    href: "/dashboard/audit-logs",
    icon: Shield,
    current: false,
    description: "Log keamanan dan audit sistem",
    submenu: [
      {
        name: "Log Audit",
        href: "/dashboard/audit-logs",
        icon: Shield,
        current: false,
        description: "Riwayat aktivitas sistem"
      },
      {
        name: "Notifikasi Sistem",
        href: "/dashboard/notifications",
        icon: Bell,
        current: false,
        description: "Notifikasi dan peringatan"
      },
    ]
  },
  {
    name: "Konfigurasi & Admin",
    href: "/dashboard/system-config",
    icon: Settings,
    current: false,
    description: "Pengaturan dan administrasi sistem",
    submenu: [
      {
        name: "Konfigurasi Sistem",
        href: "/dashboard/system-config",
        icon: Settings,
        current: false,
        description: "Pengaturan aplikasi global"
      },
      {
        name: "Panel Administrator",
        href: "/dashboard/admin",
        icon: Wrench,
        current: false,
        description: "Tools administrasi lanjutan"
      },
      {
        name: "Profil Pengguna",
        href: "/dashboard/profile",
        icon: User,
        current: false,
        description: "Kelola profil dan preferensi"
      },
    ]
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

// Main menu structure configuration - Professional Structure
export const SIDEBAR_MENU_STRUCTURE: MenuSection[] = [
  // Core Navigation - Always at top
  {
    title: "",
    items: CORE_NAVIGATION,
    isExpandable: false,
  },
  
  // Institution Management - School System Foundation
  {
    title: "Manajemen Institusi",
    items: INSTITUTION_MANAGEMENT,
    isExpandable: true,
    menuType: "institution",
    pathMatch: "/dashboard/schools|/dashboard/students|/dashboard/classes",
  },
  
  // Supply Chain Management - Materials & Suppliers
  {
    title: "Supply Chain Management", 
    items: SUPPLY_CHAIN_MANAGEMENT,
    isExpandable: true,
    menuType: "supplyChain",
    pathMatch: "/dashboard/raw-materials|/dashboard/suppliers|/dashboard/items",
  },
  
  // Quality & Standards - Templates & Standards
  {
    title: "Standar & Template",
    items: QUALITY_STANDARDS_TEMPLATES,
    isExpandable: true,
    menuType: "standards",
    pathMatch: "/dashboard/quality-standards|/dashboard/quality-checkpoints|/dashboard/recipes",
  },
  
  // Procurement & Inventory Management
  {
    title: "Pengadaan & Inventori",
    items: PROCUREMENT_INVENTORY,
    isExpandable: true,
    menuType: "procurement",
    pathMatch: "/dashboard/purchase-orders|/dashboard/inventory|/dashboard/resource-usage",
  },
  
  // Logistics & Transportation
  {
    title: "Logistik & Transportasi",
    items: LOGISTICS_MANAGEMENT,
    isExpandable: true,
    menuType: "logistics",
    pathMatch: "/dashboard/vehicles|/dashboard/drivers",
  },
  
  // Core Operations
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
  
  // Analytics & Monitoring
  {
    title: "Monitoring & Analitik",
    items: MONITORING_SUBMENUS,
    isExpandable: true,
    menuType: "monitoring",
    pathMatch: "/dashboard/monitoring|/dashboard/analytics|/dashboard/performance",
  },
  
  // Financial Management
  {
    title: "Keuangan",
    items: [
      {
        name: "Keuangan & Anggaran",
        href: "/dashboard/financial",
        icon: DollarSign,
        current: false,
        description: "Laporan keuangan dan perencanaan anggaran"
      },
    ],
    isExpandable: false,
  },
  
  // Professional Services
  {
    title: "Layanan Profesional",
    items: PROFESSIONAL_SERVICES,
    isExpandable: false,
  },
  
  // Additional Features
  {
    title: "Fitur Lainnya",
    items: [
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
    ],
    isExpandable: false,
  },
  
  // System Administration - Always at bottom
  {
    title: "Administrasi",
    items: SYSTEM_MANAGEMENT,
    isExpandable: true,
    menuType: "system",
    pathMatch: "/dashboard/admin|/dashboard/users|/dashboard/roles|/dashboard/user-roles|/dashboard/system-config|/dashboard/audit-logs|/dashboard/notifications|/dashboard/profile",
  },
]
