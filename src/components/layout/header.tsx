"use client"

import * as React from "react"
import { Bell, Moon, Sun, Search, Settings, LogOut, User, ChevronDown } from "lucide-react"
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
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useNotifications } from "@/hooks/use-notifications"
import { useUserProfile } from "@/hooks/use-user-profile"
import Link from "next/link"

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")
  const { notifications, loading } = useNotifications()
  const count = notifications.length
  const { profile } = useUserProfile()
  
  const getRoleDisplay = () => {
    return profile?.roles?.[0]?.role?.name || 'User'
  }

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname.startsWith("/dashboard/users")) return "Manajemen Pengguna"
    if (pathname.startsWith("/dashboard/admin")) return "Admin Panel"
    if (pathname.startsWith("/dashboard/schools")) return "Data Sekolah"
    if (pathname.startsWith("/dashboard/inventory")) return "Inventaris"
    if (pathname.startsWith("/dashboard/menus")) return "Menu & Produksi"
    if (pathname.startsWith("/dashboard/distribution")) return "Distribusi"
    if (pathname.startsWith("/dashboard/quality")) return "Kontrol Kualitas"
    if (pathname.startsWith("/dashboard/settings")) return "Pengaturan"
    return "SPPG Admin"
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Left Section - Page Title & Search */}
        <div className="flex items-center space-x-6 flex-1">
          {/* Page Title */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-muted-foreground">
              Sistem Pengelolaan Program Gizi
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pengguna, sekolah, atau data..."
                className="pl-9 w-[320px] bg-background border-input hover:border-ring focus:border-ring transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center space-x-2">
          {/* Quick Actions - Mobile Search */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 dark:bg-red-600 text-[10px] text-white font-medium">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Memuat notifikasi...
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {notifications.length} notifikasi tersedia
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Tidak ada notifikasi baru
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/notifications" className="w-full text-center font-medium">
                  Lihat semua notifikasi
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-auto px-3 hover:bg-muted/50">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-md">
                    {profile?.name ? (
                      profile.name.charAt(0).toUpperCase()
                    ) : session?.user?.name ? (
                      session.user.name.charAt(0).toUpperCase()
                    ) : (
                      "?"
                    )}
                  </div>
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className="text-sm font-medium leading-none">
                      {profile?.name || session?.user?.name || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground leading-none mt-1">
                      {getRoleDisplay()}
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.name || session?.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none">
                    {profile?.email || session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profil Saya
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Pengaturan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-10 w-10">
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-muted/50">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Tema Tampilan</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className="flex items-center cursor-pointer hover:bg-muted/50"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span className="flex-1">Terang</span>
          {theme === "light" && <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className="flex items-center cursor-pointer hover:bg-muted/50"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span className="flex-1">Gelap</span>
          {theme === "dark" && <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className="flex items-center cursor-pointer hover:bg-muted/50"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span className="flex-1">Sistem</span>
          {theme === "system" && <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
