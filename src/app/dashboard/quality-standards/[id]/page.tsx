'use client';

import { useQualityStandard, QUALITY_STANDARD_CATEGORIES } from '@/hooks/use-quality-standards';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Target,
  TrendingUp,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getCategoryColor = (category: string) => {
  const colors = {
    TEMPERATURE_CONTROL: 'bg-blue-100 text-blue-800',
    VISUAL_APPEARANCE: 'bg-purple-100 text-purple-800',
    HYGIENE_STANDARDS: 'bg-green-100 text-green-800',
    PORTION_CONTROL: 'bg-orange-100 text-orange-800',
    NUTRITION_VALUE: 'bg-yellow-100 text-yellow-800',
    SAFETY_STANDARDS: 'bg-red-100 text-red-800',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getComplianceStatus = (targetValue: number, currentValue: number | null) => {
  if (currentValue === null) {
    return {
      status: 'not-monitored',
      label: 'Not Monitored',
      color: 'bg-gray-100 text-gray-800',
      icon: AlertTriangle
    };
  }
  
  if (currentValue >= targetValue) {
    return {
      status: 'compliant',
      label: 'Meeting Target',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    };
  } else {
    return {
      status: 'non-compliant',
      label: 'Below Target',
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    };
  }
};

export default function QualityStandardDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { qualityStandard, loading, error } = useQualityStandard(id);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !qualityStandard) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Quality Standard Not Found</h3>
          <p className="text-muted-foreground">
            {error || "The quality standard you're looking for doesn't exist."}
          </p>
          <Button 
            className="mt-4"
            onClick={() => router.push('/dashboard/quality-standards')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quality Standards
          </Button>
        </div>
      </div>
    );
  }

  const categoryLabel = QUALITY_STANDARD_CATEGORIES.find(
    c => c.value === qualityStandard.category
  )?.label || qualityStandard.category;

  const compliance = getComplianceStatus(qualityStandard.targetValue, qualityStandard.currentValue);
  const ComplianceIcon = compliance.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{qualityStandard.name}</h1>
            <p className="text-muted-foreground">Quality Standard Details</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/dashboard/quality-standards/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Standard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Name</h4>
              <p className="text-lg font-semibold">{qualityStandard.name}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
              <p className="text-sm leading-relaxed">{qualityStandard.description}</p>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                <Badge 
                  variant="secondary" 
                  className={getCategoryColor(qualityStandard.category)}
                >
                  {categoryLabel}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                <Badge variant={qualityStandard.isActive ? "default" : "secondary"}>
                  {qualityStandard.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Measurement Values */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Measurement Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Target Value</h4>
                <p className="text-xl font-bold text-blue-600">
                  {qualityStandard.targetValue} {qualityStandard.unit}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Current Value</h4>
                {qualityStandard.currentValue !== null ? (
                  <p className="text-xl font-bold">
                    {qualityStandard.currentValue} {qualityStandard.unit}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Not set</p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Compliance Status</h4>
              <div className="flex items-center gap-2">
                <ComplianceIcon className="h-4 w-4" />
                <Badge 
                  variant="secondary" 
                  className={compliance.color}
                >
                  {compliance.label}
                </Badge>
              </div>
            </div>

            {qualityStandard.currentValue !== null && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target</span>
                      <span>{qualityStandard.targetValue} {qualityStandard.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          qualityStandard.currentValue >= qualityStandard.targetValue 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${Math.min(
                            (qualityStandard.currentValue / qualityStandard.targetValue) * 100, 
                            100
                          )}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current</span>
                      <span className="font-medium">
                        {qualityStandard.currentValue} {qualityStandard.unit}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {qualityStandard.currentValue >= qualityStandard.targetValue ? (
                        <span className="text-green-600">
                          ✓ Meeting target (+{(qualityStandard.currentValue - qualityStandard.targetValue).toFixed(2)} {qualityStandard.unit})
                        </span>
                      ) : (
                        <span className="text-red-600">
                          ✗ Below target (-{(qualityStandard.targetValue - qualityStandard.currentValue).toFixed(2)} {qualityStandard.unit})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Created</h4>
              <p className="text-sm">
                {new Date(qualityStandard.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Last Updated</h4>
              <p className="text-sm">
                {new Date(qualityStandard.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/quality-standards')}
        >
          Back to List
        </Button>
        <Button
          onClick={() => router.push(`/dashboard/quality-standards/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Standard
        </Button>
      </div>
    </div>
  );
}
