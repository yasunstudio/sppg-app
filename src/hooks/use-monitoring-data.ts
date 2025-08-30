import { useState, useEffect, useCallback } from 'react';
import { MonitoringData } from '@/types/monitoring';

export function useMonitoringData(initialPeriod: string = 'today') {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(initialPeriod);
  
  // Load auto refresh settings from localStorage
  const [autoRefresh, setAutoRefresh] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('monitoring-auto-refresh') === 'true';
    }
    return false;
  });
  
  const [refreshInterval, setRefreshInterval] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('monitoring-refresh-interval');
      return saved ? parseInt(saved) : 30000;
    }
    return 30000;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('monitoring-auto-refresh', autoRefresh.toString());
      console.log('Auto refresh setting saved:', autoRefresh);
    }
  }, [autoRefresh]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('monitoring-refresh-interval', refreshInterval.toString());
      console.log('Refresh interval setting saved:', refreshInterval);
    }
  }, [refreshInterval]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/monitoring?period=${period}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch monitoring data: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch monitoring data');
      console.error('Error fetching monitoring data:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Fetch data when period changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh only when enabled
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefresh, refreshInterval]);

  return { 
    data, 
    loading, 
    error,
    period, 
    setPeriod,
    fetchData,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval
  };
}
