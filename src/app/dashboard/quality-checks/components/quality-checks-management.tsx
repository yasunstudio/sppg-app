'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { QualityCheck, QualityCheckType, QualityStatus } from '@/generated/prisma';

interface QualityChecksManagementProps {
  qualityChecks: QualityCheck[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onFilterChange: (filters: {
    type?: QualityCheckType;
    status?: QualityStatus;
    referenceType?: string;
  }) => void;
  onRefresh: () => void;
  statusDistribution?: Record<string, number>;
  typeDistribution?: Record<string, number>;
}

const statusVariants: Record<QualityStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  GOOD: 'default',
  FAIR: 'secondary',
  POOR: 'outline',
  REJECTED: 'destructive',
  PENDING: 'secondary'
};

const typeLabels: Record<QualityCheckType, string> = {
  RAW_MATERIAL: 'Raw Material',
  PRODUCTION: 'Production',
  PACKAGING: 'Packaging',
  DISTRIBUTION: 'Distribution'
};

export function QualityChecksManagement({
  qualityChecks,
  totalCount,
  page,
  limit,
  onPageChange,
  onSearch,
  onFilterChange,
  onRefresh,
  statusDistribution = {},
  typeDistribution = {}
}: QualityChecksManagementProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<QualityCheckType | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<QualityStatus | ''>('');
  const [selectedReferenceType, setSelectedReferenceType] = useState('');

  const totalPages = Math.ceil(totalCount / limit);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleTypeFilter = (type: QualityCheckType | '') => {
    setSelectedType(type);
    onFilterChange({
      type: type || undefined,
      status: selectedStatus || undefined,
      referenceType: selectedReferenceType || undefined
    });
  };

  const handleStatusFilter = (status: QualityStatus | '') => {
    setSelectedStatus(status);
    onFilterChange({
      type: selectedType || undefined,
      status: status || undefined,
      referenceType: selectedReferenceType || undefined
    });
  };

  const handleReferenceTypeFilter = (referenceType: string) => {
    setSelectedReferenceType(referenceType);
    onFilterChange({
      type: selectedType || undefined,
      status: selectedStatus || undefined,
      referenceType: referenceType || undefined
    });
  };

  const clearFilters = () => {
    setSelectedType('');
    setSelectedStatus('');
    setSelectedReferenceType('');
    setSearchTerm('');
    onFilterChange({});
    onSearch('');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatTemperature = (temp: number | null) => {
    return temp ? `${temp}°C` : '-';
  };

  const getQualityScore = (check: QualityCheck) => {
    const factors = [check.color, check.taste, check.aroma, check.texture].filter(Boolean);
    if (factors.length === 0) return '-';
    
    const scores = factors.map(factor => {
      switch (factor?.toLowerCase()) {
        case 'excellent': return 5;
        case 'good': return 4;
        case 'fair': return 3;
        case 'poor': return 2;
        case 'bad': return 1;
        default: return 3;
      }
    });
    
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    return `${average.toFixed(1)}/5`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
            <Icons.CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              All quality checks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Good Quality</CardTitle>
            <Icons.ThumbsUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusDistribution.GOOD || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Passed quality standards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Icons.Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statusDistribution.PENDING || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting inspection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Icons.XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statusDistribution.REJECTED || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Failed quality standards
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Quality Checks</CardTitle>
              <CardDescription>
                Manage and monitor quality control inspections
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
              >
                <Icons.RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/dashboard/quality-checks/create')}
              >
                <Icons.Plus className="h-4 w-4 mr-2" />
                Add Quality Check
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by reference ID, checker, or notes..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  {Object.values(QualityStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Reference Type"
                value={selectedReferenceType}
                onChange={(e) => handleReferenceTypeFilter(e.target.value)}
                className="w-[140px]"
              />

              {(selectedType || selectedStatus || selectedReferenceType || searchTerm) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <Icons.X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Checked By</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Quality Score</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualityChecks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Icons.FileX className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No quality checks found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  qualityChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{check.referenceId}</div>
                          <div className="text-sm text-muted-foreground">
                            {check.referenceType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {typeLabels[check.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[check.status]}>
                          {check.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {check.checkedBy || (
                          <span className="text-muted-foreground">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>{formatTemperature(check.temperature)}</TableCell>
                      <TableCell>{getQualityScore(check)}</TableCell>
                      <TableCell>{formatDate(check.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Icons.MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/quality-checks/${check.id}`)}
                            >
                              <Icons.Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/quality-checks/${check.id}/edit`)}
                            >
                              <Icons.Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                >
                  <Icons.ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                  <Icons.ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
