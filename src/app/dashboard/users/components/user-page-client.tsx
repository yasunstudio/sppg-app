"use client"

import { PageContainer } from "@/components/layout"
import { UserManagement } from "./user-management"
import { Button } from "@/components/ui/button"
import { UserPlus, Download } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function UserPageClient() {
  const handleExport = async () => {
    try {
      const response = await fetch('/api/users/export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to export users')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Users exported successfully")
    } catch (error) {
      toast.error("Failed to export users")
    }
  }

  return (
    <PageContainer
      title="User Management"
      description="Manage users, roles, and permissions for your application"
      showBreadcrumb={true}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/users/create">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Link>
          </Button>
        </div>
      }
    >
      <UserManagement />
    </PageContainer>
  )
}
