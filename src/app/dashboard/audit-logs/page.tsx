'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Eye, 
  Edit, 
  Trash, 
  UserPlus,
  LogOut,
  Download,
  Filter,
  Calendar,
  User,
  Activity,
  Search
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  oldValues: any;
  newValues: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  } | null;
}

interface AuditStats {
  total: number;
  byAction: Array<{ action: string; _count: { id: number } }>;
  byEntity: Array<{ entity: string; _count: { id: number } }>;
  recentActivity: AuditLog[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage, actionFilter, entityFilter, userFilter]);

  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      
      if (actionFilter) params.append('action', actionFilter);
      if (entityFilter) params.append('entity', entityFilter);
      if (userFilter) params.append('userId', userFilter);

      const response = await fetch(`/api/audit-logs?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setAuditLogs(data.data);
        setStats(data.stats);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to fetch audit logs');
      }
    } catch (err) {
      setError('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <UserPlus className="w-4 h-4" />;
      case 'UPDATE': return <Edit className="w-4 h-4" />;
      case 'DELETE': return <Trash className="w-4 h-4" />;
      case 'LOGIN': return <Shield className="w-4 h-4" />;
      case 'LOGOUT': return <LogOut className="w-4 h-4" />;
      case 'EXPORT': return <Download className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'LOGIN': return 'bg-purple-100 text-purple-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'EXPORT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatJsonValue = (value: any) => {
    if (!value) return 'N/A';
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  const clearFilters = () => {
    setActionFilter('');
    setEntityFilter('');
    setUserFilter('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor system activities and user actions for security compliance
          </p>
        </div>
        <Button onClick={fetchAuditLogs} variant="outline">
          <Shield className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-800">❌ {error}</p>
        </Card>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actions</p>
                <p className="text-2xl font-bold">{stats.byAction.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entities</p>
                <p className="text-2xl font-bold">{stats.byEntity.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Page</p>
                <p className="text-2xl font-bold">
                  {pagination?.page || 1} / {pagination?.totalPages || 1}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="EXPORT">Export</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Entities</option>
            <option value="User">User</option>
            <option value="Menu">Menu</option>
            <option value="ProductionBatch">Production Batch</option>
            <option value="Distribution">Distribution</option>
            <option value="QualityCheck">Quality Check</option>
          </select>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="px-4"
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Activity Summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Actions Summary
            </h3>
            <div className="space-y-3">
              {stats.byAction.map(({ action, _count }) => (
                <div key={action} className="flex justify-between items-center">
                  <Badge className={getActionColor(action)}>
                    {getActionIcon(action)}
                    <span className="ml-1">{action}</span>
                  </Badge>
                  <span className="font-bold">{_count.id}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Entities Summary
            </h3>
            <div className="space-y-3">
              {stats.byEntity.map(({ entity, _count }) => (
                <div key={entity} className="flex justify-between items-center">
                  <Badge variant="outline">{entity}</Badge>
                  <span className="font-bold">{_count.id}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Audit Logs List */}
      <div className="space-y-4">
        {auditLogs.map((log) => (
          <Card key={log.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <Badge className={getActionColor(log.action)}>
                  {getActionIcon(log.action)}
                  <span className="ml-1">{log.action}</span>
                </Badge>
                <Badge variant="outline">{log.entity}</Badge>
                <span className="text-sm text-gray-600">
                  ID: {log.entityId}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {new Date(log.createdAt).toLocaleString('id-ID')}
                </p>
                {log.ipAddress && (
                  <p className="text-xs text-gray-500">IP: {log.ipAddress}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Info */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  User
                </h4>
                <div>
                  <p className="font-medium">{log.user?.name || 'System'}</p>
                  <p className="text-sm text-muted-foreground">{log.user?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Changes */}
              <div className="md:col-span-2 space-y-4">
                {log.oldValues && (
                  <div>
                    <h4 className="font-medium mb-2">Old Values</h4>
                    <pre className="bg-red-50 p-3 rounded text-xs overflow-x-auto">
                      {formatJsonValue(log.oldValues)}
                    </pre>
                  </div>
                )}
                
                {log.newValues && (
                  <div>
                    <h4 className="font-medium mb-2">New Values</h4>
                    <pre className="bg-green-50 p-3 rounded text-xs overflow-x-auto">
                      {formatJsonValue(log.newValues)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {log.userAgent && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">User Agent:</span> {log.userAgent}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} entries
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm bg-gray-100 rounded">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {auditLogs.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No Audit Logs Found
          </h3>
          <p className="text-muted-foreground">
            No audit logs match your current filters or no logs have been recorded yet.
          </p>
        </Card>
      )}
    </div>
  );
}
