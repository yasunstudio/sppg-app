'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { QualityCheckEdit } from '../../components';
import { QualityCheck } from '@/generated/prisma';

export default function EditQualityCheckPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [qualityCheck, setQualityCheck] = useState<QualityCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQualityCheck = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/quality-checks/${id}`);
        
        if (!response.ok) {
          throw new Error('Quality check not found');
        }

        const data = await response.json();
        setQualityCheck(data.data);
      } catch (error) {
        console.error('Error fetching quality check:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch quality check');
      } finally {
        setLoading(false);
      }
    };

    fetchQualityCheck();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quality check...</p>
        </div>
      </div>
    );
  }

  if (error || !qualityCheck) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Quality Check Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || 'The quality check you are looking for does not exist.'}
          </p>
        </div>
      </div>
    );
  }

  return <QualityCheckEdit qualityCheck={qualityCheck} />;
}
