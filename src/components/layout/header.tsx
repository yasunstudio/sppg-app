"use client"

import * as React from "react"
import { Bell, Moon, Sun, Search, Settings, LogOut, User, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { NoSSR } from "@/components/ui/no-ssr"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useNotifications } from "@/hooks/use-notifications"
import { useUserProfile } from "@/hooks/use-user-profile"
import Link from "next/link"

interface HeaderProps {
  onMobileSidebarToggle?: () => void
  sidebarOpen?: boolean
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <NoSSR 
      fallback={
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4" />
          <span className="sr-only">Ubah tema</span>
        </Button>
      }
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted/50 dark:hover:bg-slate-700">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Ubah tema</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 dark:bg-slate-800 dark:border-slate-600">
          <DropdownMenuLabel className="dark:text-slate-100">Tema Tampilan</DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:border-slate-600" />
          <DropdownMenuItem 
            onClick={() => setTheme("light")} 
            className="flex items-center cursor-pointer hover:bg-muted/50 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Sun className="mr-2 h-4 w-4" />
            <span className="flex-1">Terang</span>
            {theme === "light" && <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")} 
            className="flex items-center cursor-pointer hover:bg-muted/50 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Moon className="mr-2 h-4 w-4" />
            <span className="flex-1">Gelap</span>
            {theme === "dark" && <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")} 
            className="flex items-center cursor-pointer hover:bg-muted/50 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="flex-1">Sistem</span>
            {theme === "system" && <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </NoSSR>
  )
}

export function Header({ onMobileSidebarToggle, sidebarOpen }: HeaderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false)
  const { notifications, loading } = useNotifications()
  const count = notifications.length
  const { profile } = useUserProfile()
  
  const getRoleDisplay = () => {
    return profile?.roles?.[0]?.role?.name || 'Pengguna'
  }

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dasbor"
    if (pathname === "/dashboard/users") return "Pengguna"
    if (pathname === "/dashboard/schools") return "Sekolah"
    if (pathname === "/dashboard/raw-materials") return "Bahan Baku"
    if (pathname === "/dashboard/inventory") return "Inventori"
    if (pathname === "/dashboard/production") return "Produksi"
    if (pathname === "/dashboard/distribution") return "Distribusi"
    if (pathname === "/dashboard/waste-management") return "Manajemen Limbah"
    if (pathname === "/dashboard/quality") return "Quality Control"
    if (pathname === "/dashboard/financial") return "Keuangan"
    if (pathname === "/dashboard/reports") return "Laporan"
    if (pathname === "/dashboard/settings") return "Pengaturan"
    return "SPPG System"
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Search query:", searchQuery)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-slate-900/95 dark:border-slate-700">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section - Mobile Menu & Page Title */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onMobileSidebarToggle}
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="sr-only">Buka/tutup menu</span>
            </Button>
          </div>

          {/* Page Title */}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground dark:text-slate-100 truncate">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-slate-400" />
              <Input
                type="search"
                placeholder="Cari pengguna, sekolah, atau data..."
                className="pl-9 w-full bg-background border-input hover:border-ring focus:border-ring transition-colors dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Mobile Search Toggle */}
          <div className="lg:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Cari</span>
            </Button>
          </div>

          {/* Notifications */}
          <NoSSR 
            fallback={
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
            }
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-4 w-4" />
                  {count > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 dark:bg-red-600 text-[10px] text-white font-medium">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                  <span className="sr-only">Notifikasi</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 dark:bg-slate-800 dark:border-slate-600">
                <DropdownMenuLabel className="dark:text-slate-100">Notifikasi</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:border-slate-600" />
                <div className="max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground dark:text-slate-400">
                      Memuat notifikasi...
                    </div>
                  ) : notifications.length > 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground dark:text-slate-400">
                      {notifications.length} notifikasi tersedia
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground dark:text-slate-400">
                      Tidak ada notifikasi baru
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator className="dark:border-slate-600" />
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="w-full text-center font-medium dark:text-slate-200 dark:hover:bg-slate-700">
                    Lihat semua notifikasi
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NoSSR>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <NoSSR 
            fallback={
              <Button variant="ghost" className="relative h-9 w-auto px-2 sm:px-3">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-md">
                    ?
                  </div>
                </div>
              </Button>
            }
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-auto px-2 sm:px-3 hover:bg-muted/50 dark:hover:bg-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-md">
                      {profile?.name ? (
                        profile.name.charAt(0).toUpperCase()
                      ) : session?.user?.name ? (
                        session.user.name.charAt(0).toUpperCase()
                      ) : (
                        "?"
                      )}
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-start">
                      <span className="text-sm font-medium leading-none dark:text-slate-200">
                        {profile?.name || session?.user?.name || "Pengguna"}
                      </span>
                      <span className="text-xs text-muted-foreground dark:text-slate-400 leading-none mt-1">
                        {getRoleDisplay()}
                      </span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground dark:text-slate-400 ml-1 hidden sm:block" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 dark:bg-slate-800 dark:border-slate-600">
                <DropdownMenuLabel className="dark:text-slate-100">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.name || session?.user?.name || "Pengguna"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground dark:text-slate-400">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:border-slate-600" />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer hover:bg-muted/50 dark:text-slate-200 dark:hover:bg-slate-700">
                    <User className="mr-2 h-4 w-4" />
                    Profil Saya
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer hover:bg-muted/50 dark:text-slate-200 dark:hover:bg-slate-700">
                    <Settings className="mr-2 h-4 w-4" />
                    Pengaturan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:border-slate-600" />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NoSSR>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden pb-3 pt-2 px-4 sm:px-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-slate-400" />
            <Input
              type="search"
              placeholder="Cari pengguna, sekolah, atau data..."
              className="pl-9 w-full bg-background border-input hover:border-ring focus:border-ring transition-colors dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </header>
  )
}
