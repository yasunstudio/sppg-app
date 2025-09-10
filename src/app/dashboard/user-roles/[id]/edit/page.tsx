import { Metadata } from 'next';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { UserRoleEditPageClient } from '../../components/user-role-edit-page-client';

export const metadata: Metadata = {
  title: 'Edit Role Pengguna - SPPG Dashboard',
  description: 'Edit penugasan role pengguna',
};

interface UserRoleEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserRoleEditPage({ params }: UserRoleEditPageProps) {
  const { id } = await params;

  return (
    <PermissionGuard 
      permission="users.edit"
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
            <p className="text-muted-foreground">Anda tidak memiliki izin untuk mengedit role pengguna.</p>
          </div>
        </div>
      }
    >
      <UserRoleEditPageClient id={id} />
    </PermissionGuard>
  );
}
