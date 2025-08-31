'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQualityStandards, QUALITY_STANDARD_CATEGORIES, type CreateQualityStandardData } from '@/hooks/use-quality-standards';
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

export default function CreateQualityStandardPage() {
  const router = useRouter();
  const { createQualityStandard } = useQualityStandards();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateQualityStandardData>({
    name: '',
    description: '',
    targetValue: 0,
    currentValue: null,
    unit: '',
    category: 'TEMPERATURE_CONTROL',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createQualityStandard(formData);
      router.push('/dashboard/quality-standards');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof CreateQualityStandardData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Create Quality Standard</h1>
          <p className="text-muted-foreground">
            Add a new quality standard for monitoring and compliance
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
              Define the fundamental details of the quality standard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Standard Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Food Temperature Control"
                  value={formData.name}
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
                value={formData.description}
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
              Set target values and current measurements for monitoring
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
                  value={formData.targetValue}
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
                  value={formData.unit}
                  onChange={(e) => updateFormData('unit', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Measurement Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Target Value: The desired or required level for this quality standard</li>
                <li>• Current Value: Leave empty if not currently being measured</li>
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
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Quality Standard
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
