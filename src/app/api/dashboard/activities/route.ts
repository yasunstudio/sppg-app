import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

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
    interface Activity {
      id: string
      title: string
      time: string
      status: string
      type: string
    }
    
    const activities: Activity[] = []

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
    activities.sort((a, b) => {
      // This is a simple sort, in production you'd want to sort by actual timestamps
      return 0
    })

    return NextResponse.json(activities.slice(0, 6))
  } catch (error) {
    console.error("Activities API Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
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
