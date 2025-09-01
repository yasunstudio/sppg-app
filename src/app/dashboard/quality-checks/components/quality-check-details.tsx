'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { QualityCheck, QualityCheckType, QualityStatus } from '@/generated/prisma';

interface QualityCheckDetailsProps {
  qualityCheck: QualityCheck;
  onEdit?: () => void;
  onDelete?: () => void;
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

const qualityLabels: Record<string, { label: string; color: string }> = {
  excellent: { label: 'Excellent', color: 'text-green-700 bg-green-50 border-green-200' },
  good: { label: 'Good', color: 'text-green-600 bg-green-50 border-green-200' },
  fair: { label: 'Fair', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  poor: { label: 'Poor', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  bad: { label: 'Bad', color: 'text-red-600 bg-red-50 border-red-200' }
};

export function QualityCheckDetails({ qualityCheck, onEdit, onDelete }: QualityCheckDetailsProps) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(new Date(date));
  };

  const formatTemperature = (temp: number | null) => {
    return temp ? `${temp}°C` : 'Not measured';
  };

  const getQualityScore = () => {
    const factors = [qualityCheck.color, qualityCheck.taste, qualityCheck.aroma, qualityCheck.texture].filter(Boolean);
    if (factors.length === 0) return null;
    
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
    return {
      score: average.toFixed(1),
      total: 5,
      factors: factors.length
    };
  };

  const renderQualityAttribute = (label: string, value: string | null) => {
    if (!value) return null;
    
    const qualityInfo = qualityLabels[value.toLowerCase()];
    
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {qualityInfo ? (
          <Badge className={qualityInfo.color} variant="outline">
            {qualityInfo.label}
          </Badge>
        ) : (
          <span className="text-sm">{value}</span>
        )}
      </div>
    );
  };

  const qualityScore = getQualityScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quality Check Details</h1>
          <p className="text-muted-foreground">
            View comprehensive quality inspection information
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <Icons.ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={onEdit || (() => router.push(`/dashboard/quality-checks/${qualityCheck.id}/edit`))}
          >
            <Icons.Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.CheckCircle className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Check Type</label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {typeLabels[qualityCheck.type]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={statusVariants[qualityCheck.status]}>
                      {qualityCheck.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reference Type</label>
                  <p className="mt-1 font-medium">{qualityCheck.referenceType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reference ID</label>
                  <p className="mt-1 font-medium">{qualityCheck.referenceId}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Checked By</label>
                <p className="mt-1">
                  {qualityCheck.checkedBy || (
                    <span className="text-muted-foreground italic">Not assigned</span>
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Temperature</label>
                <div className="mt-1 flex items-center gap-2">
                  <Icons.Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTemperature(qualityCheck.temperature)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Attributes</CardTitle>
              <CardDescription>
                Sensory evaluation results for various quality factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {renderQualityAttribute('Color', qualityCheck.color)}
                {renderQualityAttribute('Taste', qualityCheck.taste)}
                {renderQualityAttribute('Aroma', qualityCheck.aroma)}
                {renderQualityAttribute('Texture', qualityCheck.texture)}
              </div>
              
              {!qualityCheck.color && !qualityCheck.taste && !qualityCheck.aroma && !qualityCheck.texture && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icons.AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>No quality attributes recorded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {qualityCheck.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes & Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {qualityCheck.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quality Score */}
          {qualityScore && (
            <Card>
              <CardHeader>
                <CardTitle>Quality Score</CardTitle>
                <CardDescription>
                  Overall quality rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {qualityScore.score}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    out of {qualityScore.total}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on {qualityScore.factors} factor{qualityScore.factors !== 1 ? 's' : ''}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Icons.Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(qualityCheck.createdAt)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Icons.Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(qualityCheck.updatedAt)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/dashboard/quality-checks/${qualityCheck.id}/edit`)}
              >
                <Icons.Edit className="h-4 w-4 mr-2" />
                Edit Check
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.print()}
              >
                <Icons.FileX className="h-4 w-4 mr-2" />
                Print Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
