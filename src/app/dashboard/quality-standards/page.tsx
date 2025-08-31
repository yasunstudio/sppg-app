'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useQualityStandards, 
  useQualityStandardsStats,
  QUALITY_STANDARD_CATEGORIES,
  type QualityStandardCategory 
} from '@/hooks/use-quality-standards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Target,
  TrendingUp,
  Activity,
  Shield
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
} from '@/components/ui/pagination';

const getCategoryColor = (category: QualityStandardCategory) => {
  const colors = {
    TEMPERATURE_CONTROL: 'bg-blue-100 text-blue-800',
    VISUAL_APPEARANCE: 'bg-purple-100 text-purple-800',
    HYGIENE_STANDARDS: 'bg-green-100 text-green-800',
    PORTION_CONTROL: 'bg-orange-100 text-orange-800',
    NUTRITION_VALUE: 'bg-yellow-100 text-yellow-800',
    SAFETY_STANDARDS: 'bg-red-100 text-red-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const getComplianceStatus = (targetValue: number, currentValue: number | null) => {
  if (currentValue === null) return null;
  
  if (currentValue >= targetValue) {
    return { status: 'compliant', label: 'Meeting Target', color: 'bg-green-100 text-green-800' };
  } else {
    return { status: 'non-compliant', label: 'Below Target', color: 'bg-red-100 text-red-800' };
  }
};

export default function QualityStandardsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { 
    qualityStandards, 
    pagination, 
    loading, 
    error,
    deleteQualityStandard 
  } = useQualityStandards(page, limit, search, category, isActive);

  const { stats } = useQualityStandardsStats();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryFilter = (value: string) => {
    setCategory(value === 'all' ? '' : value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    if (value === 'all') {
      setIsActive(undefined);
    } else if (value === 'active') {
      setIsActive(true);
    } else if (value === 'inactive') {
      setIsActive(false);
    }
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQualityStandard(id);
    } catch (error) {
      console.error('Error deleting quality standard:', error);
    }
  };

  if (loading && !qualityStandards.length) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Standards</h1>
          <p className="text-muted-foreground">
            Manage quality standards and monitoring metrics
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/quality-standards/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Quality Standard
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Standards</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStandards}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeStandards} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.complianceRate}%</div>
              <p className="text-xs text-muted-foreground">
                Meeting targets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monitored Standards</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monitoredStandards}</div>
              <p className="text-xs text-muted-foreground">
                With current values
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Standards</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentStandards}</div>
              <p className="text-xs text-muted-foreground">
                Last 7 days
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Filter quality standards by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quality standards..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {QUALITY_STANDARD_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quality Standards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Standards</CardTitle>
          <CardDescription>
            {pagination.total} total quality standards found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Target Value</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qualityStandards.map((standard) => {
                const compliance = getComplianceStatus(standard.targetValue, standard.currentValue);
                return (
                  <TableRow key={standard.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{standard.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {standard.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={getCategoryColor(standard.category)}
                      >
                        {QUALITY_STANDARD_CATEGORIES.find(c => c.value === standard.category)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {standard.targetValue} {standard.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      {standard.currentValue !== null ? (
                        <span>
                          {standard.currentValue} {standard.unit}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not set</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {compliance ? (
                        <Badge 
                          variant="secondary" 
                          className={compliance.color}
                        >
                          {compliance.label}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not monitored</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={standard.isActive ? "default" : "secondary"}>
                        {standard.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/quality-standards/${standard.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/quality-standards/${standard.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Quality Standard</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{standard.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(standard.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {qualityStandards.length === 0 && !loading && (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No quality standards found</h3>
              <p className="text-muted-foreground">
                {search || category || isActive !== undefined
                  ? "Try adjusting your filters"
                  : "Get started by creating your first quality standard"}
              </p>
              {!search && !category && isActive === undefined && (
                <Button 
                  className="mt-4"
                  onClick={() => router.push('/dashboard/quality-standards/create')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Quality Standard
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={pagination.pages}
                totalCount={pagination.total}
                limit={limit}
                hasNextPage={page < pagination.pages}
                hasPreviousPage={page > 1}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="text-center py-4 text-red-600">
          Error: {error}
        </div>
      )}
    </div>
  );
}
