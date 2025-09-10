'use client';

import { UserRoleCreateForm } from './forms/user-role-create-form';
import { Separator } from '@/components/ui/separator';

export function UserRoleCreatePageClient() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tugaskan Role Pengguna</h3>
        <p className="text-sm text-muted-foreground">
          Tugaskan role kepada pengguna dalam sistem.
        </p>
      </div>
      <Separator />
      <UserRoleCreateForm />
    </div>
  );
}
