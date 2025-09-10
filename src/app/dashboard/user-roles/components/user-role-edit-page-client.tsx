'use client';

import { useUserRoleDetails } from './hooks/use-user-role-details';
import { UserRoleEditForm } from './forms/user-role-edit-form';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface UserRoleEditPageClientProps {
  id: string;
}

export function UserRoleEditPageClient({ id }: UserRoleEditPageClientProps) {
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
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
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
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/dashboard/user-roles/${userRole.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-medium">Edit User Role Assignment</h3>
          <p className="text-sm text-muted-foreground">
            Modify role assignment for {userRole.user?.name || 'Unknown User'}
          </p>
        </div>
      </div>
      <Separator />
      <UserRoleEditForm userRoleId={userRole.id} />
    </div>
  );
}
