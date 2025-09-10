import { Metadata } from 'next'
import { Suspense } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { UserRoleManagement } from './components/user-role-management'
import { UserRolePageActions } from './components/user-role-page-actions'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Manajemen Role Pengguna | SPPG',
  description: 'Sistem manajemen role pengguna komprehensif untuk aplikasi SPPG. Tugaskan dan kelola role pengguna serta izin.',
  keywords: ['role pengguna', 'izin', 'kontrol akses', 'manajemen pengguna', 'SPPG'],
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
      title="Manajemen Role Pengguna"
      description="Tugaskan dan kelola role pengguna serta izin"
      actions={<UserRolePageActions />}
    >
      <Suspense fallback={<UserRolePageSkeleton />}>
        <UserRoleManagement />
      </Suspense>
    </PageContainer>
  )
}
