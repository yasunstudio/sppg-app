import { Metadata } from 'next';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { UserRoleDetailsPageClient } from '../components/user-role-details-page-client';

export const metadata: Metadata = {
  title: 'Detail Role Pengguna - SPPG Dashboard',
  description: 'Lihat detail penugasan role pengguna',
};

interface UserRoleDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserRoleDetailsPage({ params }: UserRoleDetailsPageProps) {
  const { id } = await params;

  return (
    <PermissionGuard 
      permission="users.view"
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
            <p className="text-muted-foreground">Anda tidak memiliki izin untuk melihat role pengguna.</p>
          </div>
        </div>
      }
    >
      <UserRoleDetailsPageClient id={id} />
    </PermissionGuard>
  );
}
