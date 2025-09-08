import { Metadata } from "next"
import { UserPageClient } from "./components/user-page-client"
import { PermissionGuard } from "@/hooks/use-permissions"

export const metadata: Metadata = {
  title: "User Management | SPPG",
  description: "Comprehensive user management system for SPPG application.",
}

export default async function UsersPage() {
  return (
    <PermissionGuard 
      permission={["users.view"]} 
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view user management.</p>
          </div>
        </div>
      }
    >
      <UserPageClient />
    </PermissionGuard>
  )
}
