'use client';

import React, { useState, useEffect } from 'react';
import { QualityChecksManagement } from './components';
import { QualityCheck, QualityCheckType, QualityStatus } from '@/generated/prisma';

interface QualityChecksResponse {
  data: QualityCheck[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    statusDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
    totalChecks: number;
  };
}

export default function QualityChecksPage() {
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusDistribution, setStatusDistribution] = useState<Record<string, number>>({});
  const [typeDistribution, setTypeDistribution] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState<{
    search?: string;
    type?: QualityCheckType;
    status?: QualityStatus;
    referenceType?: string;
  }>({});

  const limit = 10;

  const fetchQualityChecks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.referenceType && { referenceType: filters.referenceType })
      });

      const response = await fetch(`/api/quality-checks?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch quality checks');
      }

      const data: QualityChecksResponse = await response.json();
      
      setQualityChecks(data.data);
      setTotalCount(data.pagination.total);
      setStatusDistribution(data.stats.statusDistribution);
      setTypeDistribution(data.stats.typeDistribution);
    } catch (error) {
      console.error('Error fetching quality checks:', error);
      setQualityChecks([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualityChecks();
  }, [page, filters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setPage(1);
  };

  const handleFilterChange = (newFilters: {
    type?: QualityCheckType;
    status?: QualityStatus;
    referenceType?: string;
  }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleRefresh = () => {
    fetchQualityChecks();
  };

  if (loading && qualityChecks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quality checks...</p>
        </div>
      </div>
    );
  }

  return (
    <QualityChecksManagement
      qualityChecks={qualityChecks}
      totalCount={totalCount}
      page={page}
      limit={limit}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onRefresh={handleRefresh}
      statusDistribution={statusDistribution}
      typeDistribution={typeDistribution}
    />
  );
}
