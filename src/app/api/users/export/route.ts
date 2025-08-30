import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || []
    if (!hasPermission(userRoles, 'users.view')) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"

    // Get users
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (format === "csv") {
      // Create CSV content
      const headers = ["ID", "Name", "Email", "Phone", "Address", "Roles", "Status", "Created At"]
      const csvRows = [
        headers.join(","),
        ...users.map(user => [
          user.id,
          user.name || "",
          user.email,
          user.phone || "",
          user.address || "",
          user.roles.map(r => r.role.name).join(";"),
          user.isActive ? "Active" : "Inactive",
          new Date(user.createdAt).toLocaleDateString('id-ID')
        ].map(field => `"${field}"`).join(","))
      ]

      const csvContent = csvRows.join("\n")
      
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=users.csv"
        }
      })
    } else if (format === "xlsx") {
      // For Excel format, you'd typically use a library like exceljs
      // For now, return CSV with different headers
      const headers = ["ID", "Name", "Email", "Phone", "Address", "Roles", "Status", "Created At"]
      const csvRows = [
        headers.join(","),
        ...users.map(user => [
          user.id,
          user.name || "",
          user.email,
          user.phone || "",
          user.address || "",
          user.roles.map(r => r.role.name).join(";"),
          user.isActive ? "Active" : "Inactive",
          new Date(user.createdAt).toLocaleDateString('id-ID')
        ].map(field => `"${field}"`).join(","))
      ]

      const csvContent = csvRows.join("\n")
      
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": "attachment; filename=users.xlsx"
        }
      })
    }

    return new NextResponse("Invalid format", { status: 400 })
  } catch (error) {
    console.error("Error exporting users:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
