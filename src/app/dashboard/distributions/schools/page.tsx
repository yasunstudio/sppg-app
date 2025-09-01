import { Metadata } from 'next'
import { DistributionSchoolsList } from '../components'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export const metadata: Metadata = {
  title: 'Distribution Schools | SPPG Dashboard',
  description: 'Manage school-specific distribution tracking and delivery confirmation'
}

export default function DistributionSchoolsPage() {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.view">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Distribution Schools</h1>
            <p className="text-muted-foreground">
              Manage school-specific distribution tracking and delivery confirmation
            </p>
          </div>
          <EnhancedPermissionGuard permission="distribution_schools.create">
            <Link href="/dashboard/distributions/schools/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Distribution Schools
              </Button>
            </Link>
          </EnhancedPermissionGuard>
        </div>

        {/* Main Content */}
        <DistributionSchoolsList />
      </div>
    </EnhancedPermissionGuard>
  )
}
