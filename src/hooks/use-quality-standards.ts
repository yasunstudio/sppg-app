import { useState, useEffect } from 'react';

export type QualityStandardCategory = 
  | 'TEMPERATURE_CONTROL'
  | 'VISUAL_APPEARANCE'
  | 'HYGIENE_STANDARDS'
  | 'PORTION_CONTROL'
  | 'NUTRITION_VALUE'
  | 'SAFETY_STANDARDS';

export interface QualityStandard {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number | null;
  unit: string;
  category: QualityStandardCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QualityStandardStats {
  totalStandards: number;
  activeStandards: number;
  monitoredStandards: number;
  exceededStandards: number;
  belowTargetStandards: number;
  recentStandards: number;
  complianceRate: number;
  standardsByCategory: Array<{
    category: QualityStandardCategory;
    count: number;
  }>;
}

export interface QualityStandardsResponse {
  qualityStandards: QualityStandard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateQualityStandardData {
  name: string;
  description: string;
  targetValue: number;
  currentValue?: number | null;
  unit: string;
  category: QualityStandardCategory;
  isActive?: boolean;
}

export interface UpdateQualityStandardData {
  name?: string;
  description?: string;
  targetValue?: number;
  currentValue?: number | null;
  unit?: string;
  category?: QualityStandardCategory;
  isActive?: boolean;
}

export function useQualityStandards(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  category: string = '',
  isActive?: boolean
) {
  const [qualityStandards, setQualityStandards] = useState<QualityStandard[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQualityStandards = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (isActive !== undefined) params.append('isActive', isActive.toString());

      const response = await fetch(`/api/quality-standards?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch quality standards');
      }

      const data: QualityStandardsResponse = await response.json();
      setQualityStandards(data.qualityStandards);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualityStandards();
  }, [page, limit, search, category, isActive]);

  const createQualityStandard = async (data: CreateQualityStandardData): Promise<QualityStandard> => {
    const response = await fetch('/api/quality-standards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create quality standard');
    }

    const qualityStandard = await response.json();
    await fetchQualityStandards(); // Refresh the list
    return qualityStandard;
  };

  const updateQualityStandard = async (id: string, data: UpdateQualityStandardData): Promise<QualityStandard> => {
    const response = await fetch(`/api/quality-standards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update quality standard');
    }

    const qualityStandard = await response.json();
    await fetchQualityStandards(); // Refresh the list
    return qualityStandard;
  };

  const deleteQualityStandard = async (id: string): Promise<void> => {
    const response = await fetch(`/api/quality-standards/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete quality standard');
    }

    await fetchQualityStandards(); // Refresh the list
  };

  return {
    qualityStandards,
    pagination,
    loading,
    error,
    refetch: fetchQualityStandards,
    createQualityStandard,
    updateQualityStandard,
    deleteQualityStandard,
  };
}

export function useQualityStandard(id: string) {
  const [qualityStandard, setQualityStandard] = useState<QualityStandard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQualityStandard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/quality-standards/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch quality standard');
      }

      const data: QualityStandard = await response.json();
      setQualityStandard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQualityStandard();
    }
  }, [id]);

  return {
    qualityStandard,
    loading,
    error,
    refetch: fetchQualityStandard,
  };
}

export function useQualityStandardsStats() {
  const [stats, setStats] = useState<QualityStandardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/quality-standards/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch quality standards statistics');
      }

      const data: QualityStandardStats = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export const QUALITY_STANDARD_CATEGORIES: Array<{
  value: QualityStandardCategory;
  label: string;
}> = [
  { value: 'TEMPERATURE_CONTROL', label: 'Temperature Control' },
  { value: 'VISUAL_APPEARANCE', label: 'Visual Appearance' },
  { value: 'HYGIENE_STANDARDS', label: 'Hygiene Standards' },
  { value: 'PORTION_CONTROL', label: 'Portion Control' },
  { value: 'NUTRITION_VALUE', label: 'Nutrition Value' },
  { value: 'SAFETY_STANDARDS', label: 'Safety Standards' },
];
