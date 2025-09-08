import { Metadata } from 'next'
import { Suspense } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { UserRolePageClient } from './components/user-role-page-client'
import { UserRolePageActions } from './components/user-role-page-actions'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'User Role Management | SPPG',
  description: 'Comprehensive user role management system for SPPG application. Assign and manage user roles and permissions.',
  keywords: ['user roles', 'permissions', 'access control', 'user management', 'SPPG'],
}

function UserRolePageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted animate-pulse rounded-lg h-24" />
        ))}
      </div>
      
      {/* Filter skeleton */}
      <div className="bg-muted animate-pulse rounded-lg h-16" />
      
      {/* Table skeleton */}
      <div className="bg-muted animate-pulse rounded-lg h-96" />
    </div>
  )
}

export default function UserRolesPage() {
  return (
    <PageContainer
      title="User Role Management"
      description="Assign and manage user roles and permissions"
      actions={<UserRolePageActions />}
    >
      <Suspense fallback={<UserRolePageSkeleton />}>
        <UserRolePageClient />
      </Suspense>
    </PageContainer>
  )
}
