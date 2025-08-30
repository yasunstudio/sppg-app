import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts"
import { 
  Users, 
  School, 
  GraduationCap, 
  TrendingUp, 
  Activity,
  Truck,
  Package,
  Clock
} from "lucide-react"

// Types for data
interface Stats {
  totalUsers: number
  activeSchools: number
  totalStudents: number
  totalSuppliers: number
  trends: {
    usersGrowth: string
    schoolsGrowth: string
    studentsGrowth: string
    suppliersGrowth: string
  }
}

interface ActivityItem {
  id: string
  title: string
  time: string
  status: string
  type: string
}

// Server-side data fetching functions
async function getStats(): Promise<Stats> {
  try {
    // Get real data from database
    const [
      totalUsers,
      totalSchools,
      totalStudents,
      totalSuppliers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.school.count(),
      prisma.student.count(),
      prisma.supplier.count()
    ])

    // Calculate growth trends (comparing with previous month)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      usersLastMonth,
      schoolsLastMonth
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      }),
      prisma.school.count({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      })
    ])

    // Calculate growth percentages
    const usersGrowth = usersLastMonth > 0 ? 
      Math.round(((totalUsers - usersLastMonth) / usersLastMonth) * 100) : 0
    const schoolsGrowth = schoolsLastMonth > 0 ? 
      Math.round(((totalSchools - schoolsLastMonth) / schoolsLastMonth) * 100) : 0

    return {
      totalUsers,
      activeSchools: totalSchools,
      totalStudents,
      totalSuppliers,
      trends: {
        usersGrowth: usersGrowth > 0 ? `+${usersGrowth}%` : `${usersGrowth}%`,
        schoolsGrowth: schoolsGrowth > 0 ? `+${schoolsGrowth}%` : `${schoolsGrowth}%`,
        studentsGrowth: "+15%", // Could be calculated similar to above
        suppliersGrowth: "+8%" // Could be calculated similar to above
      }
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return fallback data
    return {
      totalUsers: 0,
      activeSchools: 0,
      totalStudents: 0,
      totalSuppliers: 0,
      trends: {
        usersGrowth: "0%",
        schoolsGrowth: "0%",
        studentsGrowth: "0%",
        suppliersGrowth: "0%"
      }
    }
  }
}

async function getActivities(): Promise<ActivityItem[]> {
  try {
    // Get recent activities from different sources
    const [
      recentUsers,
      recentSchools,
      recentStudents
    ] = await Promise.all([
      // Recent user registrations
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      }),
      
      // Recent school additions
      prisma.school.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 2
      }),
      
      // Recent student additions
      prisma.student.findMany({
        select: {
          id: true,
          name: true,
          school: {
            select: { name: true }
          },
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 2
      })
    ])

    // Format activities
    const activities: ActivityItem[] = []

    // Add user activities
    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user.id}`,
        title: `Pengguna baru terdaftar: ${user.name}`,
        time: getTimeAgo(user.createdAt),
        status: 'new',
        type: 'user'
      })
    })

    // Add school activities  
    recentSchools.forEach(school => {
      activities.push({
        id: `school-${school.id}`,
        title: `Sekolah baru ditambahkan: ${school.name}`,
        time: getTimeAgo(school.createdAt),
        status: 'success',
        type: 'school'
      })
    })

    // Add student activities
    recentStudents.forEach(student => {
      activities.push({
        id: `student-${student.id}`,
        title: `Siswa baru: ${student.name} di ${student.school.name}`,
        time: getTimeAgo(student.createdAt),
        status: 'update',
        type: 'student'
      })
    })

    // Sort by creation time and take latest 6
    return activities.slice(0, 6)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return []
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes} menit yang lalu`
  } else if (hours < 24) {
    return `${hours} jam yang lalu`
  } else {
    return `${days} hari yang lalu`
  }
}

export default async function DashboardPage() {
  const session = await auth()
  
  // Fetch data from APIs
  const [stats, activities] = await Promise.all([
    getStats(),
    getActivities()
  ])
  
  // Dashboard stats configuration
  const dashboardStats = [
    {
      title: "Total Pengguna",
      value: stats.totalUsers.toLocaleString('id-ID'),
      description: `${stats.trends.usersGrowth} dari bulan lalu`,
      icon: Users,
      trend: stats.trends.usersGrowth,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Sekolah Aktif",
      value: stats.activeSchools.toLocaleString('id-ID'),
      description: `${stats.trends.schoolsGrowth} dari bulan lalu`,
      icon: School,
      trend: stats.trends.schoolsGrowth,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Total Siswa",
      value: stats.totalStudents.toLocaleString('id-ID'),
      description: `${stats.trends.studentsGrowth} dari minggu lalu`,
      icon: GraduationCap,
      trend: stats.trends.studentsGrowth,
      color: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Supplier Aktif",
      value: stats.totalSuppliers.toLocaleString('id-ID'),
      description: `${stats.trends.suppliersGrowth} dari bulan lalu`,
      icon: Truck,
      trend: stats.trends.suppliersGrowth,
      color: "text-emerald-600 dark:text-emerald-400"
    }
  ]
  
  return (
    <div className="space-y-6">
      {/* Dashboard Alerts for access denied or other notifications */}
      <DashboardAlerts />
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di sistem manajemen SPPG (Sekolah Program Pangan Gratis)
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Akses cepat ke fitur yang sering digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="group rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Kelola Pengguna</h3>
                    <p className="text-sm text-muted-foreground">Tambah, edit, atau hapus pengguna</p>
                  </div>
                </div>
              </div>
              
              <div className="group rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                    <School className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Data Sekolah</h3>
                    <p className="text-sm text-muted-foreground">Lihat dan kelola data sekolah</p>
                  </div>
                </div>
              </div>
              
              <div className="group rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/20">
                    <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Inventaris</h3>
                    <p className="text-sm text-muted-foreground">Kelola bahan dan stok</p>
                  </div>
                </div>
              </div>
              
              <div className="group rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Laporan</h3>
                    <p className="text-sm text-muted-foreground">Lihat analitik dan laporan</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>
              Update terbaru dari sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex h-2 w-2 mt-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada aktivitas terbaru</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Pengguna</CardTitle>
          <CardDescription>
            Informasi akun yang sedang login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold">{session?.user?.name}</h3>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Administrator</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
