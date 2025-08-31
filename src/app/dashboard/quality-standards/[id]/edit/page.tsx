'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useQualityStandard, 
  useQualityStandards, 
  QUALITY_STANDARD_CATEGORIES,
  type UpdateQualityStandardData 
} from '@/hooks/use-quality-standards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Save, Target } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditQualityStandardPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { qualityStandard, loading: fetchLoading, error: fetchError } = useQualityStandard(id);
  const { updateQualityStandard } = useQualityStandards();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateQualityStandardData>({
    name: '',
    description: '',
    targetValue: 0,
    currentValue: null,
    unit: '',
    category: 'TEMPERATURE_CONTROL',
    isActive: true,
  });

  useEffect(() => {
    if (qualityStandard) {
      setFormData({
        name: qualityStandard.name,
        description: qualityStandard.description,
        targetValue: qualityStandard.targetValue,
        currentValue: qualityStandard.currentValue,
        unit: qualityStandard.unit,
        category: qualityStandard.category,
        isActive: qualityStandard.isActive,
      });
    }
  }, [qualityStandard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateQualityStandard(id, formData);
      router.push(`/dashboard/quality-standards/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof UpdateQualityStandardData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !qualityStandard) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Quality Standard Not Found</h3>
          <p className="text-muted-foreground">
            {fetchError || "The quality standard you're trying to edit doesn't exist."}
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

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Quality Standard</h1>
          <p className="text-muted-foreground">
            Update the quality standard details and monitoring parameters
          </p>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Update the fundamental details of the quality standard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Standard Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Food Temperature Control"
                  value={formData.name || ''}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateFormData('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITY_STANDARD_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the quality standard, its purpose, and measurement criteria..."
                value={formData.description || ''}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Measurement Values</CardTitle>
            <CardDescription>
              Update target values and current measurements for monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetValue">Target Value *</Label>
                <Input
                  id="targetValue"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.targetValue || ''}
                  onChange={(e) => updateFormData('targetValue', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  type="number"
                  step="0.01"
                  placeholder="0.00 (optional)"
                  value={formData.currentValue || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateFormData('currentValue', value === '' ? null : parseFloat(value));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit of Measurement *</Label>
                <Input
                  id="unit"
                  placeholder="e.g., °C, %, mg/L, points"
                  value={formData.unit || ''}
                  onChange={(e) => updateFormData('unit', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Show comparison if both values exist */}
            {formData.targetValue && formData.currentValue !== null && formData.currentValue !== undefined && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Current Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Target: {formData.targetValue} {formData.unit}</span>
                    <span>Current: {formData.currentValue} {formData.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        formData.currentValue >= formData.targetValue 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(
                          (formData.currentValue / formData.targetValue) * 100, 
                          100
                        )}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-800">
                    {formData.currentValue >= formData.targetValue ? (
                      <>✓ Meeting target (+{(formData.currentValue - formData.targetValue).toFixed(2)} {formData.unit})</>
                    ) : (
                      <>✗ Below target (-{(formData.targetValue - formData.currentValue).toFixed(2)} {formData.unit})</>
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Measurement Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Target Value: The desired or required level for this quality standard</li>
                <li>• Current Value: Set to null to stop monitoring this standard</li>
                <li>• Unit: Specify the measurement unit (temperature, percentage, etc.)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure the status and behavior of this quality standard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => updateFormData('isActive', checked)}
              />
              <Label htmlFor="isActive">
                Active Status
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Only active quality standards will be monitored and included in compliance reports
            </p>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Quality Standard
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
