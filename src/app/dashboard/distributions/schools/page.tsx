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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Distribution Schools
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
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
          </div>

          {/* Main Content */}
          <DistributionSchoolsList />
        </div>
      </div>
    </EnhancedPermissionGuard>
  )
}
