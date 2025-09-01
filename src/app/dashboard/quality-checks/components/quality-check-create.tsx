'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { QualityCheckType, QualityStatus } from '@/generated/prisma';
import { toast } from '@/lib/toast';

const typeLabels: Record<QualityCheckType, string> = {
  RAW_MATERIAL: 'Raw Material',
  PRODUCTION: 'Production',
  PACKAGING: 'Packaging',
  DISTRIBUTION: 'Distribution'
};

const statusLabels: Record<QualityStatus, string> = {
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
  REJECTED: 'Rejected',
  PENDING: 'Pending'
};

const qualityOptions = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
  { value: 'bad', label: 'Bad' }
];

interface QualityCheckCreateProps {
  onSuccess?: () => void;
  initialData?: {
    referenceType?: string;
    referenceId?: string;
    type?: QualityCheckType;
  };
}

export function QualityCheckCreate({ onSuccess, initialData }: QualityCheckCreateProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: initialData?.type || '' as QualityCheckType | '',
    referenceType: initialData?.referenceType || '',
    referenceId: initialData?.referenceId || '',
    checkedBy: '',
    color: '',
    taste: '',
    aroma: '',
    texture: '',
    temperature: '',
    status: 'PENDING' as QualityStatus,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Quality check type is required';
    }
    if (!formData.referenceType) {
      newErrors.referenceType = 'Reference type is required';
    }
    if (!formData.referenceId) {
      newErrors.referenceId = 'Reference ID is required';
    }
    if (formData.temperature && isNaN(parseFloat(formData.temperature))) {
      newErrors.temperature = 'Temperature must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/quality-checks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          temperature: formData.temperature ? parseFloat(formData.temperature) : null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create quality check');
      }

      toast.success('Quality check created successfully');
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/quality-checks');
      }
    } catch (error) {
      console.error('Error creating quality check:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create quality check');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.CheckCircle className="h-5 w-5" />
          Create Quality Check
        </CardTitle>
        <CardDescription>
          Add a new quality control inspection record
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Check Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select check type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reference Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referenceType">Reference Type *</Label>
              <Input
                id="referenceType"
                value={formData.referenceType}
                onChange={(e) => handleInputChange('referenceType', e.target.value)}
                placeholder="e.g., ProductionBatch, Menu, Delivery"
              />
              {errors.referenceType && (
                <p className="text-sm text-red-600">{errors.referenceType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referenceId">Reference ID *</Label>
              <Input
                id="referenceId"
                value={formData.referenceId}
                onChange={(e) => handleInputChange('referenceId', e.target.value)}
                placeholder="Enter reference ID"
              />
              {errors.referenceId && (
                <p className="text-sm text-red-600">{errors.referenceId}</p>
              )}
            </div>
          </div>

          {/* Checker Information */}
          <div className="space-y-2">
            <Label htmlFor="checkedBy">Checked By</Label>
            <Input
              id="checkedBy"
              value={formData.checkedBy}
              onChange={(e) => handleInputChange('checkedBy', e.target.value)}
              placeholder="Name of the quality inspector"
            />
          </div>

          {/* Quality Attributes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quality Attributes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => handleInputChange('color', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taste">Taste</Label>
                <Select
                  value={formData.taste}
                  onValueChange={(value) => handleInputChange('taste', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select taste quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aroma">Aroma</Label>
                <Select
                  value={formData.aroma}
                  onValueChange={(value) => handleInputChange('aroma', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select aroma quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="texture">Texture</Label>
                <Select
                  value={formData.texture}
                  onValueChange={(value) => handleInputChange('texture', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select texture quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <div className="relative">
                <Icons.Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  placeholder="e.g., 75.5"
                  className="pl-10"
                />
              </div>
              {errors.temperature && (
                <p className="text-sm text-red-600">{errors.temperature}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional observations or comments..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Create Quality Check
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
