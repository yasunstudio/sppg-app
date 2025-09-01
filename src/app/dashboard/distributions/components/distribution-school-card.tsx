'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2,
  Package,
  MapPin,
  Eye,
  Edit3,
  Users
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface DistributionSchool {
  id: string
  distributionId: string
  schoolId: string
  plannedPortions: number
  actualPortions: number | null
  routeOrder: number
  createdAt: string
  distribution: {
    id: string
    distributionDate: string
    status: string
  }
  school: {
    id: string
    name: string
    address: string
    totalStudents: number
  }
}

interface DistributionSchoolCardProps {
  distributionSchool: DistributionSchool
}

export function DistributionSchoolCard({ distributionSchool }: DistributionSchoolCardProps) {
  const getDeliveryStatus = () => {
    if (distributionSchool.actualPortions === null) {
      return { 
        label: 'Pending', 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' 
      }
    }
    
    const actual = distributionSchool.actualPortions
    const planned = distributionSchool.plannedPortions
    
    if (actual === planned) {
      return { 
        label: 'Complete', 
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
      }
    } else if (actual > planned) {
      return { 
        label: 'Excess', 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
      }
    } else {
      return { 
        label: 'Partial', 
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100' 
      }
    }
  }

  const getPortionDifference = () => {
    if (distributionSchool.actualPortions === null) return null
    return distributionSchool.actualPortions - distributionSchool.plannedPortions
  }

  const status = getDeliveryStatus()
  const difference = getPortionDifference()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">{distributionSchool.school.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {distributionSchool.school.address}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline">Route #{distributionSchool.routeOrder}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* School Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Students</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {distributionSchool.school.totalStudents.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Distribution Date</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(distributionSchool.distribution.distributionDate), 'MMM dd')}
              </p>
            </div>
          </div>
        </div>

        {/* Portions Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Planned</p>
              <p className="font-semibold">{distributionSchool.plannedPortions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Actual</p>
              <p className="font-semibold">
                {distributionSchool.actualPortions !== null 
                  ? distributionSchool.actualPortions.toLocaleString() 
                  : '-'
                }
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Difference</p>
              <p className={`font-semibold ${
                difference === null ? 'text-gray-400' :
                difference > 0 ? 'text-blue-600' : 
                difference < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {difference !== null 
                  ? `${difference > 0 ? '+' : ''}${difference}` 
                  : '-'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-between pt-2">
          <Badge className={status.color}>
            {status.label}
          </Badge>
          <div className="flex space-x-2">
            <Link href={`/dashboard/distributions/schools/${distributionSchool.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/distributions/schools/${distributionSchool.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit3 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
