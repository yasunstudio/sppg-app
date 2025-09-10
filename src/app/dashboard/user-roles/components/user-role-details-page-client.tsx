'use client';

import { useUserRoleDetails } from './hooks/use-user-role-details';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, ArrowLeft, Calendar, User, Shield } from 'lucide-react';
import { formatUserRoleStatus, formatDate } from './utils/user-role-formatters';

interface UserRoleDetailsPageClientProps {
  id: string;
}

export function UserRoleDetailsPageClient({ id }: UserRoleDetailsPageClientProps) {
  const router = useRouter();
  const { userRole, isLoading, error } = useUserRoleDetails({ userRoleId: id });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Error Loading User Role</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.push('/dashboard/user-roles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Roles
          </Button>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">User Role Not Found</h2>
          <p className="text-muted-foreground mb-4">The user role assignment you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard/user-roles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Roles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/dashboard/user-roles')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-lg font-medium">User Role Assignment</h3>
            <p className="text-sm text-muted-foreground">
              Role assignment details for {userRole.user?.name || 'Unknown User'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/user-roles/${userRole.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Assignment
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>
              Basic information about the user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm text-muted-foreground">
                {userRole.user?.name || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">
                {userRole.user?.email || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Information
            </CardTitle>
            <CardDescription>
              Details about the assigned role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Role Name</label>
              <p className="text-sm text-muted-foreground">
                {userRole.role?.name || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Role Description</label>
              <p className="text-sm text-muted-foreground">
                {userRole.role?.description || 'No description available'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Assignment Status
            </CardTitle>
            <CardDescription>
              Status and timeline information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Badge variant="default">
                Aktif
              </Badge>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Assigned Date</label>
              <p className="text-sm text-muted-foreground">
                {formatDate(userRole.assignedAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
